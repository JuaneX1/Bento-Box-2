import React from 'react';
import axios from 'axios';
import './css/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import Verify from './components/loginAndRegister/Verify';
import ResetPassword from './components/loginAndRegister/ResetPassword';

const instance = axios.create({
	baseURL: 'http://localhost:5000/api'
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export { instance };
export default App;
