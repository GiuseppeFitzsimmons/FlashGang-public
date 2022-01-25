const dynamodbfordummies = require('dynamofordummies');
const tokenUtility = require('tokenutility');

exports.handler = async (event, context) => {
    let returnObject = {}
    returnObject.statusCode = 200
    var reply = {}
    var token;
    try {
        token = tokenUtility.validateToken(event)
    } catch (badtoken) {
        reply=badtoken;
        returnObject.statusCode=badtoken.statusCode;
    }
    if (typeof event.body === 'string') {
        event.body=JSON.parse(event.body)
    }
    if (token && event.httpMethod.toLowerCase() === 'post') {
        if (event.body && event.body.poll) {
            event.body.poll.id = token.sub
            event.body.poll.date = new Date().getTime()
            await dynamodbfordummies.putItem(event.body.poll, process.env.POLL_TABLE_NAME)
        }
    }
    returnObject.body = JSON.stringify(reply);
    returnObject.headers={
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,HEAD,GET,PUT,POST"
    }
    return returnObject





}
function validateToken(event) {
    let token = event.authorizationToken;
    if ((!token || token == '') && event.headers) {
        token = event.headers.Authorization;
        if (!token || token == '') {
            token = event.headers.authorization;
        }
    }
    if (!token || token == '') {
        return;
    }
    if (token.toLowerCase().indexOf('bearer') == 0) {
        token = token.substr(7);
    }
    let splitted = token.split(".");
    if (splitted.length < 2) {
        return
    }
    let buff = new Buffer(splitted[1], 'base64');
    let decoded = buff.toString('ascii');
    decoded = JSON.parse(decoded);
    return decoded;
}