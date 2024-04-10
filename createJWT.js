const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function ( user ) {
    return _createToken( user );
}

_createToken = function ( user ) {
    try {
        const expiration = new Date();
        const userData = { ...user };
        const token = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
        var ret = { token: token };
    }
    catch (e) {
        var ret = { error: e.message };
    }
    return ret;
}

exports.isExpired = function (token) {
	return _isExpired(token);
}

_isExpired = function (token) {
    var isError = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
        (err, verifiedJwt) => {
            if (err) {
                return true;
            }
            else {
                return false;
            }
        });
    return isError;
}

exports.getURItoken = function (URIcomponent) {
	const token = decodeURIComponent(URIcomponent);
	if (_isExpired(token)){
		return { error: 'Token has expired' };
	}
	return jwt.decode(token);
}

exports.refresh = function (token) {
    var ud = jwt.decode(token, { complete: true });
    return _createToken(ud);
}