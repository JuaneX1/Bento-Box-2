const textStr =
	'Register for our app';
const htmlStr =
	'<p>Register for our app</p>';

const regEmailTemplate = (first, last, username, email, serverEmail, token) => {
	return {
		from: serverEmail,
		password: password,
		to: email,
		subject: 'Registration for Bento Box\'d',
		text: textStr,
		html: htmlStr
	};
};

module.exports = {
    regEmailTemplate
};
