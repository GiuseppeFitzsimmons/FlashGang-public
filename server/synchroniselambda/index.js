const dynamodbfordummies = require('dynamofordummies')
const mailUtility = require('mailutility')
const tokenUtility = require('tokenutility');

exports.handler = async (event, context) => {
    let returnObject = {}
    returnObject.statusCode = 200
    var reply = {}
    var token;
    try {
        token = tokenUtility.validateToken(event);
    } catch(badtoken) {
        console.log('badtoken', badtoken, event);
        returnObject.statusCode=badtoken.statusCode;
        reply=badtoken;
    }
    if (typeof event.body === 'string') {
        event.body=JSON.parse(event.body)
    }
    if (token && event.httpMethod.toLowerCase() === 'post') {
        //store all the flashcards sent from the user
        if (event.body.flashDecks) {
            for (var i in event.body.flashDecks) {
                flashDeck = event.body.flashDecks[i]
                let permitted = await dynamodbfordummies.hasFlashDeckPermissions(flashDeck.id, token.sub)
                if (!permitted.update){
                    continue
                }
                await dynamodbfordummies.putFlashDeck(flashDeck, token.sub)
            }
        }
        //store all the flashgangs sent from the user
        if (event.body.flashGangs) {
            for (var i in event.body.flashGangs) {
                flashGang = event.body.flashGangs[i]
                let permitted = await dynamodbfordummies.hasFlashGangPermissions(flashGang.id, token.sub)
                if (!permitted.update){
                    continue
                }
                if (flashGang.members) {
                    for (var j in flashGang.members) {
                        let member = flashGang.members[j]
                        if (!member.id) {
                            continue
                        }
                        console.log("GANG MEMBER", member);
                        if (member.state == 'TO_INVITE') {
                            let user = await dynamodbfordummies.getItem(token.sub, process.env.USER_TABLE_NAME)
                            let invitor = token.sub;
                            if (user.firstName || user.lastName) {
                                invitor = `${user.firstName ? user.firstName : ''} ${user.lastName ? user.lastName : ''}`
                            }
                            //await mailUtility.sendInvitationMail(invitor, member.id, flashGang.name)
                            member.state = 'INVITED'
                            member.invitedBy = token.sub;
                            console.log("INVITEDBY BUG SAVING MEMBER", member);
                        }
                    }
                }
                await dynamodbfordummies.putFlashGang(flashGang, token.sub)
            }
        }
        if (event.body.scores) {
            dynamodbfordummies.saveScores(event.body.scores, token.sub);
        }
        if (event.body.deletions){
            if (event.body.deletions.flashDecks){
                for (var i in event.body.deletions.flashDecks){
                    let deckToDelete = event.body.deletions.flashDecks[i]
                    let permitted = await dynamodbfordummies.hasFlashDeckPermissions(deckToDelete.id, token.sub);
                    if (permitted.delete) {
                        await dynamodbfordummies.deleteFlashDeck(deckToDelete.id)
                    }
                }
            }
            if (event.body.deletions.flashGangs){
                for (var i in event.body.deletions.flashGangs){
                    let gangToDelete = event.body.deletions.flashGangs[i]
                    let permitted = await dynamodbfordummies.hasFlashGangPermissions(gangToDelete.id, token.sub);
                    if (permitted.delete) {
                        await dynamodbfordummies.deleteFlashGang(gangToDelete.id)
                    }
                }
            }
        }
        let lastModified = event.body.lastModified ? event.body.lastModified : 0;
        //return all the flashcards to which the user has access and which have a lastModified date
        //later than the date passed in the request
        reply = await dynamodbfordummies.getLastModifedObjects(token.sub, lastModified);
    }
    returnObject.body = JSON.stringify(reply);
    returnObject.headers={
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "OPTIONS,HEAD,GET,PUT,POST"
    }
    return returnObject
}
/*
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
}*/
/*
Example post

{
	"flashDecks":[
		{
			"id":"10",
			"name":"The name of the deck",
			"owner": "1000",
			"flashCards":[
				{
					"id":"11",
					"question":"How much?",
					"correctAnswers":[
						"a lot"
					]
				}
			]
		}
	],
	"flashGangs":[
		{
			"id":"11",
			"name":"My gang",
			"description": "My homies studying the multiplication tables",
			"owner": "1000",
			"members":[
				{
					"id":"1001",
					"state":"TO_INVITE",
					"email":"homey@hood.com",
					"rank":"SOTTOCAPPO"
				}
			],
			"flashdecks":["10"]
		}
	]
}


*/