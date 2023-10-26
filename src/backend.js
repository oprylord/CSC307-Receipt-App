import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/receipt", (req, res) => {
    // Replace 'receipt.json' with the actual path to your JSON file
    res.sendFile(__dirname + "./templateJSON.json");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});