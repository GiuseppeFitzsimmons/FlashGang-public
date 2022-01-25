import {
    DELETE_IMAGES, GET_IMAGES, SET_SCORE, ENDSYNCHRONISE,
    SET_SETTINGS, SYNCHRONISE, DELETE_GANG, POLL, SET_PASSWORD,
    RESET_PASSWORD, RSVP, LOADING, NEW_DECK, SAVE_DECK, NEXT_CARD,
    LOAD_DECKS, LOAD_FLASHDECK, SCORE_CARD, DELETE_DECK, DELETE_CARD,
    PREV_CARD, LOAD_GANGS, NEW_GANG, SAVE_GANG, LOAD_FLASHGANG,
    CREATE_ACCOUNT, LOGIN, UPLOAD_IMAGE, SESSION_EXPIRED, GET_ALL_USERS,
    SAVE_USER, GET_ALL_DECKS, SUSPEND_DECK, GET_ALL_GANGS, SUSPEND_GANG,
    SUSPEND_USER, LOG_OUT, LOGIN_SOCIAL, UNSUSPEND_DECK, UNSUSPEND_GANG,
    UNSUSPEND_USER, DOWNLOAD_DATA, DELETE_ACCOUNT
} from '../action'
import { doesNotReject } from 'assert';
import FuzzySet from 'fuzzyset.js';
import flashdeck from '../views/flashdeck';
import call from 'material-ui/svg-icons/communication/call';

const env = require('./environment.js');
const uuidv4 = require('uuid/v4');
//const WebSocket = require('ws');

const connectionHandler = {
    connect: function (dispatch, callback) {
        this.socketConnection = new WebSocket('ws://localhost:9090');
        this.dispatch = dispatch;
        this.socketConnection.dispatch = dispatch;
        console.log('websocket connect')
        this.socketConnection.onopen = event => {
            console.log('websocket open, event:', event)
            let token = localStorage.getItem('flashJwt');
            let data = { action: 'websocket', type: 'handshake', token: token }
            console.log("websocket connect ", data)
            //this.socketConnection.send(JSON.stringify(data));
            if (callback) {
                callback(this.socketConnection);
            }
        }
        this.socketConnection.onmessage = function (event) {
            console.log('websocket onmessage event', event);
            if (event.data) {
                let message = JSON.parse(event.data);
                if (message.type === 'update') {
                    console.log("websocket update message received - dispatch is ", this.dispatch);
                    synchronise(this.dispatch);
                }
            }
        }
        this.socketConnection.onclose = function (event) {
            console.log('Websocket close event', event);
        }
    },
    waitForConnected(data, callback, retries) {
        if (!retries) retries=0;
        if (retries>3) {
            
        } else {
            if (this.socketConnection.readyState==1) {
                this.socketConnection.send(JSON.stringify(data));
                if (callback) {
                    callback(this.socketConnection);
                }
            } else {
                setTimeout( ()=>this.waitForConnected(data, callback, retries++), 500)
            }
        }
    },
    getConnection: function (callback) {
        if (this.socketConnection && this.socketConnection.readyState == 1) {
            callback(this.socketConnection);
        } else {
            this.connect(this.dispatch, callback);
        }
    },
    sendMessage: function (data) {
        data.token = localStorage.getItem('flashJwt');
        console.log("sending message", data);
        this.getConnection(connection => {
            connection.send(JSON.stringify(data));
        })
    },
    sendUpdateMessage: function (decks, gangs) {
        console.log("websocket sendUpdateMessage token", this.token, "dispatch", this.dispatch)
        let data = { action: 'websocket', type: 'update', decks, gangs }
        this.sendMessage(data);
    },
    keepAlive: function(dispatch) {
        if (dispatch) this.dispatch=dispatch;
        console.log("websocket bug keepAlive");
        try {
            this.getConnection(connection => {
                console.log("Keep alive ", connection);
            })
        } catch (err) {
            console.log("Error on keep alive", err);
        }
    }
}

