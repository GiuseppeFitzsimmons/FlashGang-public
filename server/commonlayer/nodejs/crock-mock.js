
const moduleAlias = require('module-alias')


moduleAlias.addPath("crock_node_modules");
moduleAlias.addAlias("real-aws-sdk", "aws-sdk");
moduleAlias.addAlias("aws-sdk", "crock-aws-sdk");

const AWS=require('aws-sdk');
//console.log(AWS.Lambda);
global: stack={invokeStack:'OMG really?'}
lambda=new AWS.Lambda();
console.log("This is what invoke looks like now", lambda.invoke());