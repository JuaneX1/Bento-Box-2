require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const os = require('os');

const MongoClient = require('mongodb').MongoClient;

const PORT = process.env.PORT || 5000;
const url = process.env.MONGODB_URI;

const app = express();
app.set('port', PORT);
app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(url);
client.connect(console.log("mongodb connected"));

var api = require('./api.js');
api.setApp( app, client );

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static('frontend/build'));
	app.get('*', (req, res) =>
	{
		res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
	});
	// use https://bento-box-2-df32a7e90651.herokuapp.com/ for production
	// use https://bento-box-3-c00801a6c9a4.herokuapp.com/ for testing
    app.listen(PORT, 'https://bento-box-3-c00801a6c9a4.herokuapp.com/', () => {
        console.log('Server listening on port ' + PORT);
    });
} else {
    // For local development
    app.listen(PORT, () => {
        console.log('Server listening on port ' + PORT);
    });
}

cron.schedule('* * * * *', async () => {
	console.log('Running verification clean up');
	await clearOldVerifications();
});

//Set up cron server to handling cleaning up registration requests
async function clearOldVerifications() {
	try {
		const db = client.db("AppNameDB");
		const tempusertable = db.collection("unregisteredusers");

		let dt = new Date();
		dt.setMinutes(dt.getMinutes() - 30);

		const result = await tempusertable.deleteMany({ enteredOn: { $lt: dt } });
		console.log(`${result.deletedCount} document(s) deleted`);
	} catch (error) {
		console.error('Error deleting old verifications:', error);
	}
}

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
