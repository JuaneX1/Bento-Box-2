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
The backend no longer requires a database or any external service credentials — anime data is fetched client-side from the AniList GraphQL API. A .env file is only needed if you want to override `PORT`.

### Contributing & Making Edits
Once you have the files you can begin working on the project. For more details in how to create a branch, commit, etc., please view the [CONTRIBUTION guide](CONTRIBUTION.md).

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

## Deploying

The app deploys to Vercel. `vercel.json` at the repo root tells Vercel to build the frontend (`npm run build --prefix frontend`) and serve `frontend/build` as a static site; `api/index.js` exposes the Express app in `server.js` as a Vercel serverless function for any backend logic added later (there are no API routes today — anime data is fetched client-side from the AniList GraphQL API).

To deploy: import this repo into a Vercel project (Vercel auto-detects `vercel.json`), then push to the connected branch to trigger a build. No environment variables or database are required.
