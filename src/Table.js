import React from "react";

function TableHeader() {
    return (
        <thead>
        <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
        </tr>
        </thead>
    );
}
function TableBody(props) {
    const rows = props.jsonData.map((row, index) => {
            return (
                <tr key={index}>
                    <td>{row.description}</td>
                    <td>{row.quantity}</td>
                    <td>{row.total}</td>
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
        <table>
            <TableHeader />
            <TableBody jsonData={props.jsonData}/>
        </table>
    );
}

export default Table;