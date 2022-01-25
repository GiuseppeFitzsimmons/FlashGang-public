
const fs = require('fs');
let parametersFile;
let stackName;
let environment

async function createAdminAccounts() {
    console.log("parametersFile", parametersFile)
    let _json = JSON.parse(fs.readFileSync(parametersFile));
    let _secrets = JSON.parse(fs.readFileSync('deploy-parameters-secrets.json'));
    process.env.REGION='us-east-1';
    process.env.USER_TABLE_NAME=stackName+'-user-table';
    console.log(environment, process.env.USER_TABLE_NAME, process.env.USER_TABLE_NAME)
    if (environment==='local') {
        process.env.DYNAMODB_ENDPOINT=_json.Parameters.DYNAMODB_ENDPOINT;
    } else {
        process.env.RUNNING_LOCAL_REGION='us-east-1';
        process.env.ACCESS_KEY_ID=_secrets.Parameters.AccessKeyId;
        process.env.SECRET_ACCESS_KEY=_secrets.Parameters.SecretAccessKey;
    }
    await createAdminAccount('fitzsimmonsgiuseppe@gmail.com');
    await createAdminAccount('phillip.fitzsimmons@gmail.com');
    
}

async function createAdminAccount(email) {
    console.log("creating admin account", email, process.env.USER_TABLE_NAME);
    const {putUser, getUser, getItem}=require('./commonlayer/nodejs/dynamofordummies');
    //let admin=await getUser(email);
    let admin=await getItem(email, process.env.USER_TABLE_NAME);
    console.log("user", email, admin);
    if (!admin) {
        admin={
            id: email
        }
    }
    if (!admin.subscription || admin.subscription!='admin') {
        admin.subscription='admin'
        await putUser(admin);
    }
    admin=await getItem(email, process.env.USER_TABLE_NAME);
    console.log(email, " is admin ", admin.subscription==='admin')
}
process.argv.forEach(function (val, index, array) {
    if (val == '-e' || val == '--environment') {
        environment = array[index + 1];
        console.log("valing", val, array[index + 1]);
    }
});
console.log('environment', environment)
if (environment=='local') {
    parametersFile='deploy-parameters-local.json'
    stackName='CrockStack';
} else if (environment=='dev') {
    parametersFile='deploy-parameters-dev.json'
    stackName='flashgang-dev';
} else if (environment=='prod') {
    parametersFile='deploy-parameters-prod.json'
    stackName='flashgang-prod';
}
createAdminAccounts()