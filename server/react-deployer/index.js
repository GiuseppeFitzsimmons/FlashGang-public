const AWS = require('aws-sdk');

exports.handler = async (event, context, callback) => {
    // Install watchdog timer as the first thing
    setupWatchdogTimer(event, context, callback)
    console.log('REQUEST RECEIVED:\n' + JSON.stringify(event))
    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
      try {
        if (event.RequestType === 'Create') {
          console.log('CREATE!')
          var result=await copyTo(s3, event);
          await sendCloudFormationResponse(event, result.Id ? 'SUCCESS': 'FAILED', { 
            'Message': 'Resource update successful!', Id: result.Id,
            Reason: result.error ? result.error.message: ''
           })
        } else if (event.RequestType === 'Update') {
          console.log('UDPATE!')
          //TODO if the location of the backup has changed, move everything to the new location
          var result=await copyTo(s3, event);
          await sendCloudFormationResponse(event, result.Id ? 'SUCCESS': 'FAILED', { 
            'Message': 'Resource update successful!', Id: result.Id,
            Reason: result.error ? result.error.message : ''
           })
        } else if (event.RequestType === 'Delete') {
          await cleanup(s3, event);
          await sendCloudFormationResponse(event, 'SUCCESS', { 
            'Message': 'Resource delete successful!', Id: event.PhysicalResourceId
           })
        } else {
          console.log('FAILED!')
          await sendCloudFormationResponse(event, 'FAILED')
        }
      
      } catch (error) {
        console.error(`Error for request type ${event.RequestType}:`, error);
        var _message={'Message': `Error for request type ${event.RequestType}:`};
        if (error) {
          _message.Reason=error.toString();
        }
        await sendCloudFormationResponse(event, 'FAILED', _message)
      }
  }
  async function copyTo(s3, event) {
    const sourceDirectory=event.ResourceProperties.SourceDirectory ? event.ResourceProperties.SourceDirectory : 'build';
    const targetBucket=event.ResourceProperties.Bucket;
    const targetDirectory=event.ResourceProperties.TargetDirectory;
    const backupDirectory=event.ResourceProperties.BackupDirectory ? event.ResourceProperties.BackupDirectory : `backup-${targetDirectory}`;
    const tempKey=`${targetDirectory}_backup_${new Date().getTime()}`;
    if (!targetBucket || targetBucket=='' || 
      !targetDirectory || targetDirectory=='') {
      console.log("Parameters are missing. Deployment of the static files will be skipped.",
        {
          sourceDirectory: sourceDirectory,
          targetBucket: targetBucket,
          targetDirectory: targetDirectory,
          backupDirectory: backupDirectory,
        }
      );
      return {Id: event.PhysicalResourceId ? event.PhysicalResourceId : 'quiet-fail'};
    }
    //First make a backup of the target, assuming it exists
    const listparams = {
      Bucket: targetBucket,
      Prefix: targetDirectory,
      MaxKeys: 1
    };
    const allObjects = await s3.listObjects(listparams).promise();
      if (allObjects.Contents && allObjects.Contents.length > 0) {
        await s3CopyFolder(s3, targetBucket, targetDirectory+'/', targetBucket, backupDirectory+'/'+tempKey+'/');
        await s3.deleteObject({
          Bucket: targetBucket,
          Key: targetDirectory,
        }).promise();
      }
    await emptyS3Directory(s3, targetBucket, targetDirectory);
    //await s3CopyFolder(s3, sourceBucket, sourceDirectory+'/', targetBucket, targetDirectory+'/');
    await s3CopyFolder(s3, sourceDirectory+'/', targetBucket, targetDirectory+'/');

    return {Id:tempKey};
  }
  async function cleanup(s3, event) {
    console.log("cleanup enter");
    //TODO revisit this. Maybe we'll want to have the option of using a source bucket.
    //const sourceBucket=event.ResourceProperties.SourceBucket;
    //const sourceDirectory=event.ResourceProperties.SourceDirectory;
    const targetBucket=event.ResourceProperties.TargetBucket;
    const targetDirectory=event.ResourceProperties.TargetDirectory;
    const backupDirectory=event.ResourceProperties.BackupDirectory;


    const allObjectsToDelete = await s3.listObjectsV2({
      Bucket: targetBucket,
      Prefix: backupDirectory+'/',
      Delimiter: '/'
    }).promise();
    if (allObjectsToDelete.CommonPrefixes && allObjectsToDelete.CommonPrefixes.length > 0) {
      _allObjectsToSort=[];
      for (_f in allObjectsToDelete.CommonPrefixes) {
        _folder=allObjectsToDelete.CommonPrefixes[_f];
        try {
          var _object={};
          _object.key=_folder.Prefix;
          var millis=_object.key.substr(_object.key.lastIndexOf('_')+1);
          if (millis.charAt(millis.length-1)=='/') {
            millis=millis.substr(0,millis.length-1);
          }
          _object.LastModified=new Date(millis*1);
          _allObjectsToSort.push(_object);
        } catch (e) {
          console.log("Failing to get object ",_folder.Prefix, e);
        }
      }
      _allObjectsToSort.sort((from, to)=>{
        return new Date(to.LastModified).getTime()-new Date(from.LastModified).getTime();
      });
      //Now we have all backup folders in in descending date order (the latest at the top)
      //If the physicalId of this event is the same as the latest backup, then this is a rollback
      var _latestKey='0';
      var _oldestKey='0';
      if (_allObjectsToSort.length>0) {
        _latestKey=_allObjectsToSort[0].key.substr(0, _allObjectsToSort[0].key.lastIndexOf('/'));
        _latestKey=_latestKey.replace(backupDirectory+'/','');
        _oldestKey=_allObjectsToSort[_allObjectsToSort.length-1].key.substr(0, _allObjectsToSort[_allObjectsToSort.length-1].key.lastIndexOf('/'));
      }
      if (_latestKey==event.PhysicalResourceId) {
        console.log(_latestKey+" is equal to "+event.PhysicalResourceId+", so this is assumed to be a rollback.");
        //copy the last backup back to the targetFolder
        await emptyS3Directory(s3, targetBucket, targetDirectory);
        await s3CopyFolder(s3, targetBucket, _latestKey+'/', targetBucket, targetDirectory+'/');
      } else if (_oldestKey==event.PhysicalResourceId) {
        console.log(_oldestKey+" is equal to "+event.PhysicalResourceId+", so this is assumed to be a delete everything.");
        //Actually that won't work - the oldest key will have been deleted by now.
        //On the other hand, logically then in the case of a delete all, the physical
        //ID will either equal the oldest key or won't match anything.
        //Actually, that won't work either in the case that oldest and latest are the same, meaning there's only 
        //been one backup since the delete was requested.
      } else {
        var maxBackups=2;
        if (event.ResourceProperties.MaxBackups && 
          event.ResourceProperties.MaxBackups>maxBackups &&
          !isNaN(event.ResourceProperties.MaxBackups)) {
          maxBackups=event.ResourceProperties.MaxBackups;
        }
        if (_allObjectsToSort.length>maxBackups) {
          _allObjectsToSort.splice(0, maxBackups);
        }
        for (_d in _allObjectsToSort) {
          _deletable=_allObjectsToSort[_d];
          console.log("deleting backup", _deletable);
          await emptyS3Directory(s3, targetBucket, backupDirectory, _allObjectsToSort);
        }
      }
    }
  }
  async function emptyS3Directory(s3, bucket, dir, exceptions) {
    const listParams = {
        Bucket: bucket,
        Prefix: dir
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();
    if (exceptions) {
      _contents=[];
      listedObjects.Contents.forEach(c=>{
        _add=true;
        exceptions.forEach(ex=>{
          if (c.Key.indexOf(ex.key)>-1) {
            _add=false;
          }
        })
        if (_add) {
          _contents.push(c);
        }
      })
      listedObjects.Contents=_contents;
    }
    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir, exceptions);
}
async function s3CopyFolder(s3, source, targetBucket, dest) {
    console.log("s3CopyFolder, enter", source, targetBucket, dest);
    const {execSync} = require('child_process');
    let syncCommandResult=execSync(`aws s3 sync ${source}/ s3://${targetBucket}/${dest}/`).toString();
    console.log("s3CopyFolder, done", syncCommandResult);
}
  async function s3CopyFolderOld(s3, sourceBucket, source, targetBucket, dest) {
    // sanity check: source and dest must end with '/'
    console.log("s3CopyFolder", sourceBucket, source, targetBucket, dest);
    if (!source.endsWith('/') || !dest.endsWith('/')) {
      return Promise.reject(new Error('source or dest must ends with fwd slash'));
    }
  
    const listResponse = await s3.listObjectsV2({
      Bucket: sourceBucket,
      Prefix: source,
      Delimiter: '/',
    }).promise();
  
    // copy objects
    await Promise.all(
      listResponse.Contents.map(async (file) => {
        await s3.copyObject({
          Bucket: targetBucket,
          CopySource: `${sourceBucket}/${file.Key}`,
          Key: `${dest}${file.Key.replace(listResponse.Prefix, '')}`,
        }).promise();
      }),
    );
  
    // recursive copy sub-folders
    await Promise.all(
      listResponse.CommonPrefixes.map(async (folder) => {
        console.log("copying", folder);
        await s3CopyFolder(
          s3,
          sourceBucket,
          `${folder.Prefix}`,
          targetBucket,
          `${dest}${folder.Prefix.replace(listResponse.Prefix, '')}`,
        );
      }),
    );
  
    return Promise.resolve('ok');
  }
  
  function setupWatchdogTimer (event, context, callback) {
    const timeoutHandler = () => {
      console.log('Timeout FAILURE!')
      // Emit event to 'sendResponse', then callback with an error from this
      // function
      new Promise(() => sendCloudFormationResponse(event, 'FAILED', {Message:"Timeout", Id: event.LogicalResourceId, Reason:"Timeout copying files to S3 bucket"}))
        .then(() => callback(new Error('Function timed out')))
    }
  
    // Set timer so it triggers one second before this function would timeout
    console.log("REMAINING TIME ", context.getRemainingTimeInMillis());
    setTimeout(timeoutHandler, context.getRemainingTimeInMillis() - 1000)
  }
  

async function sendCloudFormationResponse(event, responseStatus, responseData) {
  //console.log("sendCloudFormationResponse", responseStatus, JSON.stringify(responseData));
  var _payload=JSON.stringify({
    StackId: event.StackId,
    RequestId: event.RequestId,
    PhysicalResourceId: responseData.Id,
    LogicalResourceId: event.LogicalResourceId,
    ResponseURL: event.ResponseURL,
    ResponseStatus: responseStatus,
    ResponseData: responseData
  });
  console.log("sendCloudFormationResponse, payload", _payload);
  var params = {
      FunctionName: 'CloudFormationSendResponse',
      InvocationType: 'RequestResponse',
      Payload: _payload
  };
  
  var lambda = new AWS.Lambda();
  var response = await lambda.invoke(params).promise();
  
  if (response.FunctionError) {
    console.log("ERROR SENDING RESPONSE", response);
      var responseError = JSON.parse(response.Payload);
      throw new Error(responseError.errorMessage);
  }
}