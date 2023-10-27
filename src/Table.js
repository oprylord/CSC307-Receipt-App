import React, {useState} from "react";

const tableStyle = {
    width: "80%",
    margin: "0 auto",
    borderCollapse: "collapse",
}

const columnStyle = {
    width: "20%",
    backgroundColor: "white",
}

const userStyle = {
    backgroundColor: "white",
}
const gap = {
    width: "5%",
}

function AddUserSection(props) {
    const [newUser, setNewUser] = useState("");

    const handleUserChange = (e) => {
        setNewUser(e.target.value);
    };

    const handleAddUser = () => {
        if (newUser) {
            props.addUser(newUser);
            setNewUser("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleAddUser();
        }
    };

    return (
        <div style={{ display: "flex",
            alignItems: "center",
            justifyContent: "center", }}>
            <label style={{ marginRight: "10px", marginTop: "10px"}}>Add Users:</label>
            <input style={{width: "70%", marginTop: "10px"}}
                type="text"
                value={newUser}
                onChange={handleUserChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter user name"
            />
            <button style={{ cursor: "pointer", marginTop: "10px", marginLeft: "20px"}} onClick={handleAddUser}>
                Add
            </button>
        </div>
    );
}


function TableHeader() {
    return (
        <thead>
        <tr>
            <th style={columnStyle}>Name</th>
            <th style={columnStyle}>Quantity</th>
            <th style={columnStyle}>Price</th>
            <th style={gap}></th>
            <th style={userStyle}>Users</th>
        </tr>
        </thead>
    );
}
function TableBody(props) {
    const rows = props.jsonData.map((row, index) => {
            return (
                <tr key={index}>
                    <td style={columnStyle}>{row.description}</td>
                    <td style={columnStyle}>{row.quantity}</td>
                    <td style={columnStyle}>{row.total}</td>
                    <td></td>
                    <td style={userStyle}>
                        <div style={ {display: "inline-table"} }>
                            <button style={{ cursor: "pointer", marginTop: "10px", marginLeft: "10px"}} >User 1</button>
                            <button style={{ cursor: "pointer", marginTop: "10px", marginLeft: "10px"}} >User 2</button>
                            <button style={{ cursor: "pointer", marginTop: "10px", marginLeft: "10px"}} >User 3</button>
                            <button style={{ cursor: "pointer", marginTop: "10px", marginLeft: "10px"}} >User 4</button>
                        </div>
                        </td>
                </tr>
            );
        }
    );
    return (
        <tbody>
        {rows}
        </tbody>
    );
}


function Table(props) {
    const addUserToTable = (newUser) => {
        // Implement the logic to add the new user to your table's data
        // You can use this function to update the table's data state.
    };

    return (
        <div>
            <AddUserSection addUser={addUserToTable} />
            <table style={tableStyle}>
                <TableHeader />
                <TableBody jsonData={props.jsonData}/>
            </table>
        </div>
    );
}

export default Table;