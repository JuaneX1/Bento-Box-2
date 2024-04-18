import axios from 'axios';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ResetPassword from './components/loginAndRegister/ResetPassword';
import Verify from './components/loginAndRegister/Verify';
import './css/App.css';
import AboutUsPage from './pages/AboutUsPage';
import AnimePage from './pages/AnimePage';
import Dashboard from './pages/DashboardPage';
import FavoritesPage from './pages/FavoritesPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

const instance = axios.create({
	baseURL: process.env.REACT_APP_BACKEND_URL + 'api'
});

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/verify/:token" element={<Verify />} />
		      <Route path="/resetPassword/:token" element={<ResetPassword />} />
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="/anime/:id" element={<AnimePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export { instance };
export default App;