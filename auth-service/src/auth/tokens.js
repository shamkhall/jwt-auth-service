const jwt = require('jsonwebtoken');


class Tokens {
    constructor () {

    }

    createAccessToken (payloads) {
        return jwt.sign(payloads, 'access token secret', {
            expiresIn: '1m',
        });
    }
    
    createRefreshToken (payloads) {
        return jwt.sign(payloads, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '7d'
        });
    }
    
    verify (refreshToken, secretToken) {
        return jwt.verify(refreshToken, secretToken);
    }
}

module.exports.Tokens = Tokens;
