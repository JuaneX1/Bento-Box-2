require('dotenv').config();

const express = require('express');
const { ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const emailTemplates = require('./emailTemplates');
const jwtUtils = require('./createJWT');

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

			const rpem = emailTemplates.resetPassword( user, token.token );
			
			try {
				await ems.sendMail(rpem);
			} catch (e) {
				res.status(500).json({
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
		const tokenData = jwtUtils.getURItoken(req.params.token);
		const { password } = req.body
		
		const user = await users.updateOne({ email: tokenData.email }, { $set: { password: password } } );
		
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
		
		try {
			const result = await tempusertable.insertOne(newUser);
			
			const token = jwtUtils.createToken(newUser);
			
			const rpem = emailTemplates.register( newUser, token.token );
			
			try {
				await ems.sendMail(rpem);
			} catch (e) {
				console.error('Error sending email:', e);
				res.status(500).json({
					error: 'Failed to send registration email'
				});
			}
			return res.status(200).json({ message: 'User registration email sent', newUser });
		} catch (e) {
			console.error(e);
			res.status(500).json({
				message: 'Failed to create registration request'
			});
		}
	});
	
	app.get('/api/verify/:token', async (req, res) => {
		const tokenData = jwtUtils.getURItoken(req.params.token);
		
		let user = await tempusertable.findOne({ _id: new ObjectId(tokenData._id) } );
		
		if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
		
		await tempusertable.deleteOne({ _id: user._id });
		
		delete user._id;
		await users.insertOne(user);
		return res.status(200).json(user);
	});

	app.post('/api/login', async (req, res, next) => {
		
		const { email, password } = req.body;

		try {

			const user = await users.findOne({ email: email, password: password });

			if (user) {
				const token = jwtUtils.createToken( user );

				return res.status(200).json({
					token: token.token
				});
			} else {
				return res.status(401).json({ error: 'Invalid user name/password' });
			}
		} catch (err) {
			console.error(err);
			return res.status(500).json({ error: 'Internal server error' });
		}
	});

	
}