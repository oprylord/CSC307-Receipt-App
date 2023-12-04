import React, {useState} from "react";
import "./CSS Files/Table.css"
import PopUp from "./PopUp";

const Table = (props) => {

    console.log('jsonData:', props.jsonData);
    console.log('buttonLabels:', props.buttonLabels);

    const { buttonLabels } = props;


    const initialStates = props.jsonData.map(() =>
        props.buttonLabels.map(() => ({ clicked: false }))
    );
    console.log("Init" + initialStates);

    const [buttonStates, setButtonStates] = useState(initialStates);

    const handleButtonClick = (row, col) => {
        const newButtonStates = [...buttonStates];
        newButtonStates[row][col].clicked = !newButtonStates[row][col].clicked;
        setButtonStates(newButtonStates);
    };

    const splitCost = () => {
        let costs = buttonLabels.map(() => 0);
        for(let i = 0; i < buttonStates.length; i++){
            let numUsers = 0;
            for(let j = 0; j < buttonStates[i].length; j++){
                if(buttonStates[i][j].clicked) numUsers++;
            }

            console.log("numUsers: ", numUsers);
            if(numUsers > 0) {
                let cost = props.jsonData[i].total / numUsers;
                console.log(props.jsonData[i].total);
                for (let user = 0; user < buttonLabels.length; user++) {
                    if (buttonStates[i][user].clicked) costs[user] += cost;
                }
            }
        }
        let retStr = [];
        for(let i = 0; i < buttonLabels.length; i++){
            retStr.push(buttonLabels[i] + ': ' + '$' + Number(costs[i].toFixed(2)));
        }
        return retStr;
    }

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
                                        backgroundColor: buttonStates[rowIndex][i].clicked ? "#2980b9" : 'lightblue',
                                        transform: buttonStates[rowIndex][i].clicked ? "scale(0.95)" : "scale(1)",
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
        <div className={"container"}>
            <table>
                <thead className={"header"}>
                <tr className={"headerRow"}>
                    <th className={"header1"}>Name</th>
                    <th className={"header2"}>Quantity</th>
                    <th className={"header3"}>Price</th>
                    <th className={"header4"}>Users</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
                <PopUp popupData = {splitCost()}/>
            </table>
        </div>
    );
}

export default Table;