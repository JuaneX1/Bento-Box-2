# BentoBox - An Anime Recommendation & Tracking Site

BentoBox is a react application that has both a backend server and frontend. It is setup to be deployed on a heroku instance.

## Running Locally

### Obtaining Files
To run BentoBox locally, simply download the repo via the following command:

```bash
gh repo clone JuaneX1/Bento-Box-2
```

You will need gh installed and to be logged in.

### Add .env file
You will also need to add a .env file. Create one using any method, just ensure its in the root directory (same folder as server.js etc.).

Then you will need to add the MONGODB_URI="{whatever_database_connection_string_is}"

This is provided in Discord.

**DO NOT** PUSH THE .env file to Github. It should be already ignored in .gitignore, but that contains secrets you should not push, etc.

### Contributing & Making Edits
Once you have the files you can begin working on the project. For more details in how to create a branch, commit, etc., please view the CONTRIBUTION guide.

If you have the application already running and making changes it is recommended to kill both server and 

Or you can use the package nodemon to automate that process as you make a change.

### Running the Application

To run the application, first make sure you are in the root of the project.
Then run:
```bash
npm install # installs any packages needed
npm start # starts server
```

This starts the backend server on port 5000 and allows the app to interact via the api.

Now, navigate to the frontend folder via:
```bash
cd frontend/
```

Run the same two commands as before to start the frontend app.
```bash
npm install # installs any packages needed
npm start # starts server
```

Sometimes you may get auto directed to the application once it starts, as it opens in your browser, but if that does not happen you can view the application live at "localhost:3000" (just type that without quotes into browser to view).

## Running on Heroku

If you for some reason need to test deployment on Heroku, we have a testing application which deploys the testing branch.

Go to Heroku, go to app bento-box-3, click settings and verify the MONGODB_URI matches the one in your .env file. 

NOTE: You will need to switch the app name in the various areas where this is applicable. For example, in the signUpForm.js. All the areas that you need to do this are marked.

There are comments with both app names to not have to worry about it. Essentially, just uncomment and re-comment as applicable depending on where you are deploying.

Bento-Box-2 is for Production and should be changed before merging with main branch.
Bento-Box-3 is for Testing.

Then you will go to deploy, scroll to the bottom and click deploy from branch. Deploy from the branch you created, and 
