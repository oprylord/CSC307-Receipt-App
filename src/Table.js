import React from "react";

function TableHeader() {
    return (
        <thead>
            <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Remove</th>
            </tr>
        </thead>
    );
}
function TableBody(props) {
    const rows = props.data.map((item, index) => {
        return (
                <tr key={index}>
                    <td>{item.description}</td>
                    <td>${item.total.toFixed(2)}</td>
                    <td>
                        <button onClick={() =>
                            props.removeItem(index)}>
                            Delete
                        </button>
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
        <table>
            <TableHeader />
            <TableBody data={props.data}
                       removeItem={props.removeItem} />
        </table>
    );
}

export default Table;