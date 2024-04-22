require('dotenv').config();

const serverLink = process.env.FRONTEND_URL;

const register = (user, token) => {
	const textStr = 'Register for our app';
	const htmlStr = '<img src="https://lh3.googleusercontent.com/vzJUu-PxKTbMqlAiVvclZWXKUNlGn7IRm0yuzrGpeuwMAR-WAlpd6MvdQxXfNZ22NzaZQ9NIiTol-u-fnNPl7U6RgPT1sqyaTDHTdJ5Sg66uZJUvP2fARzwC7YW1yX1-=w1280" height="80"><h2>Ready to Unbox the World of Anime?</h2><p>Welcome to Bento Box! You are receiving this email because you recently created an account with us.</p><p>Please verify your account by clicking the link below:</p>';
	const tokenURI = encodeURIComponent(token);
	
	// Update paths depending on location
	// for production: https://bento-box-2-df32a7e90651.herokuapp.com/

	const verifyLink = serverLink + `verify/${tokenURI}`;
    const textContent = `${textStr}\n\n${verifyLink}`;
    const htmlContent = `${htmlStr}<br><a href="${verifyLink}">Click here to verify</a>`;
	
	return {
		to: user.email,
		subject: 'Bento Box! Verify Your Account\'d',
		text: 'xd',
		html: htmlContent
	};
};

const resetPassword = (user, token) => {
	const textStr = 'New password for BentoBox';
	const htmlStr = '<img src="https://lh3.googleusercontent.com/vzJUu-PxKTbMqlAiVvclZWXKUNlGn7IRm0yuzrGpeuwMAR-WAlpd6MvdQxXfNZ22NzaZQ9NIiTol-u-fnNPl7U6RgPT1sqyaTDHTdJ5Sg66uZJUvP2fARzwC7YW1yX1-=w1280" height="80"><h2>Reset Your Password</h2><p>You have requested to reset your password for Bento Box.</p><p>To reset your password, please click the following link:</p>';
	const tokenURI = encodeURIComponent(token);
	
	// Update paths depending on location
	// for production: https://bento-box-2-df32a7e90651.herokuapp.com/

	const resetLink = serverLink + `/resetPassword/${tokenURI}`;
    const textContent = `${textStr}\n\n${resetLink}`;
    const htmlContent = `${htmlStr}<br><a href="${resetLink}">Click here to reset password</a>`;
	
	return {
		to: user.email,
		subject: 'Bento Box! Reset Password',
		text: textContent,
		html: htmlContent
	};
};

module.exports = {
    register,
	resetPassword
};