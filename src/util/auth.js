const jwt = require('jsonwebtoken');
const constValue = {
    SecretKey: 'verysecretKey',
    AuthKey: 'auth',
    UserInfo: 'userInfo'
};
module.exports = {
    ...constValue,
    CheckAuth: (req, res) => {
        var token = req.cookies[constValue.AuthKey];
        // decode token
        if (token) {
            jwt.verify(token, constValue.SecretKey, function (err, token_data) {
                if (err) {
                    res.redirect('/login');
                    return false;
                } else {
                    req.user_data = token_data;
                }
            });

        } else {
            res.redirect('/login');
            return false;
        }
        return true;
    },
    GetUserInfo: (req) => {
        if (!req.cookies[constValue.UserInfo]) return null;
        return req.cookies[constValue.UserInfo]._doc;
    }
}