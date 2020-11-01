import React from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './pages/Dashboard/Dashboard';
import { BrowserRouter, Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </div>
  );
}

export default App;
