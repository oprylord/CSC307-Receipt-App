import React, { useState, useEffect } from 'react';
import './CSS Files/History.css'; // Ensure the CSS file path is correct

const History = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [receipts, setReceipts] = useState([]); // Initialize receipts as an empty array
    useEffect(() => {
        async function fetchPopupData() {
            const token = localStorage.getItem('token'); // Or use context if you have a context-based auth system
            
            try {
                const response = await fetch('http://localhost:8000/getPopupData', {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Include the JWT token if required
                    },
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setReceipts(data); // Assuming you have a state variable named 'receipts'
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        }
        fetchPopupData();
    }, []);
    

    if (loading) {
        return <div>Loading history...</div>;
    }

    if (error) {
        return <div>Error fetching history: {error}</div>;
    }

    return (
        <div className="history-container">
            <h1>History</h1>
            {data.length > 0 ? (
                data.map((item, index) => (
                    <div key={index} className="history-item">
                        {/* Render your data here */}
                        <p>Date: {item.date}</p>
                        <p>Content: {item.content}</p>
                        {/* Add more fields as needed */}
                    </div>
                ))
            ) : (
                <div>No history data available.</div>
            )}
        </div>
    );
};

export default History;