async function synchronise(dispatch) {
    console.log('Synchronisation')
    console.log("websocket bug synchronise");
    connectionHandler.keepAlive(dispatch);
    var questObject = {}
    questObject.params = {}
    var decks = []
    var gangs = []
    var scores = []
    var keys = Object.entries(localStorage)
    console.log("synchronise ", keys);
    for (var i = 0; i < localStorage.length; i++) {
        var key = keys[i];
        if (key[0].indexOf('flashDeck-') == 0) {
            let _deck = JSON.parse(localStorage.getItem(key[0]))
            if (!_deck.lastModified) {
                decks.push(JSON.parse(localStorage.getItem(key[0])))
            }
        } else if (key[0].indexOf('flashGang-') == 0) {
            let _gang = JSON.parse(localStorage.getItem(key[0]))
            if (!_gang.lastModified) {
                gangs.push(JSON.parse(localStorage.getItem(key[0])))
            }
        } else if (key[0].indexOf('score-') == 0) {
            scores.push(JSON.parse(localStorage.getItem(key[0])))
        }
    }
    questObject.params.flashDecks = decks
    questObject.params.flashGangs = gangs
    questObject.params.scores = scores
    questObject.params.deletions = {}
    questObject.params.deletions.flashDecks = []
    questObject.params.deletions.flashGangs = []
    console.log('questObject', questObject)
    for (var i = 0; i < localStorage.length; i++) {
        var key = keys[i];
        if (key[0].indexOf('delete-flashDeck-') == 0) {
            questObject.params.deletions.flashDecks.push(JSON.parse(localStorage.getItem(key[0])))
        }
    }
    for (var i = 0; i < localStorage.length; i++) {
        var key = keys[i];
        if (key[0].indexOf('delete-flashGang-') == 0) {
            questObject.params.deletions.flashGangs.push(JSON.parse(localStorage.getItem(key[0])))
        }
    }
    questObject.resource = 'synchronise'
    let postResult = await postToServer(questObject)
    if (!postResult.errors && postResult.responseCode < 400) {
        if (postResult.flashDecks) {
            for (var i in postResult.flashDecks) {
                let _deck = postResult.flashDecks[i]
                localStorage.setItem('flashDeck-' + _deck.id, JSON.stringify(_deck))
            }
        }
        if (postResult.flashGangs) {
            for (var i in postResult.flashGangs) {
                let _gang = postResult.flashGangs[i]
                localStorage.setItem('flashGang-' + _gang.id, JSON.stringify(_gang))
            }
        }
        let currentUser;
        if (postResult.users) {
            for (var i in postResult.users) {
                let _user = postResult.users[i]
                localStorage.setItem('user-' + _user.id, JSON.stringify(_user))
                if (_user.isCurrentUser) {
                    currentUser = _user
                    localStorage.setItem('currentUser', JSON.stringify(_user))
                }
            }
        }
        var keys = Object.entries(localStorage)
        for (var i = 0; i < localStorage.length; i++) {
            var key = keys[i];
            if (key[0].indexOf('delete-flashGang-') == 0 || key[0].indexOf('delete-flashDeck-') == 0) {
                localStorage.removeItem(key[0])
            }
        }
        if (dispatch) {
            dispatch({ type: ENDSYNCHRONISE, data: { flashDecks: postResult.flashDecks, flashGangs: postResult.flashGangs } })
        }
        if (decks.length || gangs.length) {
            connectionHandler.sendUpdateMessage(decks.map(deck => deck.id), gangs.map(gang => gang.id));
        }
    } else {
        console.log("ERROR SYNCHRONISING", postResult);
        if (postResult.responseCode >= 400) {
            if (dispatch) {
                dispatch({ type: SESSION_EXPIRED })
            }
        }
        /*for (e in postResult.errors) {
            let error=postResult.errors[e];
            if (error) {

            }
        }*/
    }
    console.log('Synchronisation complete')
}

const restfulResources = { synchronise: '/synchronise', account: '/account', login: '/login', rsvp: '/rsvp', resetpw: '/resetpw', setpw: '/setpw', poll: '/poll', setsettings: '/setsettings', gallery: '/gallery', admin: '/admin' }

async function postToServer(questObject) {
    var environment = env.getEnvironment(window.location.origin);
    var restfulResource = questObject.resource;
    var params = questObject.params;
    var isFormData = false
    if (typeof (params) == 'object') {
        for (var _name in params) {
            var param = params[_name]
            if (param && param.type == 'file') {
                isFormData = true
                //break
            }
        }
        if (isFormData) {
            var data = new FormData()
            for (var _name in params) {
                var param = params[_name]
                console.log('paramandname', param, _name)
                if (param && param.type == 'file') {
                    data.append('file', param.files[0])
                } else {
                    data.append(_name, param)
                }
            }
            params = data
        } else {
            params = JSON.stringify(params)
        }
    }
    var token = localStorage.getItem('flashJwt')
    if (questObject.resource == 'setpw') {
        token = questObject.params.token
    }
    var responseCode = 0;
    var method = 'POST'
    if (questObject.update) {
        method = 'PUT'
    } else if (questObject.delete) {
        method = 'DELETE'
    }
    var _headers = {}
    _headers.Authorization = token
    _headers.Accept = 'application/json, text/plain, */*'
    if (!isFormData) {
        _headers['Content-Type'] = 'application/json'
    }
    let reply = await fetch(environment.url + restfulResources[restfulResource], {
        method: method,
        credentials: "same-origin",
        headers: _headers,
        body: params
    })
        .then(function (response) {
            responseCode = response.status;
            return response.json();

        })
        .then(function (json) {
            console.log("REPLY FROM POST", json);
            return json
        })
        .catch(function (err) {
            responseCode = 0
            console.log('postToServer error', err)
            return {}
        })
    if (responseCode == 401 && reply.code === 'exp' && !questObject.retry) {
        //the token expired, refresh it and try again
        await refreshToken();
        questObject.retry = true;
        return await postToServer(questObject);
    }
    reply.responseCode = responseCode;
    console.log('server reply', reply)
    return reply
}

