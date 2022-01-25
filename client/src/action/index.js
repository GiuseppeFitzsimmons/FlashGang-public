export const NEW_DECK = 'NEW_DECK';
export const NEW_GANG = 'NEW_GANG';
export const SAVE_DECK = 'SAVE_DECK';
export const NEXT_CARD = 'NEXT_CARD';
export const LOAD_DECKS = 'LOAD_DECKS';
export const LOAD_FLASHDECK = 'LOAD_FLASHDECK';
export const SCORE_CARD = 'SCORE_CARD';
export const DELETE_DECK = 'DELETE_DECK';
export const DELETE_CARD = 'DELETE_CARD';
export const PREV_CARD = 'PREV_CARD';
export const LOAD_GANGS = 'LOAD_GANGS';
export const SAVE_GANG = 'SAVE_GANG';
export const LOAD_FLASHGANG = 'LOAD_FLASHGANG';
export const CREATE_ACCOUNT = 'CREATE_ACCOUNT';
export const LOGIN = 'LOGIN';
export const LOADING = 'LOADING';
export const RSVP = 'RSVP';
export const RESET_PASSWORD = 'RESET_PASSWORD';
export const SET_PASSWORD = 'SET_PASSWORD';
export const SAVE_SCORE = 'SAVE_SCORE';
export const POLL = 'POLL';
export const DELETE_GANG = 'DELETE_GANG';
export const SYNCHRONISE = 'SYNCHRONISE';
export const SET_SETTINGS = 'SET_SETTINGS';
export const ENDSYNCHRONISE = 'ENDSYNCHRONISE';
export const UPLOAD_IMAGE = 'UPLOAD_IMAGE';
export const GET_IMAGES = 'GET_IMAGES';
export const DELETE_IMAGES = 'DELETE_IMAGES';
export const SESSION_EXPIRED = 'SESSION_EXPIRED';
export const GET_ALL_USERS = 'GET_ALL_USERS';
export const GET_ALL_DECKS = 'GET_ALL_DECKS';
export const SAVE_USER = 'SAVE_USER';
export const SUSPEND_DECK = 'SUSPEND_DECK';
export const SUSPEND_GANG = 'SUSPEND_GANG';
export const SUSPEND_USER = 'SUSPEND_USER';
export const UNSUSPEND_DECK = 'UNSUSPEND_DECK';
export const UNSUSPEND_GANG = 'UNSUSPEND_GANG';
export const UNSUSPEND_USER = 'UNSUSPEND_USER';
export const GET_ALL_GANGS = 'GET_ALL_GANGS';
export const LOG_OUT = 'LOG_OUT';
export const LOGIN_SOCIAL = 'LOGIN_SOCIAL'
export const DELETE_ACCOUNT = 'DELETE_ACCOUNT'
export const DOWNLOAD_DATA = 'DOWNLOAD_DATA'

