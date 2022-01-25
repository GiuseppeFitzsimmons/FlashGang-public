const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4')

function getSigningSecret() {
    //TODO something better than this
    return process.env.SIGNING_SECRET
}
function validateToken(event, ignoreExpiration, scope) {
    console.log('tokenevent', event)
    signingSecret=getSigningSecret();
    var token = event.authorizationToken;
    if ((!token || token == '') && event.headers) {
        token = event.headers.Authorization;
        if (!token || token == '') {
            token = event.headers.authorization;
        }
    } else {
        if (event.body){
            let _body=event.body;
            if (typeof _body=='string') {
                _body=JSON.parse(_body);
            }
            token = _body.token
        }
    }
    if (!token) {
        err=new Error("Unauthorized");
        err.statusCode=401;
        err.message="Unauthorized";
        console.log("No token, rejecting", err);
        throw err;
    }
    if (token.toLowerCase().indexOf("bearer") == 0) {
        token = token.substr(7);
    }
    var decoded;
    if (!token || token == '') {
        console.log("No token, rejecting...");
        throw fourOhOne();
    }
    try {
        decoded = jwt.verify(token, signingSecret);
        console.log("decoded", decoded)
    } catch (err) {
        console.log(err);
        throw fourOhOne();
    }
    if (scope) {
        if (!decoded.scope.split(' ').find(s=>s==scope)) {
            throw fourOhOne('invalid scope', scope);
        }
    }
    if (decoded) {
        if (ignoreExpiration || new Date().getTime() < decoded.exp) {
            return decoded;
        } else {
            console.log("Token is expired, rejecting...");
            throw fourOhOne("Token has expired", 'exp');
        }
    }
};
function fourOhOne(message, code) {
    if (!message) {
        message="Unauthorized";
    }
    err=new Error(message);
    err.statusCode=401;
    err.message=message;
    if (code) {
        err.code=code;
    }
    return err;
}

function generateNewPair(userId, scope, duration) {
    signingSecret=getSigningSecret();
    console.log("generateNewPair SIGNING SECRET", signingSecret);
    tokenPayload = {};
    tokenPayload.iss = 'flashgang';
    tokenPayload.sub = userId;
    tokenPayload.uuid=uuidv4();
    tokenPayload.scope=scope;
    var now = new Date();
    let expiry=duration ? duration : process.env.TOKEN_DURATION ? (process.env.TOKEN_DURATION*1) : 30;
    now.setMinutes(now.getMinutes() + expiry);
    now = new Date(now);
    tokenPayload.exp = now.getTime();
    var signedJwt = jwt.sign(tokenPayload, signingSecret);
    if (tokenPayload.scope!="PASSWORD") {
        refreshTokenPayload={};
        refreshTokenPayload.sub = userId;
        refreshTokenPayload.uuid = tokenPayload.uuid;
        now.setMinutes(now.getMinutes() + 6*60);
        refreshTokenPayload.exp = now.getTime();
        var signedRefresh = jwt.sign(refreshTokenPayload, signingSecret);
    }
    return {signedJwt, signedRefresh};
}


module.exports = {
    validateToken,
    generateNewPair
};
/*
function test() {
    process.env.SIGNING_SECRET='Q1fdqsfez1qLqLqV@&5YRv3duJtAtJi3MSpXI4R]XqiI]ckCorSSOZ35V38p@&5Yqsfz14CmMTxldkeSSc12SCOieD8è7èdfkmBnx';
    let pair=generateNewPair('phillip@flashgang.io', 'all', 1000000);
    let jwt=validateToken({authorizationToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmbGFzaGdhbmciLCJzdWIiOiJwaGlsbGlwLmZpdHpzaW1tb25zQGdtYWlsLmNvbSIsInV1aWQiOiI2NDJlYzUxMS04ZDkzLTRjODctOWQ2NS05MWMxNGRkMDZhMzMiLCJzY29wZSI6ImFsbCIsImV4cCI6MTU3NjI1NDYwOTI5NiwiaWF0IjoxNTc2MjUzODg5fQ.ZJ2Rfw7YuCADwWHeiI3VnKBzCQ8Dxl3Bu0CHdA1VpE8'}, true, 'all');
    console.log(jwt);
}
test();
*/