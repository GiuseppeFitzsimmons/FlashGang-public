console.log('server-deploy.js called')
const fs = require('fs');
const { execSync, exec, spawn } = require('child_process');
let profileArgument = '';
let templateFile = 'template.yaml';
let deployParametersFile;
let deployParameters = '';
let stackName;
let local;
let environment;
let install = 'false';
let deployToCloudFormation = true;
process.argv.forEach(function (val, index, array) {
    if (val == '--profile') {
        profileArgument = '--profile ' + array[index + 1];
    } else if (val == '--deploy-parameters') {
        deployParametersFile = array[index + 1];
    } else if (val == '--stack-name') {
        stackName = array[index + 1];
    } else if (val == '--local') {
        local = array[index + 1];
    } else if (val == '--env' || val == '--environment') {
        environment = array[index + 1];
    } else if (val == '--install') {
        install = array[index + 1];
    } else if (val == '-cf' || val == '--deployToCloudformation') {
        if (array[index + 1].toLowerCase() !== 'true') {
            deployToCloudFormation = false;
        }
    }
});
if (!deployParametersFile && environment) {
    if (environment === 'dev') {
        deployParametersFile = 'deploy-parameters-dev.json';
    } else if (environment === 'prod') {
        deployParametersFile = 'deploy-parameters-prod.json';
    } else if (environment === 'local' || local) {
        deployParametersFile = 'deploy-parameters-local.json';
    }
}

if (install != 'false') {
    if (process.platform === 'win32') {
        installed = execSync('npm run install:windows --prefix commonlayer/nodejs');
    } else {
        installed = execSync('npm run install:linux --prefix commonlayer/nodejs');
    }
    console.log(installed.toString());
    installed = execSync('npm run install:all --prefix accountlambda');
    console.log("done installing accountlambda", installed.toString());
    installed = execSync('npm run install:all --prefix adminlambda');
    console.log("done installing adminlambda", installed.toString());
    installed = execSync('npm run install:all --prefix gallerylambda');
    console.log("done installing gallerylambda", installed.toString());
    installed = execSync('npm run install:all --prefix googleloginlambda');
    console.log("done installing googleloginlambda", installed.toString());
    installed = execSync('npm run install:all --prefix polllambda');
    console.log("done installing polllambda", installed.toString());
    installed = execSync('npm run install:all --prefix rsvplambda');
    console.log("done installing rsvplambda", installed.toString());
    installed = execSync('npm run install:all --prefix synchroniselambda');
    console.log("done installing synchroniselambda", installed.toString());
    installed = execSync('npm run install:all --prefix websocketlambda');
    console.log("done installing websocketlambda", installed.toString());
}
if (!stackName && environment) {
    if (environment === 'dev') {
        stackName = 'flashgang-dev';
    } else if (environment === 'prod') {
        stackName = 'flashgang-prod';
    }
}
if (deployParametersFile) {
    let _json = JSON.parse(fs.readFileSync(deployParametersFile))
    let _secrets = { Parameters: {} }
    try {
        _secrets = JSON.parse(fs.readFileSync('deploy-parameters-secrets.json'));
    } catch (err) { }
    if (_json.Parameters) {
        _secrets = Object.assign({}, _secrets.Parameters, _json.Parameters);
    }
    deployParameters = Object.keys(_secrets).map(key => key + '=' + _secrets[key]).join(' ');
    deployParameters = `--parameter-overrides "PointlessParam=pointess ${deployParameters}"`;
    if (environment === 'dev' || environment === 'prod') {
        //TODO fix this - CrockStack wants quotes, AWS doesn't. According to AWS documentation, CrockStack is right.
        deployParameters = `--parameter-overrides PointlessParam=pointess ${deployParameters}`;
    }
    console.log("deployParameters", deployParameters)
} else {
    console.log("--deploy-parameters is a required argument");
    console.log("EXITING");
    process.exit();
}
if (local) {
    //killOldProccesses();
    startDb(function () {
        console.log("DB started, starting server...");
        startServer(deployParameters);
    });
} else {
    var packageCommand = `aws cloudformation package --template-file ${templateFile} --output-template-file packaged.yaml ${profileArgument} --s3-bucket wwdd-build-bucket-us-east-1`
    var deployCommand = `aws cloudformation deploy --template-file packaged.yaml --stack-name ${stackName}  ${profileArgument} --region us-east-1 --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND ${deployParameters}`
    execSync(packageCommand, { stdio: 'inherit' });
    console.log(packageCommand);
    if (deployToCloudFormation) {
        execSync(deployCommand, { stdio: 'inherit', stderr: 'inherit' });
        console.log(deployCommand);
    } else {
        console.log("Package complete, not deploying to CloudFormation");
    }
}


async function startDb(callback) {
    await new Promise((resolve, reject) => {
        const child = spawn('java', ['-Djava.library.path=../../dynamoDB/DynamoDBLocal_lib', '-jar', '../../dynamoDB/DynamoDBLocal.jar', '-sharedDb']);
        child.on('exit', (code) => {
            console.log(`Child process exited with code ${code}`);
        });
        child.stdout.on('data', (data) => {
            console.log(`Dynamo: ${data}`);
            callback();
        });
        child.stderr.on('data', (data) => {
            console.log(`Dynamo error: ${data}`);
        });
    })
}
async function startServer(deployParameters) {
    var crockCommand = 'crockstack'
    //if (process.platform === 'darwin') {
        crockCommand = 'node ../node_modules/crockstack/cli.js';
    //}
    if (deployParameters.indexOf('--parameter-overrides ') == 0) {
        deployParameters = deployParameters.replace('--parameter-overrides ', '');
    }
    execSync(crockCommand + ' --parameter-overrides ' + deployParameters, { stdio: 'inherit' })
}
