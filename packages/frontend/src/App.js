import React, {useState, useEffect} from 'react';
import Table from './Table.js'
import Header from './Header.js'
import AddUsers from './AddUsers'
import LoginSignup from "./LoginSignup";
import ImageUpload from './ImageUpload';
import ImageCapture from './ImageCapture.js'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

function CreateTable() {
    const [buttonLabels, setButtonLabels] = useState(['User 1', 'User 2', 'User 3']);
    const [jsonData, setJsonData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);


    useEffect(() => {
        fetchData()
            .then((res) => res.json())
            .then((json) => setJsonData(json["data"]["line_items"]))
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleInputChange = (newLabel) => {
        const updatedLabels = [...buttonLabels];

        if (currentIndex < updatedLabels.length) {
            updatedLabels[currentIndex] = newLabel;
        } else {
            updatedLabels.push(newLabel);
        }
        setButtonLabels(updatedLabels);
        setCurrentIndex(currentIndex + 1);
    };

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


    const HomePage = () => {
        return (
            <div>
                <Header />
                <AddUsers onInputChange={handleInputChange} />
                <Table jsonData={jsonData} buttonLabels={buttonLabels} />
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
                <Route path="/imageCapture" element={<ICAP />} />
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
    const token = localStorage.getItem('token');
    return fetch("https://quicksplit.azurewebsites.net/receipt", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
}

export default CreateTable;
