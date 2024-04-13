const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createToken = function ( user ) {
    return _createToken( user );
}

_createToken = function ( user ) {
    try {
        const expiration = new Date();
        const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
        var ret = { token };
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
	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		return false;
	} catch (error) {
		return true;
	}
}

exports.getURItoken = function (URIcomponent) {
	const token = decodeURIComponent(URIcomponent);
	//console.log('getURItoken (createJWT): ' + token.token); used for resetPassword debugging
	if (_isExpired(token)){
		return { error: 'Token has expired' };
	}
	//console.log('jwt.decode (createJWT): ' + jwt.decode(token)); used for resetPassword debugging
	return jwt.decode(token);
}

exports.refresh = function (token) {
    var ud = jwt.decode(token);
    return _createToken(ud);
}

exports.expireToken = function (token) {
	this.invalidateToken(token);
}
