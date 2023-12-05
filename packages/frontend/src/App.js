import React from 'react';
import Header from './Header.js'
import HomePage from './HomePage'
import LoginSignup from "./LoginSignup";
import ImageUpload from './ImageUpload';
import ImageCapture from './ImageCapture';
import History from './History.js';
import {BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function CreateTable() {

    const Upload = () => {
        return (
            <div>
                <Header />
                <ImageUpload />
            </div>
        );
    };

    const ICAP = () => {
        return (
            <div>
                <Header/>
                <ImageCapture />
            </div>
        )
    }

    const HistoryPage = () => {
        return (
            <div>
                <Header/>
                <History />
            </div>
        )
    }

    const PrivateRoute = ({ element }) => {
        const token = localStorage.getItem('token');
        return token ? element : <Navigate to="/" />;
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/imageUpload"
                    element={<PrivateRoute element={<Upload />} />}
                />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/imageCapture" element={<PrivateRoute element={<ICAP />}/>} />
                <Route path="/" element={<LoginSignup />} />
                <Route
                    path="/home"
                    element={<PrivateRoute element={<HomePage />} />}
                />
            </Routes>
        </Router>
    );
}

export default CreateTable;