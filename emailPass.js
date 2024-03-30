const textStr = 'New password for BentoBox';
const htmlStr = '<p>Request for forgot Password</p>';

const passEmailTemplate = (objId, first, last, username, email, serverEmail, password) => {

	const resetLink = `http://localhost:3000/resetPassword/${objId}`;
    const textContent = `${textStr}\n\n${resetLink}`;
    const htmlContent = `${htmlStr}<br><a href="${resetLink}">Click here to reset password</a>`;
	
	return {
		from: serverEmail,
		password: password,
		to: email,
		subject: 'Reset password request for Bento Box\'d',
		text: textContent,
		html: htmlContent
	};
};

module.exports = {
    passEmailTemplate
};