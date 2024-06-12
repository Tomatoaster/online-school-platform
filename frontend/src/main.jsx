import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import axios from 'axios';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Header from './Header.jsx';
import Login from './Login.jsx';
import './index.css';
import './form.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

const api = axios.create({
  baseURL: `http://localhost:8080/`,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Header />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);

export default api;
