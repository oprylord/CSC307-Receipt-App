import React, {useState, useEffect} from 'react';
import Table from './Table.js'
import Header from './Header.js'
import AddUsers from './AddUsers'

let i = 0;

function CreateTable() {
    const [buttonLabels, setButtonLabels] = useState(['User 1', 'User 2', 'User 3']);
    const [jsonData, setJsonData] = useState([]);

    const handleInputChange = (newLabel) => {
        const newButtonLabels = [...buttonLabels];
        newButtonLabels[i++] = newLabel;
        setButtonLabels(newButtonLabels);
    };

    useEffect(() => {
        fetchData()
            .then((res) => res.json())
            .then((json) => setJsonData(json["data"]["line_items"]))
            .catch((error) => { console.log(error); });
    }, [] );

    return (
        <div>
            <Header/>
            <AddUsers onInputChange={handleInputChange}/>
            <Table jsonData={jsonData} buttonLabels={buttonLabels}/>
        </div>
    );
}

function fetchData() {
    const promise = fetch("http://localhost:8000/receipt");
    return promise;
}

export default CreateTable;