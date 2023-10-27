import React, {useState, useEffect} from 'react';
import Table from './Table.js'

function CreateTable() {
    const [jsonData, setJsonData] = useState([]);

    useEffect(() => {
        fetchData()
            .then((res) => res.json())
            .then((json) => setJsonData(json["data"]["line_items"]))
            .catch((error) => { console.log(error); });
    }, [] );

    console.log(jsonData);

    return (
        <div>
            <Table jsonData={jsonData} /> {/* Render the Table component */}
        </div>
    );
}

function fetchData() {
    const promise = fetch("http://localhost:8000/receipt");
    return promise;
}

export default CreateTable;