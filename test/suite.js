const fetch = require('node-fetch')
var domain = 'http://localhost:8080';
var websockerserver = 'ws://localhost:9090';
const WebSocket = require('ws');
var local=true;

const createAccountTony = {
    id: 'tony@soprano.it',
    firstName: 'Tony',
    lastName: 'Soprano',
    password: 'password',
    subscription: 'boss'
}
const createAccountChris = {
    id: 'chris@soprano.it',
    firstName: 'Chris',
    lastName: 'Moltisanti',
    password: 'password',
    subscription: 'lieutenant'
}
const createAccountCarmella = {
    id: 'carmella@soprano.it',
    firstName: 'Carmella',
    lastName: 'Soprano',
    password: 'password'
}
const createAccountJunior = {
    id: 'junior@soprano.it',
    firstName: 'Junior',
    lastName: 'Soprano',
    password: 'password',
    suspended: 'true',
    subscription: 'member'
}
const createAccountPaulie = {
    id: 'paulie@soprano.it',
    firstName: 'Paulie',
    lastName: 'Gualtieri',
    nickName: 'Wallnuts',
    password: 'password',
    subscription: 'lieutenant'
}
const createAccountBobby = {
    id: 'bobby@soprano.it',
    firstName: 'Bobby',
    lastName: 'Baccalieri',
    nickName: 'Bacala',
    password: 'password'
}
const createAccountVito = {
    id: 'vito@soprano.it',
    firstName: 'Vito',
    lastName: 'Spatafore',
    password: 'password'
}
const createAccountJohnny = {
    id: 'johnny@soprano.it',
    firstName: 'Johnny',
    lastName: 'Sacramoni',
    nickName: 'Sack',
    password: 'password',
    subscription: 'member'
}
const createAccountPhil = {
    id: 'phil@soprano.it',
    firstName: 'Phil',
    lastName: 'Leotardo',
    password: 'password',
    subscription: 'lieutenant'
}
const createAccountLivia = {
    id: 'mom@soprano.it',
    firstName: 'Livia',
    lastName: 'Soprano',
    nickName: 'Mom',
    password: 'password'
}
const createAccountSal = {
    id: 'salvatore@soprano.it',
    firstName: 'Salvatore',
    lastName: 'Bonpensiero',
    nickName: 'Big Pussy',
    password: 'password',
    subscription: 'lieutenant'
}
const createAccountAngelo = {
    id: 'angelo@soprano.it',
    firstName: 'Angelo',
    lastName: 'Garepe',
    password: 'password'
}
const createAccountCarmine = {
    id: 'carmine@soprano.it',
    firstName: 'Carmine',
    lastName: 'Lupertazzi Jr',
    password: 'password',
    subscription: 'member'
}
const createAccountMikey = {
    id: 'mikey@soprano.it',
    firstName: 'Mikey',
    lastName: 'Palmice',
    password: 'password',
    subscription: 'lieutenant'
}
const castOfSopranos = [createAccountCarmella, createAccountJunior, createAccountPaulie,
    createAccountBobby, createAccountVito, createAccountJohnny,
    createAccountPhil, createAccountLivia, createAccountSal,
    createAccountCarmine, createAccountMikey, createAccountAngelo]
    const aDeck={
        "id": "deck-10",
        "name": "The name of the deck",
        "editable": "true",
        "flashCards": [
            {
                "id": "card-11",
                "question": "How much?",
                "correctAnswers": [
                    "a lot"
                ]
            }
        ]
    };
    const aGang= {
        "id": "gang-11",
        "name": "My gang",
        "description": "My homies studying the multiplication tables",
        "members": [
            {
                "id": "chris@soprano.id",
                "state": "TO_INVITE",
                "rank": "LIEUTENANT"
            }
        ],
        "flashDecks": ["deck-10"]
    }
synchroniseTony = {
    "flashDecks": [aDeck],
    "flashGangs": [aGang]
}

deleteDeckTony = {
    "deletions": {
        "flashDecks": [
            { "id": "deck-10" }
        ]
    }
}
rsvpChris = {
    flashGangId: 'gang-11',
    acceptance: true
}
synchroniseChris = {
    "flashDecks": [
        {
            "id": "deck-10",
            "name": "The name of the deck",
            "flashCards": [
                {
                    "id": "card-11",
                    "question": "How much?",
                    "correctAnswers": [
                        "a lot"
                    ]
                },

                {
                    "id": "card-12",
                    "question": "Ow olda you boy?",
                    "correctAnswers": [
                        "aaaaaaa!"
                    ]
                }
            ]
        }
    ]
}
const https = require("https");
const agent = new https.Agent({
    rejectUnauthorized: false
  })
