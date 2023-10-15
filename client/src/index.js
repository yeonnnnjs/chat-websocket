import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import Chat from './Chat/Chat';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact id='root' path='/' Component={App} />
        <Route exact path='/chat' Component={Chat} />
      </Routes>
    </Router>
  </React.StrictMode>
);
reportWebVitals();