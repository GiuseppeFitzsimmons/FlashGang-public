const bcrypt = require('bcryptjs');
const dynamodbfordummies = require('dynamofordummies');
const tokenUtility = require('tokenutility');
const mailUtility = require('mailutility')
const fs = require('fs');
const uuidv4 = require('uuid/v4');
var AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    var reply = {}
    if (typeof event.body === 'string') {
        event.body = JSON.parse(event.body)
    }
    let returnObject = {}
    returnObject.statusCode = 200;
    var token;
    try {
        token = tokenUtility.validateToken(event)
    } catch (badtoken) {
        reply = badtoken;
        returnObject.statusCode = badtoken.statusCode;
    }
    console.log("GALLERY LAMBDA event", event);
    if (token) {
        if (event.httpMethod.toLowerCase() === 'post') {
            {
                if (event.body.source) {
                    if (event.body.source.indexOf('data:image') == 0) {
                        var imageData = event.body.source.split(',');
                        var base64Data = imageData[1];
                        var imageType = imageData[0].toLowerCase().replace("data:image/", '').replace(';base64', '');
                        var subPath = `/images/${token.sub}/${uuidv4()}.${imageType}`
                        var path = `${process.env.IMAGE_PREFIX}${subPath}`
                        var s3 = gets3()
                        var bucketParams = {
                            Body: new Buffer(base64Data, 'base64'),
                            Bucket: process.env.IMAGE_BUCKET,
                            Key: path,
                            ContentEncoding: 'base64',
                            ContentType: `image/${imageType}`
                        };
                        //fs.writeFileSync('avatartest.jpg',base64Data, 'base64');
                        let s3result = await new Promise((resolve, reject) => {
                            s3.putObject(bucketParams, function (err, data) {
                                if (err) {
                                    console.log("Error uploading IMAGE", err, err.stack);
                                    reject(err);
                                } else {
                                    //console.log("Success uploading IMAGE", data);
                                    resolve(data);
                                }
                            });
                        })
                        if (s3result.ETag) {
                            //TODO at some point in the future we should have a way that cleans up unused images.
                            reply.url = `https://${process.env.S3_SERVER_DOMAIN}${subPath}`
                            //await dynamodbfordummies.putImage(token.sub, reply.url)
                        }
                        //console.log("s3result", s3result);
                    }
                } else if (event.body.images) {
                    //This is a workaround - delete wasn't working because we don't support body when method is delete
                    let _code=await deleteImages(event);
                    returnObject.statusCode=_code;
                }
                //await dynamodbfordummies.putItem(user, process.env.IMAGE_TABLE)
                //reply.user = await dynamodbfordummies.getUser(user.id)
            }
        } else if (event.httpMethod.toLowerCase() === 'get') {
            var s3 = gets3()
            var params = {
                Bucket: process.env.IMAGE_BUCKET,
                Delimiter: '/',
                MaxKeys: 1000,
                Prefix: `flashgang/images/${token.sub}/`
            };
            let s3result = await new Promise((resolve, reject) => {
                s3.listObjectsV2(params, function (err, data) {
                    if (err) {
                        console.log(err, err.stack)
                        reject({ err })
                    }
                    else {
                        console.log(data)
                        resolve({ data })
                    }
                });
            })
            if (s3result.err) {
                returnObject.statusCode = 400
            } else {
                reply.images = []
                for (var i in s3result.data.Contents) {
                    let key = s3result.data.Contents[i].Key
                    key = key.replace('flashgang', '')
                    reply.images.push(`https://${process.env.S3_SERVER_DOMAIN}${key}`)
                }
                console.log('reply.images', reply.images)
            }
        } else if (event.httpMethod.toLowerCase() === 'delete') {
            deleteImages(event);
        }
        returnObject.body = JSON.stringify(reply);
        returnObject.headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods": "OPTIONS,HEAD,GET,PUT,POST"
        }
        return returnObject
    }
    async function deleteImages(event) {

        var s3 = gets3()
        var objectsToDelete = []
        for (var i in event.body.images) {
            var splitted = event.body.images[i].split('/')
            objectsToDelete.push({ Key: `flashgang/images/${splitted[splitted.length - 2]}/${splitted[splitted.length - 1]}` })
        }
        var params = {
            Bucket: process.env.IMAGE_BUCKET,
            Delete: {
                Objects: objectsToDelete
            }
        };
        let s3result = await new Promise((resolve, reject) => {
            s3.deleteObjects(params, function (err, data) {
                if (err) {
                    console.log(err, err.stack)
                    reject({ err })
                }
                else {
                    //console.log(data)
                    resolve({ data })
                }
            });
        })
        if (s3result.err) {
            return 400;
        }
        return 200;
    }
}

function gets3() {
    var s3Config = {};
    if (process.env.S3_ENDPOINT && process.env.S3_ENDPOINT != '') {
        s3Config.endpoint = process.env.S3_ENDPOINT;
    }
    if (process.env.REGION && process.env.REGION != '') {
        s3Config.region = process.env.REGION;
    }
    if (process.env.ACCESS_KEY_ID && process.env.ACCESS_KEY_ID != '' && process.env.ACCESS_KEY_ID != '::') {
        s3Config.accessKeyId = process.env.ACCESS_KEY_ID,
            s3Config.secretAccessKey = process.env.SECRET_ACCESS_KEY
    }
    console.log('s3Config', s3Config)
    var s3 = new AWS.S3(s3Config);
    return s3
}