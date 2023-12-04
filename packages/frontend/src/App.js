import React, {useState, useEffect} from 'react';
import Table from './Table.js'
import Header from './Header.js'
import AddUsers from './AddUsers'
import LoginSignup from "./LoginSignup";
import ImageUpload from './ImageUpload';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

function CreateTable() {
    const [buttonLabels, setButtonLabels] = useState(['User 1', 'User 2', 'User 3']);
    const [jsonData, setJsonData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);

    const fetchDataAndUpdateState = () => {
        fetchData()
            .then((res) => {
                if (!res.ok) {
                    // Handle error status and extract the error message from JSON
                    return res.json().then((json) => {
                        handleServerError(json.error);
                    });
                }
                return res.json();
            })
            .then((json) => setJsonData(json["data"]["line_items"]))
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchDataAndUpdateState();
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

    const handleServerError = (error) => {
        console.log(error);
        if (error === 'Please upload an image first') {
            setErrorMessage('You have not uploaded an image. Please upload an image.');
        } else if (error === 'User email not available') {
            setErrorMessage('User email is not available. Please log in again.');
        } else {
            setErrorMessage('Error fetching data. Please try again.');
        }
    };

    const Upload = () => {
        return (
            <div>
                <Header error={errorMessage}/>
                <ImageUpload />
            </div>
        );
    };

    const HomePage = () => {
        return (
            <div>
                <Header error={errorMessage}/>
                {errorMessage ? (
                    <div style={{ color: 'red', margin: 'auto', maxWidth: '400px', marginTop: '10px' }}>
                        <p>{errorMessage}</p>
                    </div>
                ) : (
                    <div>
                        <AddUsers onInputChange={handleInputChange} />
                        <Table jsonData={jsonData} buttonLabels={buttonLabels} />
                    </div>
                )}
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
    const token = localStorage.getItem('token');
    return fetch("http://localhost:8000/receipt", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
}

export default CreateTable;