import express from "express";
import cors from "cors";
import { readFile } from 'fs/promises';

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/receipt", async (req, res) => {
    // Replace 'receipt.json' with the actual path to your JSON file
    try {
        // Read and parse the JSON file using fs/promises
        const data = await readFile('costcoTest.json', 'utf8');
        const jsonData = JSON.parse(data);
        res.json({ data: jsonData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error reading JSON file' });
    }});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});