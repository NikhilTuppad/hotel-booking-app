import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'


import axios from "axios";

// Use environment variable if available (e.g. for local dev), otherwise default to Render production URL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "https://hotel-booking-backend-tbfn.onrender.com/api";
axios.defaults.withCredentials = true;



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
