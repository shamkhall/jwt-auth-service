const jwt = require('jsonwebtoken')

const isAuthorized = (call, callback) => {

    const accessToken = call.request.accessToken;

    try {
        const user = jwt.verify(accessToken, 'access token secret')
        callback (null, {status: 200, user: {userId: user.userId, username: user.username}});
    }
    catch (error) {
        callback (null, {status: 401, message: 'Unauthorized'})
    }
    
}

module.exports.isAuthorized = isAuthorized;