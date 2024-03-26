require('express');
require('mongodb');
const jwtUtils = require('./createJWT');

exports.setApp = function ( app, client )
{
    app.post('/api/register', async (req, res, next) => {
        const { first, last, login, email, password } = req.body;
        const newUser = { first: first, last: last, login: login, email: email, password: password };
    
        try {
            const db = client.db("AppNameDB");
            const collection = db.collection("users");
    
            const result = await collection.insertOne(newUser);
    
            // If the user is successfully created, create a JWT token for them
            const tokenData = jwtUtils.createToken(newUser.first, newUser.last, result.insertedId.toString());
    
            res.status(200).json({
                userID: result.insertedId.toString(),
                token: tokenData.accessToken,
                error: ''
            });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.post('/api/login', async (req, res, next) => {
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
                    /*
                    id: user._id.toString(),
                    firstName: user.first,
                    lastName: user.last,
                    email: user.email,
                    */
                    token: tokenData.accessToken,
                    error: ''
                });
            } else {
                res.status(401).json({ error: 'Invalid user name/password' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    /* non jwt login & register endpoints
    
    app.post('/api/register', async (req, res, next) => {
        const { first, last, login, email, password } = req.body;
        const newUser = { first: first, last: last, login: login, email: email, password: password };
    
        try {
            
            const db = client.db("AppNameDB");
            const collection = db.collection("users");
    
            const result = await collection.insertOne(newUser);
    
            res.status(200).json({ userID: result.insertedId.toString(), error: '' });
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    
    
    app.post('/api/login', async (req, res, next) => {
        const { email, password } = req.body;
    
        try {
            const db = client.db("AppNameDB");
            const collection = db.collection("users");
    
            const user = await collection.findOne({ email: email, password: password });
    
            if (user) {
                res.status(200).json({
                    id: user._id.toString(),
                    firstName: user.first,
                    lastName: user.last,
                    email: user.email,
                    error: ''
                });
            } else {
                res.status(401).json({ error: 'Invalid user name/password' });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    */

    
    
   
    
}