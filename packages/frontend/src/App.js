import React, {useState} from 'react';
import Header from './Header.js'
import LoginSignup from "./LoginSignup";
import ImageUpload from './ImageUpload';
import HomePage from './HomePage';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

function CreateTable() {
    const [loading, setLoading] = useState(false);


    const Upload = () => {
        return (
            <div>
                <Header />
                <ImageUpload loading={loading} setLoading={setLoading} />
            </div>
        );
    };

    const PrivateRoute = ({ element }) => {
        const token = localStorage.getItem('token');

        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 > Date.now()) {
                return element;
            }
        }

        // Redirect to the login page if either token or email is missing
        return <Navigate to="/" />;
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/imageUpload"
                    element={<PrivateRoute element={<Upload />} />}
                />
                <Route path="/history" />
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
