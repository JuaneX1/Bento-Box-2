require('dotenv').config();

const express = require('express');
const { ObjectId } = require('mongodb');
const nodemailer = require('nodemailer');
const emailConfig = require('./emailTemplate');
const jwtUtils = require('./createJWT');

exports.setApp = function ( app, client ) {
	
	app.post('/api/register', async (req, res, next) => {
		const { first, last, login, email, password } = req.body;
		const newUser = { first: first, last: last, login: login, email: email, password: password };
		newUser.enteredOn = new Date();
		let db, tempusertable;
		try {
			db = client.db("AppNameDB");
			tempusertable = db.collection("unregisteredusers");
		} catch (e) {
			console.error(e);
			res.status(500).json({
				error: 'Could not connect to database or collection'
			});
		}
		
		let result
		try {
			result = await tempusertable.insertOne(newUser);
			res.status(200).json(result);
		} catch (e) {
			console.error(e);
			res.status(500).json({
				error: 'Could not insert record into collection'
			});
		}
		
		let ems;
		
		try {
			ems = nodemailer.createTransport({
				service: 'Gmail',
				host: 'smtp.gmail.com',
				port: 465,
				secure: true,
				auth: {
					user: process.env.SERVER_EMAIL,
					pass: process.env.EMAIL_PASSWORD
				}
			});
		} catch (e) {
			console.error(e);
			return res.status(500).json({
				error: 'Error with the ems'
			});
		}
		
		const emc = emailConfig.regEmailTemplate(result.insertedId, first, last, login, email,
			process.env.SERVER_EMAIL, process.env.EMAIL_PASSWORD);
		
		try {
			await ems.sendMail(emc);
		} catch (e) {
			console.error('Error sending email:', e);
			res.status(500).json({
				error: 'Failed to send registration email'
			});
		}
	});
	
	app.get('/api/verify/:objId', async (req, res) => {
		const { objId } = req.params;
		
		try {
			db = client.db("AppNameDB");
			tempusertable = db.collection("unregisteredusers");
		} catch (e) {
			console.error(e);
			res.status(500).json({
				error: 'Could not connect to database or collection'
			});
		}
		
		let user = await tempusertable.findOne({ _id: new ObjectId(objId) } );
		await tempusertable.deleteOne({ _id: user._id });
		
		try {
			users = db.collection('users');
		} catch (e) {
			console.error(e);
			res.status(500).json({
				error: 'Could not connect to database or collection'
			});
		}
		
		delete user._id;
		users.insertOne(user);
		
		return res.status(200).json(user);
	});

	app.get('/api/login', async (req, res, next) => {
		const { email, password } = req.body;

		try {
			const db = client.db("AppNameDB");
			const collection = db.collection("users");

			const user = await collection.findOne({ email: email, password: password });

			if (user) {
				// Create a JWT token once the user is found
				const tokenData = jwtUtils.createToken(user.first, user.last, user._id.toString());

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