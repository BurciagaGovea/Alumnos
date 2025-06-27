// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';

//Poner token en axios
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID!;
console.log('Google Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);

if (!clientId) {
  console.warn('⚠️ REACT_APP_GOOGLE_CLIENT_ID no está definido en .env');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
