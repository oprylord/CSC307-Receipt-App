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

    const [buttonColors, setButtonColors] = useState(Array(buttonLabels.length).fill('lightblue'));

    const initialStates = buttonLabels.map(() => ({ clicked: false }));
    /*const initialRowStates = props.jsonData.map(() => {
        return buttonLabels.map(() => ({ clicked: false }));
    });*/

    //const [rowButtonStates, setRowButtonStates] = useState(initialRowStates);
    const [buttonStates, setButtonStates] = useState(initialStates);

    const handleButtonClick = (button) => {
        const newButtonStates = [...buttonStates];
        newButtonStates[button].clicked = !newButtonStates[button].clicked;
        setButtonStates(newButtonStates);

        /*const newButtonStates = [...rowButtonStates];
        newButtonStates[row][col].clicked = !newButtonStates[row][col].clicked;
        setRowButtonStates(newButtonStates);

        setRowButtonStates(prevStates => {
            const newButtonStates = [...prevStates];
            newButtonStates[row][col].clicked = !newButtonStates[row][col].clicked;
            return newButtonStates;
        });
        setRowButtonStates(prevStates => {
            const newButtonStates = [...prevStates];
            newButtonStates[row] = [...prevStates[row]]; // Ensure the row is cloned
            newButtonStates[row][col] = {
                ...prevStates[row][col],
                clicked: !prevStates[row][col].clicked
            };
            return newButtonStates;
        });*/
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
                                        backgroundColor: buttonStates[i].clicked ? 'blue' : 'lightblue'
                                    }}
                                    onClick={() => handleButtonClick(i)}
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