async function post(url, params, token) {
    var _headers = {}
    if (token) {
        _headers.authorization = token;
    }
    let options= {
        method: 'post',
        credentials: "same-origin",
        headers: _headers,
        body: JSON.stringify(params)
    }
    if (!local) {
        options.agent=agent;
    }
    let reply = await fetch(url, options)
        .then(function (response) {
            responseCode = response.status;
            return response.json();

        })
        .then(function (json) {
            //console.log("REPLY FROM POST", json);
            return json
        })
        .catch(function (err) {
            responseCode = 0
            console.log('postToServer error', err)
            return {}
        })
    return reply
}
async function get(url, token) {
    var _headers = {}
    if (token) {
        _headers.authorization = token;
    }
    let reply = await fetch(url, {
        method: 'get',
        credentials: "same-origin",
        headers: _headers
    })
        .then(function (response) {
            responseCode = response.status;
            return response.json();

        })
        .then(function (json) {
            //console.log("REPLY FROM POST", json);
            return json
        })
        .catch(function (err) {
            responseCode = 0
            console.log('getFromServer error', err)
            return {}
        })
    return reply
}

async function test() {
    console.log("CREATING ACCOUNT TONY", domain);
    let tony = await post(domain + '/account', createAccountTony);
    console.log(tony);
    if (!tony || !tony.token) {
        createAccountTony.grant_type = "password";
        tony = await post(domain + '/login', createAccountTony);
    }
    console.log(tony);
    console.log("SYNCHRONISING TONY");
    let tonySynch = await post(domain + '/synchronise', synchroniseTony, tony.token);
    console.log(tonySynch);
    console.log("CREATING ACCOUNT CHRIS");
    let chris = await post(domain + '/account', createAccountChris);
    console.log(chris);
    if (!chris || !chris.token) {
        createAccountChris.grant_type = "password";
        chris = await post(domain + '/login', createAccountChris);
    }
    console.log(chris);;
    console.log("RSVP CHRIS");
    let chrisRsvp = await post(domain + '/rsvp', rsvpChris, chris.token);
    console.log(JSON.stringify(chrisRsvp));
    console.log("SYNCHRONISING CHRIS");
    let chrisSynch = await post(domain + '/synchronise', synchroniseChris, chris.token);
    console.log(JSON.stringify(chrisSynch));
    //console.log("DELETING A DECK TONY");
    //let tonyDeleteDeck=await post(domain+'/synchronise', deleteDeckTony, tony.token);
    //console.log(tonyDeleteDeck);
    for (var i in castOfSopranos) {
        let createCastMembmer = await post(domain + '/account', castOfSopranos[i]);
    }
    tonySocket = new WebSocketConnection('tony', tony.token);
    chrisSocket = new WebSocketConnection('chris', chris.token);
    setTimeout(async() => {
        synchroniseTony.flashDecks[0].name="A different deck name";
        synchroniseTony.flashGangs[0].name="A different gang name";
        tonySynch = await post(domain + '/synchronise', synchroniseTony, tony.token);
    }, 10000)
    setTimeout(async() => {
        let data = { action: 'websocket', type: 'update', token: tony.token, decks: [tonySynch.flashDecks[0].id], gangs: [tonySynch.flashGangs[0].id] }
        tonySocket.sendMessage(data);
    }, 15000)
}
const websocketagent = new https.Agent({
    rejectUnauthorized: false
  })
function WebSocketConnection(name, token) {
    this.name = name;
    this.uniqueId = Math.random();
    this.connect = function (token) {
        if (!local) {
            this.ws = new WebSocket(websockerserver, { agent: websocketagent });
        } else {
            this.ws = new WebSocket(websockerserver);
        }
        
        this.ws.webSocketConnection = this;
        this.ws.on('open', function open() {
            console.log("ws-1 We appear to be connected")
            let data = { action: 'websocket', type: 'handshake', token: token }
            try {
                this.webSocketConnection.ws.send(JSON.stringify(data));
                console.log("ws-2 We appear to have sent a message")
            } catch (err) {
                console.log("ws-3 We had an error connecting", err)
            }
        });
        this.ws.on('message', function incoming(data) {
            console.log(this.webSocketConnection.name + " " + this.webSocketConnection.uniqueId + " message received ", data);
        });
    }
    this.sendMessage = function (message) {
        this.ws.send(JSON.stringify(message));
    }
    this.connect(token);
}

function run() {
    let justGetUsers = false;
    let environment = 'local';
    process.argv.forEach(function (val, index, array) {
        if (val == '--users') {
            justGetUsers = true;
        } else if (val == '--environment') {
            environment = array[index + 1];
        }
    });
    if (environment==='dev') {
        local=false;
        domain='https://api-dev.flashgang.io/v1'
        //websockerserver='wss://dev-websocket.flashgang.io/prod';
        //websockerserver='wss://x0giqnvad0.execute-api.us-east-1.amazonaws.com/prod';
        websockerserver='wss://dev-websocket.flashgang.io';
    } else if (environment==='prod') {
        local=false;
        domain='https://api.flashgang.io/v1'
        websockerserver='wss://websocket.flashgang.io';
    }
    if (justGetUsers) {
        testGetAllUsers();
    } else {
        test();
    }
}
run();
async function testGetAllUsers() {
    console.log("test")
    let getAll = await get(domain + '/admin?string=sopra');
    console.log("all users", getAll);
}

//./node_modules/wscat/bin/wscat -c wss://x0giqnvad0.execute-api.us-east-1.amazonaws.com/prod
//./node_modules/wscat/bin/wscat -c wss://dev-websocket.flashgang.io/prod


//./node_modules/wscat/bin/wscat -c wss://x905fhvzdj.execute-api.us-east-1.amazonaws.com/Prod