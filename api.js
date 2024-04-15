require('dotenv').config();

const express = require('express');
const { ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const emailTemplates = require('./emailTemplates');
const jwt = require("jsonwebtoken");
const jwtUtils = require('./createJWT');

const authToken = (req, res, next) => {
	
	const token = req.headers.authorization;
	
	if (!token) {
		return res.sendStatus(401);
	}

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decodedToken) => {
		
		if (error) {
			return res.sendStatus(403);
		}
		req.user = decodedToken.user;
		next();
	});
}

function isComplex (str) {
	return ([
		{bullet: "Must contain at least 8 characters", valid: str.length >= 8 },
		{bullet: "Must contain an uppercase letter", valid: /[A-Z]/.test(str) },
		{bullet: "Must contain a lowercase letter", valid: /[a-z]/.test(str) },
		{bullet: "Must contain a numeric character", valid: /[0-9]/.test(str) },
		{bullet: "Must contain a special character", valid: /[^A-Za-z0-9]/.test(str) },
	]).filter(rule => !rule.valid).map(rule => rule.bullet);
}

exports.setApp = function ( app, client ) {
	
	const db = client.db("AppNameDB");
	const users = db.collection("users");
	const tempusertable = db.collection("unregisteredusers");
	
	const ems = nodemailer.createTransport({
		service: 'Gmail',
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.SERVER_EMAIL,
			pass: process.env.EMAIL_PASSWORD
		}
	});
	
	app.post('/api/forgotPassword', async (req, res,next) => {

		const { email } = req.body;
		
		console.log(email);
		
		try{
			const user = await users.findOne({ email: email});
			
			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}
			
			const token = jwtUtils.createToken( user );
			console.log('jwtUtils.createToken( user ) : ' + token.token); //added now

			const rpem = emailTemplates.resetPassword( user, token.token );
			
			try {
				await ems.sendMail(rpem);
			} catch (e) {
				return res.status(500).json({
					error: 'Failed to send registration email'
				});
			}
			
			return res.status(200).json({
				message: 'Email sent for user',
				user: user
			});

		} catch (e){
			console.error(e);
			res.status(500).json({error: 'Internal server error'});
		}
	});
	
	app.post('/api/resetPassword/:token', async (req, res) => {
		//console.log('Received token: ' + req.params.token); // used for resetPassword debugging

		const tokenData = jwtUtils.getURItoken(req.params.token);

		//console.log('tokenData : ' + JSON.stringify(tokenData)); used for resetPassword debugging

		const { password } = req.body
		
		const user = await users.updateOne({ email: tokenData.user.email }, { $set: { password: password } } );
		
		if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
		
		return res.status(200).json(user);

	});
	
	app.post('/api/register', async (req, res, next) => {

		const newUser = {
			...req.body,
			enteredOn: new Date()
		};
		
		const passComplexity = isComplex(newUser.password);

		try {
			const existingUser = await users.findOne({ $or: [{ email: newUser.email }, { login: newUser.login }] });
			if (existingUser) {
				return res.status(401).json({ error: "Username or email already in use" });
			} else if (passComplexity.length != 0) {
				return res.status(400).json({ error: "Password does not meet complexity requirements", passComplexity });
			}

			await tempusertable.insertOne(newUser);

			const token = jwtUtils.createToken(newUser);
			const rpem = emailTemplates.register(newUser, token.token);
			await ems.sendMail(rpem);

			return res.status(200).json({ message: 'User registration email sent', ...token, newUser });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Failed to connect to database' });
		}
	});
	
	app.post('/api/verify/:token', async (req, res) => {
		const tokenData = jwtUtils.getURItoken(req.params.token);
		
		let user = await tempusertable.findOne({ _id: new ObjectId(tokenData.user._id) } );
		
		if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
		
		await tempusertable.deleteOne({ _id: user._id });
		
		delete user._id;
		await users.insertOne(user);
		return res.status(200).json(user);
	});

	app.post('/api/login', async (req, res, next) => {
		
		const { login, password } = req.body;
		
		await tempusertable.findOne({ $or: [{email: login }, {login: login}], password: password }).then( result => {
			if (result !== null) {
				return res.status(402).json({
					error: "Account has not been verfied. Please check your email to verify your account."
				});
			}
		});

		await users.findOne({ $or: [{email: login }, {login: login}], password: password }).then( result => {
			if (result !== null) {
				const token = jwtUtils.createToken( result );
				return res.status(200).json({
					token: token.token
				});
			} else {
				return res.status(401).json({
					error: "Username/email or password is incorrect"
				});
			}
		}).catch ( error => {
			return res.status(500).json({ error: 'Failed to connect to database' });
		});
	});
	
	app.delete('/api/deleteUser', authToken, async (req, res) => {
		
		const user = req.user;
		
		users.deleteOne({ _id: new ObjectId(user._id) }).then( result => {
			if (result.deletedCount !== 0) {
				return res.status(200).json({ message: "User was successfully deleted" });
			} else {
				return res.status(401).json({ message: "User record not found", result });
			}
		}).catch( error => {
			return res.status(500).json({ error: error });
		});
	});
}
