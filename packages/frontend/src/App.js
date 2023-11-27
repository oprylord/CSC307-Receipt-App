import React, {useState, useEffect} from 'react';
import Table from './Table.js'
import Header from './Header.js'
import AddUsers from './AddUsers'
import LoginSignup from "./LoginSignup";
import PopUp from './PopUp.js';
import ImageUpload from './ImageUpload';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

let i = 0;

function CreateTable() {
    const [buttonLabels, setButtonLabels] = useState(['User 1', 'User 2', 'User 3']);
    const [jsonData, setJsonData] = useState([]);

    useEffect(() => {
        fetchData()
            .then((res) => res.json())
            .then((json) => setJsonData(json["data"]["line_items"]))
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleInputChange = (newLabel) => {
        const newButtonLabels = [...buttonLabels];
        setButtonLabels(newButtonLabels);
    };

    const Upload = () => {
        return (
            <div>
                <Header />
                <ImageUpload />
            </div>
        );
    };
    const HomePage = () => {
        return (
            <div>
                <Header />
                <AddUsers onInputChange={handleInputChange} />
                <Table jsonData={jsonData} buttonLabels={buttonLabels} />
                <PopUp />
            </div>
        );
    };

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

function fetchData() {
    return fetch("http://localhost:8000/receipt");
}

export default CreateTable;
