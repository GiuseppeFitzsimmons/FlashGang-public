const dynamodbfordummies = require('dynamofordummies')
const mailUtility = require('mailutility')
const tokenUtility = require('tokenutility');
const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
    console.log("Websocket lambda enter", event);
    let returnObject = {}
    returnObject.statusCode = 200
    var reply = {}
    var token;
    let _body=event.body;
    if (_body && typeof _body=='string') {
        _body=JSON.parse(event.body);
    }
    if (event.requestContext.routeKey && event.requestContext.routeKey==='$disconnect') {
        //TODO delete event.requestContext.connectionId from the database
    } else if  (_body && _body.type){
        try {
            token = tokenUtility.validateToken(event);
        } catch(badtoken) {
            console.log('badtoken', badtoken, event);
            returnObject.statusCode=badtoken.statusCode;
            reply=badtoken;
        }
        let userId = token.sub;
        if (_body.type == 'handshake'){
            console.log('handshake made')
            let connectionId = event.requestContext.connectionId;
            await dynamodbfordummies.putWebsocketConnection(connectionId, userId);
        } else if (_body.type == 'update'){
            const apigwManagementApi = new AWS.ApiGatewayManagementApi({
                apiVersion: '2018-11-29',
                endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
            });
            console.log('WS body', _body)
            let users = {}
            users.gangUsers = []
            users.deckUsers = []
            if (_body.decks){
                for (var i in _body.decks){
                    let flashDeckId = _body.decks[i]
                    deckUsers = await dynamodbfordummies.getDeckUsers(flashDeckId);
                    users.deckUsers = users.deckUsers.concat(deckUsers.filter(id=>!users.deckUsers.includes(id)))
                }
                console.log('ws deckusers: ', users.deckUsers)
            }

            if (_body.gangs){
                for (var i in _body.gangs){
                    let flashGangId = _body.gangs[i]
                    gangUsers = await dynamodbfordummies.getGangUsers(flashGangId);
                    users.gangUsers = users.gangUsers.concat(gangUsers.filter(id=>!users.gangUsers.includes(id)))
                }
                console.log('ws gangusers: ', users.gangUsers)
            }
            let message = JSON.stringify({type: 'update'});
            users=users.deckUsers.concat(users.gangUsers.filter(id=>!users.deckUsers.includes(id)));
            console.log('users wslambda concatenated', users)
            for (var u in users) {
                let user=users[u];
                console.log('WS user', user)
                let connections = await dynamodbfordummies.getWebsocketConnection(user)
                console.log('WS connections', connections)
                for (var c in connections) {
                    let connection=connections[c];
                    let promiseToSend = apigwManagementApi.postToConnection({ ConnectionId: connection.connectionId, Data: message }).promise();
                    await promiseToSend.then(sent=>{
                        console.log('sent', user, connection.connectionId)
                    }).catch(err=>{
                        console.log("Error connecting to ", connection.connectionId, err)
                        dynamodbfordummies.deleteConnection(connection.connectionId, user)
                    })
                }
            }
            
        }
    }
    returnObject.body = JSON.stringify(reply);
    return returnObject
}