import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import { readFile } from 'fs/promises';
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import fs from 'fs';
import request from 'request-promise';
import archiver from 'archiver';

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

/*app.get("/process", async (req, res) => {
    const listFiles = ['receipt1.jpg'];
    const zipFilePath = 'receipts.zip';

    // Create a writable stream to the ZIP file
    const output = fs.createWriteStream(zipFilePath);

    // Create an archiver object
    const archive = archiver('zip', {
        zlib: { level: 9 }, // Set compression level
    });

    // Pipe the archive to the output stream
    archive.pipe(output);

    // Add files to the ZIP archive
    for (const file of listFiles) {
        archive.file(file, { name: file }); // Add each file to the ZIP archive
    }

    // Finalize the archive
    archive.finalize();

    // Handle the 'close' event when the ZIP archive is ready
    output.on('close', async () => {
        // Your code to handle the ZIP archive when it's ready
        // Configure the request options
        const requestOptions = {
            'method': 'POST',
            'uri': 'https://api.veryfi.com/api/v7/partner/documents',
            'headers': {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'CLIENT-ID': process.env.CLIENT_ID,
                'AUTHORIZATION': 'apikey ' + process.env.USERNAME + ':' + process.env.API_KEY
            },
            'formData': {
                'file': {
                    'value': fs.createReadStream(zipFilePath),
                    'options': {
                        'filename': zipFilePath,
                        'contentType': 'application/zip',
                    },
                },
            },
        };

        try {
            // Send the ZIP file to the Veryfi API
            const response = await request(requestOptions);
            console.log('Response from Veryfi:', response);
        } catch (error) {
            console.error('Error:', error);
        }
    });
});*/

app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port ${port}`);
});

