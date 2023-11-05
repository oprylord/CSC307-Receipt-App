import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import { readFile } from 'fs/promises';
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";

const app = express();
const port = 8000;
const saltRounds = 10;

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
        "/?retryWrites=true&w=majority",
        // "mongodb://localhost:27017/users",
        {
            useNewUrlParser: true, //useFindAndModify: false,
            useUnifiedTopology: true,
        }
    )
    .catch((error) => console.log(error));

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
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

app.post("/register", async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const existingUser = await User.findOne({ email }).exec();
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered. Please Login" });
        } else {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const user = new User({ username, password: hashedPassword, email });
            await user.save();
            res.json({ message: 'User registered successfully' });
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email }).exec();

        if (!existingUser) {
            return res.status(401).json({ error: "User not found, please sign up." });
        }

        // Assuming you are using bcrypt for password hashing
        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (passwordMatch) {
            res.json({ message: "Login successful" });
        } else {
            res.status(401).json({ error: "Incorrect password." });
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