export function newDeck() {
    console.log("Action NEW_DECK")
    return { type: NEW_DECK, data: { flashDeck: {} } }
}
export function newGang() {
    console.log("Action NEW_GANG")
    return { type: NEW_GANG, data: { flashGang: {} } }
}
export function saveDeck(flashDeck) {
    console.log("Action SAVE_DECK")
    return { type: SAVE_DECK, data: { flashDeck } }
}
export function nextCard(flashDeck) {
    console.log("Action NEXT_CARD")
    return { type: NEXT_CARD, data: { flashDeck } }
}
export function loadDecks() {
    console.log("Action LOAD_DECKS")
    return { type: LOAD_DECKS }
}
export function loadFlashDeck(flashDeckId, mode, answerType, testType, source) {
    console.log("Action LOAD_FLASHDECK")
    console.log('source', source)
    return { type: LOAD_FLASHDECK, data: { flashDeckId, mode, answerType, testType, source } }

}
export function scoreCard(flashDeck) {
    console.log("Action SCORE_CARD")
    return { type: SCORE_CARD, data: { flashDeck } }

}
export function deleteDeck(flashDeckId) {
    console.log("Action DELETE_DECK")
    return { type: DELETE_DECK, data: { flashDeckId } }

}
export function deleteGang(flashGangId) {
    console.log("Action DELETE_GANG")
    return { type: DELETE_GANG, data: { flashGangId } }

}
export function deleteCard(flashDeck) {
    console.log("Action DELETE_CARD")
    return { type: DELETE_CARD, data: { flashDeck } }

}
export function prevCard(flashDeck) {
    console.log("Action PREV_CARD")
    return { type: PREV_CARD, data: { flashDeck } }

}
export function loadGangs() {
    console.log("Action LOAD_GANGS")
    return { type: LOAD_GANGS }
}
export function saveGang(flashGang) {
    console.log("Action SAVE_GANG")
    return { type: SAVE_GANG, data: { flashGang } }
}
export function loadFlashGang(flashGangId) {
    console.log("Action LOAD_FLASHGANG")
    return { type: LOAD_FLASHGANG, data: { flashGangId } }

}
export function createAccount(user) {
    console.log("Action CREATE_ACCOUNT")
    return { type: CREATE_ACCOUNT, data: { user } }

}
export function logIn(user) {
    console.log("Action LOGIN", user)
    return { type: LOGIN, data: { user } }

}
export function loginSocial({jwt, refreshToken, user}) {
    console.log("Action LOGIN_SOCIAL")
    return { type: LOGIN_SOCIAL, data: { jwt, refreshToken, user } }

}
export function sendRSVP(flashGangId, acceptance) {
    console.log("Action RSVP")
    return { type: RSVP, data: { flashGangId, acceptance } }

}
export function resetPassword(user) {
    console.log("Action RESET_PASSWORD")
    return { type: RESET_PASSWORD, data: { user } }

}
export function setPassword(user, token) {
    console.log("Action SET_PASSWORD")
    return { type: SET_PASSWORD, data: { user, token } }

}
export function poll(poll) {
    console.log("Action POLL")
    return { type: POLL, data: { poll } }

}
export function synchronise() {
    console.log("Action SYNCHRONISE")
    return { type: SYNCHRONISE }

}
export function setSettings(user) {
    console.log("Action SET_SETTINGS")
    return { type: SET_SETTINGS, data: { user } }

}
export function uploadImage(source, id) {
    console.log("Action UPLOAD_IMAGE")
    return { type: UPLOAD_IMAGE, data: { source, id } }

}
export function getImages() {
    console.log("Action GET_IMAGES")
    return { type: GET_IMAGES }

}
export function deleteImages(images) {
    console.log("Action DELETE_IMAGES")
    return { type: DELETE_IMAGES, data: { images } }

}
export function getAllUsers(filters) {
    console.log("Action GET_ALL_USERS")
    return { type: GET_ALL_USERS, users: {}, data: { filters } }

}
export function getAllDecks(filters) {
    console.log("Action GET_ALL_DECKS")
    return { type: GET_ALL_DECKS, decks: {}, data: { filters } }

}
export function getAllGangs(filters) {
    console.log("Action GET_ALL_GANGS")
    return { type: GET_ALL_GANGS, gangs: {}, data: { filters } }

}
export function saveUser(user) {
    console.log("Action SAVE_USER")
    return { type: SAVE_USER, user: { user } }

}
export function suspendDeck(deck) {
    console.log("Action SUSPEND_DECK")
    return { type: SUSPEND_DECK, deck: { deck } }
}
export function suspendGang(gang) {
    console.log("Action SUSPEND_GANG")
    return { type: SUSPEND_GANG, gang: { gang } }
}
export function suspendUser(user) {
    console.log("Action SUSPEND_USER")
    return { type: SUSPEND_USER, user: { user } }
}
export function logout() {
    console.log("Action LOG_OUT")
    return { type: LOG_OUT }

}
export function deleteAccount() {
    return { type: DELETE_ACCOUNT }

}
export function downloadData() {
    return { type: DOWNLOAD_DATA }

}