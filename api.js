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
	
	app.get('/api/forgotPassword', async (req, res,next) => {

		const { email } = req.body;
		
		try{
			const user = await users.findOne({ email: email});
			
			if (!user) {
				return res.status(404).json({ error: 'User not found' });
			}

			const rpem = emailTemplates.resetPassword( user );
			
			try {
				await ems.sendMail(rpem);
			} catch (e) {
				console.error('Error sending email:', e);
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
	
	app.get('/api/resetPassword', async (req, res) => {
	
		const { email, password } = req.body;
		
		const user = await users.update({ email: email }, { password: password } );
		
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

			const rpem = passEmailConfig.passEmailTemplate( user );
			
			try {
				await ems.sendMail(rpem);
			} catch (e) {
				console.error('Error sending email:', e);
				res.status(500).json({
					error: 'Failed to send registration email'
				});
			}
			
		} catch (e) {
			console.error(e);
			res.status(500).json({
				message: 'Failed to create registration request'
			});
		}
	
	});
	
	app.get('/api/verify/:objId', async (req, res) => {
		const { objId } = req.params;
		
		let user = await tempusertable.findOne({ _id: new ObjectId(objId) } );
		
		if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
		
		await tempusertable.deleteOne({ _id: user._id });
		
		try {
			users = db.collection('users');
			delete user._id;
			users.insertOne(user);
			return res.status(200).json(user);
		} catch (e) {
			console.error(e);
			return res.status(500).json({
				error: 'Could not connect to database or collection'
			});
		}
	});

	app.get('/api/login', async (req, res, next) => {
		
		//this function is completely broken i guess
		const { email, password } = req.body;

		try {

			const user = await users.findOne({ email: email, password: password });

			if (user) {
				// Create a JWT token once the user is found
				const tokenData = jwtUtils.createToken(user.first, user.last, user.email, user._id.toString());

				// Respond with user details and JWT token
				res.status(200).json({
					token: tokenData.accessToken
				});
			} else {
				res.status(401).json({ error: 'Invalid user name/password' });
			}
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: 'Internal server error' });
		}
	});

	
}