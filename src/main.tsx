import * as React from 'react';
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <ToastContainer position="bottom-right" />
  </>
);