async function saveScore(flashDeck) {
    let score = localStorage.getItem('score-' + flashDeck.id)
    if (score) {
        score = JSON.parse(score)
    }
    let correctAnswers = 0
    let incorrectAnswers = 0
    let percentage = 0
    for (var i in flashDeck.flashCards) {
        let card = flashDeck.flashCards[i]
        if (card.correct) {
            correctAnswers++
        } else {
            incorrectAnswers++
        }
    }
    if (correctAnswers > 0) {
        percentage = (correctAnswers / flashDeck.flashCards.length) * 100
    }
    if (!score) {
        score = { flashDeckId: flashDeck.id, score: percentage, time: flashDeck.time, highScore: percentage }
    } else {
        if (score.percentage < percentage) {
            score.highScore = percentage
        }
        score.score = percentage
        score.time = flashDeck.time
    }
    localStorage.setItem('score-' + flashDeck.id, JSON.stringify(score))
}

async function getFromServer(questObject, method) {
    var environment = env.getEnvironment(window.location.origin);
    var restfulResource = questObject.resource;
    var params = questObject.params;
    var responseCode = 0;
    var token = localStorage.getItem('flashJwt');
    var _url = environment.url + restfulResources[restfulResource];
    if (params && params.id) {
        _url += '/' + params.id
    } else if (params) {
        let keys = Object.keys(params)
        _url += '?'
        for (var i in keys) {
            let key = keys[i]
            let value = params[key]
            if (Array.isArray(value)) {
                for (var j in value) {
                    _url += '&' + key + '=' + value[j]
                }
            } else {
                _url += '&' + key + '=' + value
            }
        }
    }
    console.log(_url, '_url')
    let reply = await fetch(_url, {
        method: method ? "DELETE" : "GET",
        credentials: "same-origin", // send cookies
        headers: {
            'Authorization': token,
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    })
        .then(function (response) {
            responseCode = response.status;
            console.log('middleware response', response)
            return response.json();

        })
        .then(function (json) {
            console.log("getFromServer then", json);
            return json
        })
    if (responseCode == 401 && reply.code === 'exp' && !questObject.retry) {
        await refreshToken();
        questObject.retry = true;
        return await getFromServer(questObject);
    } else {
        reply.responseCode = responseCode;
        return reply
    }
}

async function deleteFromServer(questObject) {
    return await getFromServer(questObject, 'deletion')
}

async function refreshToken() {
    var _refreshToken = localStorage.getItem('flashJwtRefresh');
    const params = {
        "grant_type": "refresh",
        "token": _refreshToken
    }
    var questObject = { resource: 'login', params: params };
    let refresh = await postToServer(questObject);
    if (refresh.responseCode != 200 && refresh.responseCode != 201) {
        console.log("failed to refresh token TODO clear the session, return to login");
    } else {
        console.log("token is refreshed, storing new tokens in session")
        localStorage.setItem('flashJwt', refresh.token)
        localStorage.setItem('flashJwtRefresh', refresh.refreshToken)
    }
    return refresh;

}

function scoreCard(deck) {
    console.log('deck', deck)
    if (!deck.hasOwnProperty('currentIndex')) {
        return
    }
    let card = deck.flashCards[deck.currentIndex]
    card.correct = true
    if (card.userAnswer && Array.isArray(card.userAnswer)) {
        const userAnswersSorted = card.userAnswer.sort()
        const correctAnswersSorted = card.correctAnswers.sort()
        if (JSON.stringify(userAnswersSorted) != JSON.stringify(correctAnswersSorted)) {
            card.correct = false
        }
    } else if (!card.userAnswer || card.userAnswer == '') {
        card.correct = false
    } else {
        let fuzzyAnswer = FuzzySet([card.correctAnswers[0]])
        let fuzzyAnswered = fuzzyAnswer.get(card.userAnswer)
        let fuzziness = 0
        let deckFuzziness = deck.fuzziness ? deck.fuzziness : 1
        if (fuzzyAnswered && fuzzyAnswered[0]) {
            if (fuzzyAnswered[0][0]) {
                fuzziness = fuzzyAnswered[0][0]
            }
        }
        let invertedFuzziness = 10 - (fuzziness * 10)
        if (invertedFuzziness > deckFuzziness) {
            card.correct = false
        }
    }
}
function selectNextCard(deck) {
    const answerType = deck.answerType
    const testType = deck.testType
    if (testType == 'EXAM') {
        if (!deck.hasOwnProperty('currentIndex')) {
            deck.currentIndex = -1;
            deck.startTime = new Date().getTime()
        }
        if (deck.currentIndex + 1 >= deck.flashCards.length) {
            deck.mode = 'COMPLETE'
        } else {
            deck.currentIndex++
        }
    } else if (testType == 'REVISION') {
        if (!deck.hasOwnProperty('currentIndex')) {
            deck.startTime = new Date().getTime()
        }
        let unansweredCards = []
        for (var i in deck.flashCards) {
            let card = deck.flashCards[i]
            if (!card.hasOwnProperty('correct')) {
                unansweredCards.push(i)
            }
        }
        if (unansweredCards.length == 0) {
            deck.mode = 'COMPLETE'
        } else {
            deck.currentIndex = unansweredCards[Math.floor(Math.random() * Math.floor(unansweredCards.length))]
        }
    } else if (testType == 'CRAM') {
        if (!deck.hasOwnProperty('currentIndex')) {
            deck.startTime = new Date().getTime()
        }
        let unansweredCards = []
        for (var i in deck.flashCards) {
            let card = deck.flashCards[i]
            if (!card.correct) {
                unansweredCards.push(i)
                delete card.correct;
            }
        }
        if (unansweredCards.length == 0) {
            deck.mode = 'COMPLETE'
        } else {
            deck.currentIndex = unansweredCards[Math.floor(Math.random() * Math.floor(unansweredCards.length))]
        }
    }
    if (answerType == 'MULTIPLE') {
        let card = deck.flashCards[deck.currentIndex]
        card.multipleChoices = []
        if (card.correctAnswers && card.incorrectAnswers) {
            card.multipleChoices = [...card.correctAnswers, ...card.incorrectAnswers]
        } else if (card.correctAnswers) {
            card.multipleChoices = [...card.correctAnswers]
        } if (card.multipleChoices.length >= 5) {

        } else {
            let answers = []
            for (var i in deck.flashCards) {
                if (i != deck.currentIndex) {
                    let goodAnswers = deck.flashCards[i]
                    answers = [...answers, ...goodAnswers.correctAnswers]
                    if (goodAnswers.incorrectAnswers) {
                        answers = [...answers, ...goodAnswers.incorrectAnswers]
                    }
                }
            }
            while (card.multipleChoices.length < 5) {
                let answerIndex = Math.floor(Math.random() * Math.floor(answers.length))
                let anAnswer = answers[answerIndex]
                answers.splice(answerIndex, 1)
                card.multipleChoices.push(anAnswer)
                if (answers.length == 0) {
                    break
                }
            }
            card.multipleChoices = card.multipleChoices.sort((a, b) => {
                return Math.floor(Math.random() * Math.floor(3)) - 1
            })
        }
    }
    if (deck.mode == 'COMPLETE') {
        deck.time = new Date().getTime() - deck.startTime
        console.log({ deck })
        saveScore(deck);
        synchronise();
    }
}
export function flashGangMiddleware({ dispatch }) {
    return function (next) {
        return async function (action) {
            if (action.type === NEW_DECK) {
                console.log('Middleware NEW_DECK')
                let _user = JSON.parse(localStorage.getItem('currentUser'))
                action.data.flashDeck = { mode: 'EDIT', remainingCardsAllowed: _user.profile.maxCardsPerDeck, owner: _user.id }
            } else if (action.type === NEW_GANG) {
                console.log('Middleware NEW_GANG')
                let _user = JSON.parse(localStorage.getItem('currentUser'))
                action.flashGang = { remainingMembersAllowed: _user.profile.maxMembersPerGang, owner: _user.id }
            }
            else if (action.type === SAVE_DECK) {
                console.log('Middleware SAVE_DECK')
                if (!action.data.flashDeck.id) {
                    let _user = JSON.parse(localStorage.getItem('currentUser'))
                    action.data.flashDeck.id = uuidv4()
                    _user.remainingFlashDecksAllowed = _user.remainingFlashDecksAllowed - 1
                    action.data.user = _user
                    localStorage.setItem('currentUser', JSON.stringify(_user))
                    console.log('Decrementing', _user)
                }
                var mode = action.data.flashDeck.mode
                delete action.data.flashDeck.dirty
                delete action.data.flashDeck.mode
                delete action.data.flashDeck.lastModified
                localStorage.setItem('flashDeck-' + action.data.flashDeck.id, JSON.stringify(action.data.flashDeck))
                action.data.flashDeck.mode = mode
                synchronise(dispatch);
                //connectionHandler.sendUpdateMessage(['10']);
            }
            else if (action.type === NEXT_CARD) {
                console.log('Middleware NEXT_CARD')
                if (action.data.flashDeck) {
                    if (!action.data.flashDeck.flashCards) {
                        action.data.flashDeck.flashCards = []
                    }
                    if (action.data.flashDeck.mode == 'TEST') {
                        selectNextCard(action.data.flashDeck)
                    } else {
                        if (action.data.flashDeck.hasOwnProperty('currentIndex')) {
                            action.data.flashDeck.currentIndex++
                        } else {
                            action.data.flashDeck.currentIndex = 0
                        }
                        if (action.data.flashDeck.flashCards.length <= action.data.flashDeck.currentIndex && action.data.flashDeck.mode == 'EDIT') {
                            action.data.flashDeck.remainingCardsAllowed--
                            action.data.flashDeck.flashCards.push({})
                            console.log('flashDeck from middleware for remainingCards', action.data.flashDeck)
                        }
                        if (action.data.flashDeck.currentIndex < action.data.flashDeck.flashCards.length) {
                            delete action.data.flashDeck.flashCards[action.data.flashDeck.currentIndex].correct
                        }
                    }
                }
            } else if (action.type === LOAD_DECKS) {
                console.log('Middleware LOAD_DECKS')
                var decks = []
                var keys = Object.entries(localStorage)
                for (var i = 0; i < localStorage.length; i++) {
                    var key = keys[i];
                    if (key[0].indexOf('flashDeck-') == 0) {
                        decks.push(JSON.parse(localStorage.getItem(key[0])))
                    }
                }
                action.flashDecks = decks
            } else if (action.type === LOAD_FLASHDECK) {
                console.log('Middleware LOAD_FLASHDECK')
                var flashDeck = JSON.parse(localStorage.getItem('flashDeck-' + action.data.flashDeckId))
                flashDeck.source = action.data.source
                action.data.flashDeck = flashDeck
                flashDeck.dirty = false
                delete flashDeck.currentIndex
                action.data.flashDeck.mode = action.data.mode ? action.data.mode : 'TEST'
                if (action.data.answerType && action.data.testType) {
                    flashDeck.answerType = action.data.answerType
                    flashDeck.testType = action.data.testType
                    selectNextCard(flashDeck)
                }
                flashDeck.scores = []
                var keys = Object.entries(localStorage)
                for (var i = 0; i < localStorage.length; i++) {
                    var key = keys[i];
                    if (key[0].indexOf('user-') == 0) {
                        let _user = JSON.parse(localStorage.getItem(key[0]))
                        console.log('_user', _user)
                        for (var j in _user.scores) {
                            let score = _user.scores[j]
                            if (score && score.flashDeckId == flashDeck.id) {
                                score.firstName = _user.firstName
                                score.lastName = _user.lastName
                                score.userId = _user.id
                                flashDeck.scores.push(score)
                            }
                        }
                    }
                }
                console.log('flashDeck SCORES', flashDeck)
            }
            else if (action.type === SCORE_CARD) {
                scoreCard(action.data.flashDeck);
                if (action.data.flashDeck.testType != 'REVISION' && action.data.flashDeck.testType != 'CRAM') {
                    selectNextCard(action.data.flashDeck)
                }
                console.log('Middleware SCORE_CARD')
            } else if (action.type === DELETE_DECK) {
                console.log('Middleware DELETE_DECK')
                let deletedDeck = JSON.stringify({ id: action.data.flashDeckId })
                localStorage.setItem('delete-flashDeck-' + action.data.flashDeckId, deletedDeck)
                localStorage.removeItem('flashDeck-' + action.data.flashDeckId)
                let _user = JSON.parse(localStorage.getItem('currentUser'))
                _user.remainingFlashDecksAllowed++
                action.data.user = _user
                synchronise(dispatch)
                localStorage.setItem('currentUser', JSON.stringify(_user))
            } else if (action.type === DELETE_GANG) {
                console.log('Middleware DELETE_GANG')
                let deletedGang = JSON.stringify({ id: action.data.flashGangId })
                localStorage.setItem('delete-flashGang-' + action.data.flashGangId, deletedGang)
                localStorage.removeItem('flashGang-' + action.data.flashGangId)
                let _user = JSON.parse(localStorage.getItem('currentUser'))
                _user.remainingFlashGangsAllowed++
                action.data.user = _user
                synchronise(dispatch)
                localStorage.setItem('currentUser', JSON.stringify(_user))
            } else if (action.type === DELETE_CARD) {
                console.log('Middleware DELETE_CARD')
                action.data.flashDeck.flashCards.splice(action.data.flashDeck.currentIndex, 1)
                if (action.data.flashDeck.currentIndex >= action.data.flashDeck.flashCards.length) {
                    action.data.flashDeck.currentIndex = action.data.flashDeck.flashCards.length - 1
                    if (action.data.flashDeck.currentIndex < 0) {
                        delete action.data.flashDeck.currentIndex
                    }
                }
                action.data.flashDeck.remainingCardsAllowed++
            } else if (action.type === PREV_CARD) {
                console.log('Middleware PREV_CARD')
                action.data.flashDeck.currentIndex = action.data.flashDeck.currentIndex - 1
                if (action.data.flashDeck.currentIndex < 0) {
                    delete action.data.flashDeck.currentIndex
                }
            } else if (action.type === LOAD_GANGS) {
                console.log('Middleware LOAD_GANGS')
                var gangs = []
                var keys = Object.entries(localStorage)
                for (var i = 0; i < localStorage.length; i++) {
                    var key = keys[i];
                    if (key[0].indexOf('flashGang-') == 0) {
                        gangs.push(JSON.parse(localStorage.getItem(key[0])))
                    }
                }
                action.flashGangs = gangs
            } else if (action.type === SAVE_GANG) {
                if (!action.data.flashGang.id) {
                    let _user = JSON.parse(localStorage.getItem('currentUser'))
                    action.data.flashGang.id = uuidv4()
                    _user.remainingFlashGangsAllowed--
                    action.data.user = _user
                }
                let cleanGang = Object.assign({}, action.data.flashGang)
                cleanGang.flashDecks = []
                if (action.data.flashGang.flashDecks) {
                    for (var i in action.data.flashGang.flashDecks) {
                        let gangDeck = action.data.flashGang.flashDecks[i]
                        cleanGang.flashDecks.push(gangDeck.id)
                    }
                }
                delete action.data.flashGang.lastModified
                localStorage.setItem('flashGang-' + action.data.flashGang.id, JSON.stringify(cleanGang))
                action.flashGang = action.data.flashGang;
                delete action.data.flashGang;
                synchronise(dispatch)
            } else if (action.type === LOAD_FLASHGANG) {
                console.log('Middleware LOAD_FLASHGANG')
                var flashGang = JSON.parse(localStorage.getItem('flashGang-' + action.data.flashGangId))
                action.flashGang = flashGang
                //flashDeck.dirty = false
                let gangDecks = []
                if (flashGang.flashDecks) {
                    for (var i in flashGang.flashDecks) {
                        let deckId = flashGang.flashDecks[i]
                        let deck = JSON.parse(localStorage.getItem('flashDeck-' + deckId))
                        gangDecks.push(deck)
                    }
                }
                if (flashGang.members) {
                    for (var i in flashGang.members) {
                        let _member = flashGang.members[i];
                        let _user = localStorage.getItem('user-' + _member.id);
                        if (_user) {
                            _user = JSON.parse(_user);
                            Object.assign(_member, _user);
                            console.log("MEMBER", _member);
                        }
                    }
                }
                flashGang.flashDecks = gangDecks
            } else if (action.type === CREATE_ACCOUNT) {
                dispatch({ type: LOADING, data: { loading: true } })
                console.log('Middleware CREATE_ACCOUNT')
                var regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                let isValid = regExp.test((action.data.user.id).toLowerCase());
                let errors = { fields: [] }
                if (!isValid) {
                    errors.fields.push({ id: 'Email address must be valid.' })
                }
                if (action.data.user.password != action.data.user.confirmPassword) {
                    errors.fields.push({ password: 'Passwords must be identical.' })
                }
                if (errors.fields.length > 0) {
                    action.errors = errors
                } else {
                    let questObject = {}
                    questObject.params = Object.assign({}, action.data.user)
                    questObject.resource = 'account'
                    let postResult = await postToServer(questObject)
                    if (postResult.user) {
                        localStorage.setItem('currentUser', JSON.stringify(postResult.user))
                    }
                    if (postResult.token) {
                        localStorage.setItem('flashJwt', postResult.token)
                        localStorage.setItem('flashJwtRefresh', postResult.refresh)
                    }
                    if (postResult.errors) {
                        action.errors = postResult.errors
                    }
                }
            } else if (action.type === LOGIN) {
                console.log('Middleware LOGIN')
                dispatch({ type: LOADING, data: { loading: true } })
                let questObject = {}
                questObject.params = Object.assign({}, action.data.user)
                questObject.resource = 'login'
                questObject.params.grant_type = 'password'
                let postResult = await postToServer(questObject)
                console.log('postResult', postResult)
                if (postResult.user && postResult.user.suspended == true) {
                    console.log('middleware setting user to suspended')
                    action.data.user.suspended = true
                } else {
                    if (postResult.user) {
                        localStorage.setItem('currentUser', JSON.stringify(postResult.user))
                    }
                    if (postResult.token) {
                        localStorage.setItem('flashJwt', postResult.token)
                        localStorage.setItem('flashJwtRefresh', postResult.refresh)
                        connectionHandler.connect(dispatch)
                        await synchronise(dispatch)

                    } else {
                        action.errors = postResult.errors
                    }
                }
            } else if (action.type === LOGIN_SOCIAL) {
                console.log('Middleware LOGIN_SOCIAL', action.data.jwt)
                dispatch({ type: LOADING, data: { loading: true } })
                if (action.data.jwt) {
                    localStorage.setItem('flashJwt', action.data.jwt)
                    localStorage.setItem('flashJwtRefresh', action.data.refreshToken);
                    localStorage.setItem("currentUser", JSON.stringify(action.data.user))
                    connectionHandler.connect(dispatch)
                    await synchronise(dispatch)
                } else {
                    action.errors = action.data.errors
                }
            } else if (action.type === RSVP) {
                console.log('Middleware RSVP')
                let questObject = {}
                questObject.params = Object.assign({}, action.data)
                questObject.resource = 'rsvp'
                let postResult = await postToServer(questObject)
                synchronise(dispatch)
            } else if (action.type === RESET_PASSWORD) {
                console.log('Middleware RESET_PASSWORD')
                dispatch({ type: LOADING, data: { loading: true } })
                let questObject = {}
                questObject.params = Object.assign({}, action.data.user)
                questObject.params.account_function = 'resetpw'
                questObject.resource = 'resetpw'
                let postResult = await postToServer(questObject)
                action.errors = postResult.errors
            } else if (action.type === SET_PASSWORD) {
                console.log('Middleware SET_PASSWORD')
                dispatch({ type: LOADING, data: { loading: true } })
                if (action.data.user.password != action.data.user.confirmPassword) {
                    let errors = {}
                    errors.fields.push({ password: 'Passwords must be identical.' })
                } else {
                    let questObject = {}
                    questObject.params = Object.assign({}, action.data.user)
                    questObject.params.account_function = 'setpw'
                    questObject.resource = 'setpw'
                    questObject.params.token = action.data.token
                    let postResult = await postToServer(questObject)
                    if (postResult.token) {
                        localStorage.setItem('flashJwt', postResult.token)
                        localStorage.setItem('flashJwtRefresh', postResult.refresh)
                        await synchronise(dispatch)
                    } else {
                        action.errors = postResult.errors
                    }
                }
            } else if (action.type === POLL) {
                console.log('Middleware POLL')
                let questObject = {}
                questObject.params = Object.assign({}, action.data)
                questObject.resource = 'poll'
                postToServer(questObject)
            } else if (action.type === SYNCHRONISE) {
                console.log('Middleware SYNCHRONISE')
                synchronise(dispatch)
            } else if (action.type === SET_SETTINGS) {
                console.log('Middleware SET_SETTINGS')
                let questObject = {}
                questObject.params = Object.assign({}, action.data.user)
                questObject.params.account_function = 'setsettings'
                questObject.resource = 'setsettings'
                let postResult = await postToServer(questObject)
                if (postResult.user) {
                    localStorage.setItem('currentUser', JSON.stringify(postResult.user))
                }
            } else if (action.type === UPLOAD_IMAGE) {
                console.log('Middleware UPLOAD_IMAGE', action)
                dispatch({ type: LOADING, data: { loading: true, id: action.data.id } })
                let questObject = {}
                questObject.params = { source: action.data.source }
                questObject.resource = 'gallery'
                let postResult = await postToServer(questObject);
                action.id = action.data.id;
                if (postResult.url) {
                    action.url = postResult.url
                } else {
                    action.errors = postResult.errors ? postResult.errors : [];
                    if (postResult.error) {
                        action.errors.push(postResult.error);
                    }
                    console.log("There's been an error uploading the image", postResult);
                }
            } else if (action.type === GET_IMAGES) {
                console.log('Middleware GET_IMAGES')
                let questObject = {}
                questObject.resource = 'gallery'
                let getResult = await getFromServer(questObject)
                if (getResult.images) {
                    action.images = []
                    for (var i in getResult.images) {
                        action.images.push({ url: getResult.images[i] })
                    }
                    console.log('getResult.images', getResult.images)
                } else {
                    action.errors = getResult.errors ? getResult.errors : [];
                    if (getResult.error) {
                        action.errors.push(getResult.error);
                    }
                    if (getResult.code == 'exp') {
                        dispatch({ type: SESSION_EXPIRED })
                    }
                    console.log("Error receiving images", getResult, action)
                }
            } else if (action.type === DELETE_IMAGES) {
                console.log('Middleware DELETE_IMAGES')
                let imagesToDelete = []
                let imagesToRetain = []
                for (var i in action.data.images) {
                    if (action.data.images[i].isSelected) {
                        imagesToDelete.push(action.data.images[i].url)
                    } else {
                        imagesToRetain.push(action.data.images[i])
                    }
                }
                let questObject = {}
                questObject.params = {}
                questObject.resource = 'gallery'
                //Commenting out delete is a workaround - Crockstack doesn't support body when method is delete
                //questObject.delete = true
                questObject.params.images = imagesToDelete
                console.log('Middleware DELETE_IMAGES questObject', questObject)
                let getResult = await postToServer(questObject)
                if (action.errors) {
                    action.errors = getResult.errors ? getResult.errors : [];
                    if (getResult.error) {
                        action.errors.push(getResult.error);
                    }
                } else {
                    action.images = imagesToRetain
                }
                console.log("Error deleting images", getResult, action)
            } else if (action.type === GET_ALL_USERS) {
                dispatch({ type: LOADING, data: { loading: true } })
                console.log('Middleware GET_ALL_USERS')
                let questObject = {}
                questObject.resource = 'admin'
                if (action.data.filters) {
                    questObject.params = action.data.filters
                } else {
                    questObject.params = {}
                }
                questObject.params.type = 'user'
                let getResult = await getFromServer(questObject)
                console.log('getResult', getResult)
                if (getResult.users) {
                    action.users = getResult.users
                    console.log('getResult.users', getResult.users)
                } else {
                    action.errors = getResult.errors ? getResult.errors : [];
                    if (getResult.error) {
                        action.errors.push(getResult.error);
                    }
                    console.log("Error receiving users", getResult, action)
                }
                if (getResult.LastEvaluatedKey) {
                    action.cursor = getResult.LastEvaluatedKey
                }
            } else if (action.type === GET_ALL_DECKS) {
                dispatch({ type: LOADING, data: { loading: true } })
                console.log('Middleware GET_ALL_DECKS')
                let questObject = {}
                questObject.resource = 'admin'
                if (action.data.filters) {
                    questObject.params = action.data.filters
                } else {
                    questObject.params = {}
                }
                questObject.params.type = 'deck'
                let getResult = await getFromServer(questObject)
                console.log('getResult', getResult)
                if (getResult.decks) {
                    action.decks = getResult.decks
                    console.log('getResult.decks', getResult.decks)
                } else {
                    action.errors = getResult.errors ? getResult.errors : [];
                    if (getResult.error) {
                        action.errors.push(getResult.error);
                    }
                    console.log("Error receiving users", getResult, action)
                }
                if (getResult.LastEvaluatedKey) {
                    action.cursor = getResult.LastEvaluatedKey
                }
            } else if (action.type === GET_ALL_GANGS) {
                dispatch({ type: LOADING, data: { loading: true } })
                console.log('Middleware GET_ALL_GANGS')
                let questObject = {}
                questObject.resource = 'admin'
                if (action.data.filters) {
                    questObject.params = action.data.filters
                } else {
                    questObject.params = {}
                }
                questObject.params.type = 'gang'
                let getResult = await getFromServer(questObject)
                console.log('getResult', getResult)
                if (getResult.gangs) {
                    action.gangs = getResult.gangs
                    console.log('getResult.gangs', getResult.gangs)
                } else {
                    action.errors = getResult.errors ? getResult.errors : [];
                    if (getResult.error) {
                        action.errors.push(getResult.error);
                    }
                    console.log("Error receiving gangs", getResult, action)
                }
                if (getResult.LastEvaluatedKey) {
                    action.cursor = getResult.LastEvaluatedKey
                }
            } else if (action.type === SAVE_USER) {
                console.log('Middleware SAVE_USER')
                let questObject = {}
                questObject.params = {}
                questObject.resource = 'admin'
                questObject.params.user = action.user
                let getResult = await postToServer(questObject)
                if (action.errors) {
                    action.errors = getResult.errors ? getResult.errors : [];
                    if (getResult.error) {
                        action.errors.push(getResult.error);
                    }
                } else {
                    //action.user = user
                }
                console.log("Error saving user", getResult, action)
            } else if (action.type === SUSPEND_DECK) {
                console.log('Middleware SUSPEND_DECK')
                let questObject = {}
                questObject.params = {}
                questObject.params.type = 'suspendDeck'
                questObject.resource = 'admin'
                questObject.params.deck = action.deck.deck
                questObject.params.deck.id = action.deck.deck.id
                console.log('MIDDLEWARE QUESTOBJECT', questObject.params)
                let getResult = await postToServer(questObject)
                if (action.errors) {
                    action.errors = getResult.errors ? getResult.errors : [];
                    if (getResult.error) {
                        action.errors.push(getResult.error);
                    }
                    console.log("Error suspending deck", getResult, action)
                } else {
                    //action.user = user
                }
                console.log("Error suspending deck", getResult, action)
            } else if (action.type === SUSPEND_GANG) {
                console.log('Middleware SUSPEND_GANG')
                let questObject = {}
                questObject.params = {}
                questObject.params.type = 'suspendGang'
                questObject.resource = 'admin'
                questObject.params.gang = action.gang.gang
                questObject.params.gang.id = action.gang.gang.id
                console.log('MIDDLEWARE QUESTOBJECT', questObject.params)
                let getResult = await postToServer(questObject)
                if (action.errors) {
                    action.errors = getResult.errors ? getResult.errors : [];
                    if (getResult.error) {
                        action.errors.push(getResult.error);
                    }
                    console.log("Error suspending gang", getResult, action)
                } else {
                    //action.user = user
                }
                console.log("Error suspending gang", getResult, action)
            } else if (action.type === SUSPEND_USER) {
                console.log('Middleware SUSPEND_USER')
                let questObject = {}
                questObject.params = {}
                questObject.params.type = 'suspendUser'
                questObject.resource = 'admin'
                questObject.params.user = action.user.user
                questObject.params.user.id = action.user.user.id
                console.log('MIDDLEWARE QUESTOBJECT', questObject.params)
                let getResult = await postToServer(questObject)
                if (action.errors) {
                    action.errors = getResult.errors ? getResult.errors : [];
                    if (getResult.error) {
                        action.errors.push(getResult.error);
                    }
                    console.log("Error suspending user", getResult, action)
                } else {
                    //action.user = user
                }
                
            } else if (action.type === LOG_OUT) {
                //localStorage.removeItem("flashJwt")
                //localStorage.removeItem("flashJwtRefresh");
                //localStorage.removeItem("currentUser");
                localStorage.clear();
            } else if (action.type === DELETE_ACCOUNT) {
                let questObject = {}
                questObject.params = {}
                questObject.params.account_function = 'delete_account'
                questObject.resource = 'account'
                let getResult = await postToServer(questObject);
                if (action.errors) {
                    action.errors = getResult.errors ? getResult.errors : [];
                    if (getResult.error) {
                        action.errors.push(getResult.error);
                    }
                    console.log("Error deleting user", getResult, action)
                } else {
                    //localStorage.removeItem("flashJwt")
                    //localStorage.removeItem("flashJwtRefresh");
                    //localStorage.removeItem("currentUser");
                    localStorage.clear();
                }
            } else if (action.type === DOWNLOAD_DATA) {
                let questObject = {}
                questObject.params = {}
                questObject.params.account_function = 'download_data'
                questObject.resource = 'account'
                let getResult = await postToServer(questObject);
                if (action.errors) {
                    action.errors = getResult.errors ? getResult.errors : [];
                    if (getResult.error) {
                        action.errors.push(getResult.error);
                    }
                    console.log("Error deleting user", getResult, action)
                }
            }
            return next(action);
        }
    };
};