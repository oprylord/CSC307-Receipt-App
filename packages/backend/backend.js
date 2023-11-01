import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import { readFile } from 'fs/promises';
import dotenv from "dotenv";

const username = encodeURIComponent("gavinlynch04");
const password = encodeURIComponent("HLkQPQ8sHAzRhbog");
const uri = "mongodb+srv://${username}:${password}@receipt.xjnd3x0.mongodb.net/?retryWrites=true&w=majority";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

dotenv.config();

// Uncomment the following to debug mongoose queries, etc.
mongoose.set("debug", true);
console.log(">>mongo cluster: " + process.env.MONGO_CLUSTER);
mongoose
    .connect(
        "mongodb+srv://" +
        process.env.MONGO_USER +
        ":" +
        process.env.MONGO_PWD +
        "@" +
        process.env.MONGO_CLUSTER +
        "/" +
        process.env.MONGO_DB +
        "?retryWrites=true&w=majority",
        // "mongodb://localhost:27017/users",
        {
            useNewUrlParser: true, //useFindAndModify: false,
            useUnifiedTopology: true,
        }
    )
    .catch((error) => console.log(error));

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