const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(cors());

require('dotenv').config();
const url = process.env.MONGODB_URI;

const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect(console.log("mongodb connected"));

var api = require('./api.js');
api.setApp( app, client );

// Server static assets if in production
if (process.env.NODE_ENV === 'production')
{
    // Set static folder
        app.use(express.static('frontend/build'));
        app.get('*', (req, res) =>
    {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

/* Moved login/register API to API.js following MERN C document


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

app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.listen(PORT, () =>
{
    console.log('Server listening on port ' + PORT);
});

