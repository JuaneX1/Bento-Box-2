import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AnimePage from './pages/AnimePage';
import Dashboard from './pages/DashboardPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/anime/:id" element={<AnimePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;