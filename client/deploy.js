const fs=require('fs');
const {execSync} = require('child_process');
const rimraf = require("rimraf");

console.log("WORKING DIRECTORY",process.cwd())
var bucketName='dev.flashgang.bucket';
var buildResult=build()
console.log(buildResult);
if (buildResult.error) {
    console.log("build failed", JSON.stringify(buildResult.error,'  '));
    console.log("EXITING");
    process.exit();
}
var files=fs.readdirSync('build');
var precacheFile;
var serviceWorkerFile='service-worker.js'
files.forEach(file=>{
    if (file.indexOf('precache-manifest')>-1) {
        precacheFile=file;
    } 
})
profileArgument='';
process.argv.forEach(function (val, index, array) {
    if (val=='--profile') {
        profileArgument='--profile '+array[index+1];
    }
    if (val=='--bucket') {
        bucketName=array[index+1];
    }
  });
console.log(profileArgument);
execSync('aws s3 rm s3://'+bucketName+'/flashgang/ --recursive --exclude "" '+profileArgument);
execSync('aws s3 sync build/ s3://'+bucketName+'/flashgang/  '+profileArgument);
execSync('aws s3 cp build/'+serviceWorkerFile+' s3://'+bucketName+'/flashgang/'+serviceWorkerFile+' --metadata Content-Type=text/javascript --acl public-read-write '+profileArgument);
execSync('aws s3 cp build/'+precacheFile+' s3://'+bucketName+'/flashgang/'+precacheFile+' --metadata Content-Type=text/javascript --acl public-read-write '+profileArgument);
rimraf.sync("build");
console.log("DONE");


function build() {
    buildResult={};
    try {
        buildResult.stdOut=execSync('npm run build').toString().replace("\\n", '\n');
    } 
    catch (error) {
        buildResult.error={};
        buildResult.error.status=error.status;
        buildResult.error.message=error.message.toString();
        buildResult.error.stderr=error.stderr.toString();
        buildResult.error.stdout=error.stdout.toString();
    }
    return buildResult;
  };