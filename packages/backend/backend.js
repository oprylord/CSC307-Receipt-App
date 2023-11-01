import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import { MongoClient, ServerApiVersion } from 'mongodb';
import bcrypt from 'bcrypt';
import { readFile } from 'fs/promises';

const username = encodeURIComponent("gavinlynch04");
const password = encodeURIComponent("HLkQPQ8sHAzRhbog");
const uri = "mongodb+srv://${username}:${password}@receipt.xjnd3x0.mongodb.net/?retryWrites=true&w=majority";

const app = express();
const port = 8000;

/*mongoose.connect('mongodb://localhost:27017/receiptDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});*/

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        const database = client.db("admin");
        const ratings = database.collection("");
        const cursor = ratings.find();
        await cursor.forEach(doc => console.dir(doc));
    } finally {
        await client.close();
    }
}
run().catch(console.dir);

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

const User = mongoose.model('User', UserSchema);

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