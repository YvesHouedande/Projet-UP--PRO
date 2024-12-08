import React from 'react'
import { BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ScrollToTop from './components/ScrollToTop';


ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <BrowserRouter> 
    <ScrollToTop /> {/* gestion de la réinitialisation de l'état de scroll */}
      <App />
    </BrowserRouter>
  // </React.StrictMode>
)
