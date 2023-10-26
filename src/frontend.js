import React, {useState, useEffect} from 'react';
import Table from './Table.js'

function CreateTable() {
    const [jsonData, setJsonData] = useState([]);

    useEffect(() => {
        fetch("./templateJSON.json")
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

export default CreateTable;