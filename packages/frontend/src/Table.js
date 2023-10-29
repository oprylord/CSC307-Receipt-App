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
    const { buttonLabels } = props;
    const rows = props.jsonData.map((row, index) => {
            return (
                <tr key={index}>
                    <td style={columnStyle}>{row.description}</td>
                    <td style={columnStyle}>{row.quantity}</td>
                    <td style={columnStyle}>{row.total}</td>
                    <td></td>
                    <td style={userStyle}>
                        <div style={ {display: "inline-table"} }>
                            {buttonLabels.map((label, i) => (
                                <button
                                    key={i}
                                    style={{ cursor: "pointer", marginTop: "10px", marginLeft: "10px" }}
                                >
                                    {label}
                                </button>
                            ))}
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

    return (
        <div>
            <table style={tableStyle}>
                <TableHeader />
                <TableBody jsonData={props.jsonData} buttonLabels={props.buttonLabels}/>
            </table>
        </div>
    );
}
export default Table;