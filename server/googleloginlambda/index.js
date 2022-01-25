const axios = require('axios');
const qs = require('qs');
const dynamodbfordummies = require('dynamofordummies');
const tokenUtility = require('tokenutility');
//comment

exports.handler = async (event, context) => {
    console.log("Google Login Lambda event body", event);
    const code = event.queryStringParameters.code
    const scope = event.queryStringParameters.scope
    try {
        if (code) {
            console.log('process.env.GOOGLE_REDIRECT_URI', process.env.GOOGLE_REDIRECT_URI)
            let result = await new Promise((resolve, reject) => {
                const data = {
                    code: code,
                    client_id: '979434939914-mmo8birn7i0okdb888crfjej7mpj1q66.apps.googleusercontent.com',
                    client_secret: 'Hlo9f_fz4OEvvifG3WOWvonF',
                    grant_type: 'authorization_code',
                    redirect_uri: process.env.GOOGLE_REDIRECT_URI
                }
                const options = {
                    method: 'POST',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    data: qs.stringify(data),
                    url: 'https://www.googleapis.com/oauth2/v4/token/'
                }
                console.log('options', options)
                axios(options).then(response => {
                    console.log('response', response)
                    resolve(response)
                }).catch(error => {
                    console.log('error', error)
                    reject(error)
                })
            })
            console.log('result.data', result.data)
            if (result.data.access_token) {
                const access_token = result.data.access_token
                let profileResult = await new Promise((resolve, reject) => {
                    const profileOptions = {
                        method: 'GET',
                        headers: { 'authorization': 'Bearer ' + access_token },
                        url: 'https://www.googleapis.com/oauth2/v3/userinfo'
                    }
                    axios(profileOptions).then(response => {
                        resolve(response)
                    }).catch(error => {
                        console.log('error', error)
                        reject(error)
                    })
                })
                if (profileResult.data.email) {
                    let user = await dynamodbfordummies.getUser(profileResult.data.email)
                    if (!user) {
                        user = {
                            id: profileResult.data.email,
                            firstName: profileResult.data.given_name,
                            lastName: profileResult.data.family_name,
                            picture: profileResult.data.picture,
                            nickname: profileResult.data.name
                        }
                    } else {
                        if (user.suspended) {
                            let e = new Error()
                            e.message = 'User is suspended.'
                            throw e
                        }
                        if (!user.firstName || user.firstName === '') {
                            user.firstName = profileResult.data.given_name
                        }
                        if (!user.lastName || user.lastName === '') {
                            user.lastName = profileResult.data.family_name
                        }
                        if (!user.picture || user.picture === '') {
                            user.picture = profileResult.data.picture
                        }
                        if (!user.nickname || user.nickname === '') {
                            user.nickname = profileResult.data.nickname
                        }
                    }
                    await dynamodbfordummies.putUser(user);
                    user = await dynamodbfordummies.getUser(user.id);
                    let scope = 'all';
                    if (user.subscription && user.subscription == 'admin') {
                        scope = 'all admin';
                    }
                    let tokenPair = tokenUtility.generateNewPair(user.id, scope);
                    let cookieValue = {
                        jwt: tokenPair.signedJwt,
                        refresh: tokenPair.signedRefresh,
                        user: user,
                        path: '/'
                    };
                    if (process.env.COOKIE_HOME && process.env.COOKIE_HOME != '' && process.env.COOKIE_HOME != '::') {
                        cookieValue.domain = process.env.COOKIE_HOME;
                    }
                    let cookie = 'socialLogin=' + JSON.stringify(cookieValue) + '; path=/'
                    if (process.env.COOKIE_HOME && process.env.COOKIE_HOME != '' && process.env.COOKIE_HOME != '::') {
                        cookie += '; Domain=' + process.env.COOKIE_HOME
                    }
                    const reply = {
                        statusCode: 302,
                        headers: {
                            location: process.env.HOME,
                            'set-cookie': cookie,
                            'Access-Control-Allow-Origin': "*",
                            'Access-Control-Allow-Headers': "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                            'Access-Control-Allow-Methods': "OPTIONS,HEAD,GET,PUT,POST"
                        }
                    }
                    console.log("Google REPLY", reply);
                    reply.body = '{}'
                    return reply
                } else {
                    let e = new Error()
                    e.message = 'Did not receive email from Google.'
                    throw e
                }
            } else {
                let e = new Error()
                e.message = 'Unable to connect to Google.'
                throw e
            }
        }
    } catch (err) {
        console.log("Google lambda error", err)
        let cookie = 'socialLogin=' + JSON.stringify({ error: err.message ? err.message : 'Unknown error' }) + '; path=/'
        if (process.env.COOKIE_HOME && process.env.COOKIE_HOME != '' && process.env.COOKIE_HOME != '::') {
            cookie += '; Domain=' + process.env.COOKIE_HOME
        }
        const reply = {
            statusCode: 302,
            headers: {
                location: process.env.HOME,
                'set-cookie': cookie,
                'Access-Control-Allow-Origin': "*",
                'Access-Control-Allow-Headers': "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
                'Access-Control-Allow-Methods': "OPTIONS,HEAD,GET,PUT,POST"
            }
        }
        console.log("Google REPLY", reply);
        reply.body = '{}'
        return reply
    }
}