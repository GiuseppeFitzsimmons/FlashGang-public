const fs=require('fs');
const {execSync} = require('child_process');
let installed;
let profileArgument='';
let deployParameters='deploy-parameters-dev.json'
let stackName='flashgang-dev'
let environment='dev'
let install='false'
let installArgument='';
console.log('deploy.js in action')
process.argv.forEach(function (val, index, array) {
    if (val=='--profile') {
        profileArgument='--profile '+array[index+1];
    }
    if (val=='--environment') {
        environment=array[index+1];
    }
    if (val=='--install') {
        installArgument='--install '+array[index+1];
    }
    if (val=='--client') {
        installClient=array[index+1];
    }
  });
  if (environment==='local') {
    deployParameters='deploy-parameters-local.json'
    stackName='CrockStack'
  } else if (environment==='prod') {
    deployParameters='deploy-parameters-prod.json'
    stackName='flashgang-prod'
  }
if (process.platform==='darwin') {
    profileArgument='--profile phillip'
}
process.chdir('server');
let deployed=execSync(`node server-deploy.js --stack-name ${stackName} ${installArgument} --deploy-parameters ${deployParameters} ${profileArgument}`,  {stdio: 'inherit'});
//console.log("done deploying server", deployed.toString());
process.chdir('..');
console.log(process.cwd())

if (installClient==='true') {
    const parameters=require(`./server/${deployParameters}`);
    process.chdir('client');
    deployed=execSync(`node deploy.js --bucket ${parameters.Parameters.BucketName} ${profileArgument}`,  {stdio: 'inherit'});
}

