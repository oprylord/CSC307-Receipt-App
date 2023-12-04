import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Header from './Header';
import AddUsers from './AddUsers';
import Table from './Table';

const HomePage = () => {
    const [jsonData, setJsonData] = useState([]);
    const [buttonLabels, setButtonLabels] = useState(['User 1', 'User 2', 'User 3']);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchDataAndUpdateState = () => {
        fetchData()
            .then((json) => setJsonData(json["data"]["line_items"]))
            .catch((error) => {
                console.error(error);
                setError(error.message);
            });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) {
            // Redirect to login if either token or email is missing
            return <Navigate to="/" />;
        }

        fetchDataAndUpdateState();
    }, []); // Empty dependency array ensures this effect runs only once on component mount

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

    const refreshData = () => {
        fetchDataAndUpdateState();
    };

    return (
        <div>
            <Header />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    {error ? (
                        <div style={{ color: 'red', margin: 'auto', maxWidth: '400px', marginTop: '10px' }}>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div>
                            <AddUsers onInputChange={handleInputChange} />
                            <button onClick={refreshData}>Refresh Data</button>
                            <Table jsonData={jsonData} buttonLabels={buttonLabels} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

async function fetchData() {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:8000/receipt', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${errorText}`);
    }

    return response.json();
}

export default HomePage;
