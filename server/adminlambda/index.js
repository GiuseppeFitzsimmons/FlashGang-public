const dynamodbfordummies = require('dynamofordummies');
const tokenUtility = require('tokenutility');
var AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    var reply = {}
    if (typeof event.body === 'string') {
        event.body = JSON.parse(event.body)
    }
    let returnObject = {}
    returnObject.statusCode = 200;
    let _body = {}
    var token;
    let _event = JSON.stringify(event)
    console.log('adminlambda _event', _event)
    try {
        token = tokenUtility.validateToken(event, false, 'admin')
    } catch (badtoken) {
        console.log("BADTOKEN", badtoken)
        reply = badtoken;
        returnObject.body=badtoken
        returnObject.statusCode = badtoken.statusCode;
    }
    if (token) {
        if (event.httpMethod.toLowerCase() === 'get') {
            if (event.queryStringParameters.type === 'user') {
                {
                    var users = await dynamodbfordummies.getAllUsers(event.queryStringParameters)
                    console.log('adminlambda users', users.Items)
                    _body.users = []
                    var filteredUsers = []
                    for (var i in users.Items) {
                        let user = users.Items[i]
                        let filteredUser = {}
                        filteredUser.firstName = user.firstName
                        filteredUser.lastName = user.lastName
                        filteredUser.id = user.id
                        if (user.picture) {
                            filteredUser.picture = user.picture
                        } else {
                            filteredUser.picture = null
                        }
                        filteredUsers.push(filteredUser)
                    }
                    if (users.LastEvaluatedKey) {
                        _body.LastEvaluatedKey = users.LastEvaluatedKey
                    }
                    _body.users = filteredUsers
                    returnObject.body = JSON.stringify(_body)
                    /*if (event.body.source) {
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
                                        console.log("Success uploading IMAGE", data);
                                        resolve(data);
                                    }
                                });
                            })
                            if (s3result.ETag) {
                                //TODO at some point in the future we should have a way that cleans up unused images.
                                reply.url = `https://${process.env.S3_SERVER_DOMAIN}${subPath}`
                                //await dynamodbfordummies.putImage(token.sub, reply.url)
                            }
                            console.log("s3result", s3result);
                        }
                    }*/
                }
            }
            //else if (1 === 2) {
            if (event.queryStringParameters.type === 'deck') {
                {
                    var decks = await dynamodbfordummies.getAllDecks(event.queryStringParameters)
                    console.log('adminlambda decks', decks.Items)
                    _body.decks = []
                    var filteredDecks = []
                    for (var i in decks.Items) {
                        let deck = decks.Items[i]
                        console.log(deck)
                        let filteredDeck = {}
                        filteredDeck.name = deck.name
                        filteredDeck.description = deck.description
                        filteredDeck.owner = deck.owner
                        filteredDeck.id = deck.id
                        if (deck.flashCards) {
                            filteredDeck.flashCards = []
                            for (var j in deck.flashCards) {
                                filteredDeck.flashCards[j] = deck.flashCards[j]
                            }
                        }
                        console.log('filteredDeck', filteredDeck)
                        filteredDecks.push(filteredDeck)
                    }
                    if (decks.LastEvaluatedKey) {
                        _body.LastEvaluatedKey = decks.LastEvaluatedKey
                    }
                    _body.decks = filteredDecks
                    returnObject.body = JSON.stringify(_body)
                }
            } else if (event.queryStringParameters.type === 'gang') {
                {
                    var gangs = await dynamodbfordummies.getAllGangs(event.queryStringParameters)
                    console.log('adminlambda gangs', gangs.Items)
                    _body.gangs = []
                    var filteredGangs = []
                    for (var i in gangs.Items) {
                        let gang = gangs.Items[i]
                        console.log(deck)
                        let filteredGang = {}
                        filteredGang.name = gang.name
                        filteredGang.description = gang.description
                        filteredGang.owner = gang.owner
                        filteredGang.id = gang.id
                        console.log('filteredGang', filteredGang)
                        filteredGangs.push(filteredGang)
                    }
                    if (gangs.LastEvaluatedKey) {
                        _body.LastEvaluatedKey = gangs.LastEvaluatedKey
                    }
                    _body.gangs = filteredGangs
                    returnObject.body = JSON.stringify(_body)
                }
            }

        } else if (event.httpMethod.toLowerCase() === 'post') {
            if (event.body.type == 'suspendDeck') {
                var _deck = await dynamodbfordummies.getFlashDeck(event.body.deck.id)
                var deck = await dynamodbfordummies.setDeckSuspension(_deck)
            } else if (event.body.type == 'suspendGang') {
                var _gang = await dynamodbfordummies.getFlashGang(event.body.gang.id)
                var gang = await dynamodbfordummies.setGangSuspension(_gang)
            } else if (event.body.type == 'suspendUser') {
                console.log('suspendUser adminlambda event', event.body)
                var _user = await dynamodbfordummies.getUser(event.body.user.id)
                var user = await dynamodbfordummies.setUserSuspension(_user)
            }

            /*event.body.user = event.body.user.user
            console.log('adminlambda event', event)
            var user = await dynamodbfordummies.saveUser(event.body.user)
            console.log('adminlambda saveUser', user)*/
        }
    }
    returnObject.headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,HEAD,GET,PUT,POST"
    }
    console.log("AdminLambda ", returnObject);
    return returnObject
}

/*function gets3() {
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
}*/