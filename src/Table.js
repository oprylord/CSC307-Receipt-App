import React from "react";

const tableStyle = {
    width: "80%",
    margin: "0 auto",
    borderCollapse: "collapse",
}

const columnStyle = {
    maxWidth: "200px",
    backgroundColor: "white",
}

const userStyle = {
    backgroundColor: "white",
}
const gap = {
    width: "5%",
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
                    <td style={userStyle}></td>
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
    return (
        <table style={tableStyle}>
            <TableHeader />
            <TableBody jsonData={props.jsonData}/>
        </table>
    );
}

export default Table;