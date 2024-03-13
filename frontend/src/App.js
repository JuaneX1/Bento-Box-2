import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
function App() {
  return (
    <Router>
    <Switch>
        <Route path="/" index exact>
          <LoginPage />
        </Route>
        <Route path="/cards" index exact>
          <CardPage />
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}
export default App;
