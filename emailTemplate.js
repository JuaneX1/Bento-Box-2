const textStr = 'Register for our app';
const htmlStr = '<p>Register for our app</p>';

const regEmailTemplate = (objId, first, last, username, email, serverEmail, password) => {
	const verifyLink = `http://localhost:3000/verify/${objId}`;
    const textContent = `${textStr}\n\n${verifyLink}`;
    const htmlContent = `${htmlStr}<br><a href="${verifyLink}">Click here to verify</a>`;
	
	return {
		from: serverEmail,
		password: password,
		to: email,
		subject: 'Registration for Bento Box\'d',
		text: textContent,
		html: htmlContent
	};
};

module.exports = {
    regEmailTemplate
};
