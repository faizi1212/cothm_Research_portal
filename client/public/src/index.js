import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // This imports your main styles
import App from './App'; // This imports your main App component

// This finds the <div> inside index.html and puts your App inside it
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);