import React, {useState, useEffect} from 'react';
import Table from './Table.js'

function CreateTable() {
    const [jsonData, setJsonData] = useState([]);

    useEffect(() => {
        fetch('templateJSON.json') // Replace with the correct URL for your JSON data
            .then((response) => response.json())
            .then((data) => setJsonData(data))
            .catch((error) => console.error('Error fetching data:', error));
        }, []);

    return (
        <div>
            <Table data={jsonData} /> {/* Render the Table component */}
        </div>
    );
}

export default CreateTable();