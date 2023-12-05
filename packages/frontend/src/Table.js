import React, {useState} from "react";
import "./CSS Files/Table.css"
import PopUp from "./PopUp";
import "./CSS Files/TopButtons.css";

const Table = (props) => {

    const { buttonLabels } = props;

    const initialStates = props.jsonData.map(() =>
        buttonLabels.map(() => ({ clicked: false }))
    );

    const [buttonStates, setButtonStates] = useState(initialStates);

    const handleButtonClick = (row, col) => {
        // When a button is clicked this updates the clicked attribute in the 2d array
        const newButtonStates = [...buttonStates];
        newButtonStates[row][col].clicked = !newButtonStates[row][col].clicked;
        setButtonStates(newButtonStates);
    };

    const splitCost = () => {
        // This method handles the logic of splitting up the receipt
        let costs = buttonLabels.map(() => 0);

        // Iterates through each item purchased
        for(let i = 0; i < buttonStates.length; i++){
            // Counting the number of users who purchased this item
            let numUsers = 0;
            for(let j = 0; j < buttonStates[i].length; j++){
                if(buttonStates[i][j].clicked) numUsers++;
            }

            // Adding the cost of the item to each user's running total
            if(numUsers > 0) {
                let cost = props.jsonData[i].total / numUsers;
                for (let user = 0; user < buttonLabels.length; user++) {
                    if (buttonStates[i][user].clicked) costs[user] += cost;
                }
            }
        }

        // Creating and returning a string of the final results
        let retStr = "";
        for(let i = 0; i < buttonLabels.length; i++){
            retStr += buttonLabels[i] + ": " + costs[i] + "\n";
        }
        return retStr;
    }

    const splitEvenly = () => {
        // When a button is clicked this updates the clicked attribute in the 2d array
        const newButtonStates = props.jsonData.map(() =>
            buttonLabels.map(() => ({ clicked: true }))
        );
        setButtonStates(newButtonStates);
    };

    const clear = () => {
        // When a button is clicked this updates the clicked attribute in the 2d array
        const newButtonStates = props.jsonData.map(() =>
            buttonLabels.map(() => ({ clicked: false }))
        );
        setButtonStates(newButtonStates);
    };

    // Table body
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
                                        // Toggle the button color based on whether it has been clicked
                                        backgroundColor: buttonStates[rowIndex][i].clicked ? "#2980b9" : 'lightblue',
                                        transform: buttonStates[rowIndex][i].clicked ? "scale(0.95)" : "scale(1)",
                                    }}
                                    // When a button is clicked, toggle it's state by calling the handler
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

    const TopButtons = () => {
        return(
            <div className="button-container">
                <button onClick={splitEvenly} className="split-even">
                    Split all items evenly
                </button>
                <button onClick={clear} className="clear-button">
                    Clear all selections
                </button>
            </div>
        )
    }

    return (
        // Table headers and popup which calls splitCost each time a button state is updated
        // popup is only displayed when clicked on
        <div className={"container"}>
            <table>

                <TopButtons />
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
