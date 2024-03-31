const register = (user, token) => {
	const textStr = 'Register for our app';
	const htmlStr = '<p>Register for our app</p>';
	const tokenURI = encodeURIComponent(token);
	
	const verifyLink = `http://localhost:3000/verify/${tokenURI}`;
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
	
	const resetLink = `http://localhost:3000/resetPassword/${tokenURI}`;
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
