import React, {useState} from "react";
import "./CSS Files/Table.css"


function TableHeader() {
    return (
        <thead className={"header"}>
        <tr className={"headerRow"}>
            <th className={"header1"}>Name</th>
            <th className={"header2"}>Quantity</th>
            <th className={"header3"}>Price</th>
            <th className={"header4"}>Users</th>
        </tr>
        </thead>
    );
}

function TableBody(props) {
    const { buttonLabels } = props;

    const initialStates = props.jsonData.map(() =>
        buttonLabels.map(() => ({ clicked: false }))
    );

    const [buttonStates, setButtonStates] = useState(initialStates);

    const handleButtonClick = (row, col) => {
        const newButtonStates = [...buttonStates];
        newButtonStates[row][col].clicked = !newButtonStates[row][col].clicked;
        setButtonStates(newButtonStates);
    };

    const rows = props.jsonData.map((row, rowIndex) => {
            return (
                <tr key={rowIndex} className={"contentRows"}>

                    <td className={"col1"}>{row.description}</td>
                    <td className={"col2"}>{row.quantity}</td>
                    <td className={"col3"}>{row.total}</td>
                    <td className={"col4"}>
                        <div style={ {display: "inline-table"} }>
                            {buttonLabels.map((label, i) => (
                                <button
                                    key={i}
                                    className={"tableButton"}
                                    style={{
                                        backgroundColor: buttonStates[rowIndex][i].clicked ? 'blue' : 'lightblue'
                                    }}
                                    onClick={() => handleButtonClick(rowIndex, i)}
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

function clicked(button) {
    button.style.backgroundColor = 'navy';
}


function Table(props) {

    return (
        <div className={"container"}>
            <table>
                <TableHeader />
                <TableBody jsonData={props.jsonData} buttonLabels={props.buttonLabels}/>
            </table>
        </div>
    );
}
export default Table;