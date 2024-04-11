require('dotenv').config();

const serverLink = process.env.FRONTEND_URL;

const register = (user, token) => {
	const textStr = 'Register for our app';
	const htmlStr = '<p>Register for our app</p>';
	const tokenURI = encodeURIComponent(token);
	
	// Update paths depending on location
	// for test env on heroku: https://bento-box-3-c00801a6c9a4.herokuapp.com/
	// for production: https://bento-box-2-df32a7e90651.herokuapp.com/

	const verifyLink = serverLink + `verify/${tokenURI}`;
    const textContent = `${textStr}\n\n${verifyLink}`;
    const htmlContent = `${htmlStr}<br><a href="${verifyLink}">Click here to verify</a>`;
	
	return {
		to: user.email,
		subject: 'Registration for Bento Box\'d',
		text: textContent,
		html: htmlContent
	};
};

const resetPassword = (user, token) => {
	const textStr = 'New password for BentoBox';
	const htmlStr = '<p>Request for forgot Password</p>';
	const tokenURI = encodeURIComponent(token);
	
	// Update paths depending on location
	// for test env on heroku: https://bento-box-3-c00801a6c9a4.herokuapp.com/
	// for production: https://bento-box-2-df32a7e90651.herokuapp.com/

	const resetLink = serverLink + `/resetPassword/${tokenURI}`;
    const textContent = `${textStr}\n\n${resetLink}`;
    const htmlContent = `${htmlStr}<br><a href="${resetLink}">Click here to reset password</a>`;
	
	return {
		to: user.email,
		subject: 'Reset password request for Bento Box\'d',
		text: textContent,
		html: htmlContent
	};
};

module.exports = {
    register,
	resetPassword
};
