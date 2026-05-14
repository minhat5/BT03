import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './globals.css';
import './App.css';
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/product/homePage.jsx';
import LoginPage from './pages/login.jsx';
import ForgotPasswordPage from './pages/forgotPassword.jsx';
import ProductDetail from './pages/product/productDetail.jsx';
import SearchFilter from './pages/product/searchFilter.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "user", element: <UserPage /> },
            { path: "product/:id", element: <ProductDetail /> },
            { path: "search", element: <SearchFilter /> }
        ]
    },
    { path: "register", element: <RegisterPage /> },
    { path: "login", element: <LoginPage /> },
    { path: "forgot-password", element: <ForgotPasswordPage /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthWrapper>
            <RouterProvider router={router} />
        </AuthWrapper>
    </React.StrictMode>,
);