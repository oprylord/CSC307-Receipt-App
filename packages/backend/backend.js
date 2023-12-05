import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import {readFile} from 'fs/promises';
import fsPromises from 'fs/promises';
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import request from 'request-promise';
import archiver from 'archiver';
import jwt from 'jsonwebtoken';

const app = express();
const port = 8000;
const saltRounds = 10;

app.use(cors());
app.use(express.json());

dotenv.config();

let relativeFilePath;
let userEmail;

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
    files: [
        {
            filename: String,
            contentType: String,
            size: Number,
            uploadDate: Date,
        },
    ],
});

const User = mongoose.model('User', UserSchema);

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    console.error('JWT secret is not defined. Set the JWT_SECRET environment variable.');
    process.exit(1);
}

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

app.get("/receipt", verifyToken, async (req, res) => {
    if (!userEmail) {
        console.log("No email");
        return res.status(500).json({ error: 'User email not available' });
    }

    const filePath = `./JSONuploads/${userEmail}.json`;

    try {
        await fsPromises.access(filePath, fsPromises.constants.F_OK);

        const data = await fsPromises.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        res.json({ data: jsonData });
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log("Please upload an image first");
            res.status(500).json({ error: 'Please upload an image first' });
        } else {
            res.status(500).json({ error: 'Error reading JSON file' });
        }
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // Save files to the 'uploads/' directory
    },
    filename: function (req, file, cb) {
        const uniqueFileName = Date.now() + '-' + file.originalname;
        req.uploadedFileName = uniqueFileName;
        cb(null, uniqueFileName);

        // Store the relative file path when the file is uploaded
        relativeFilePath = path.join('./uploads', req.uploadedFileName);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({error: 'No file provided'});
    }
    const fileDetails = {
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
    };
    res.status(200).json({ message: 'File uploaded successfully', file: fileDetails });
});

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
            userEmail = email;
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
        const passwordMatch = await bcrypt.compare(password, existingUser.password);

        if (passwordMatch) {
            const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            userEmail = email;
            res.json({ message: "Login successful", token });
        } else {
            res.status(401).json({ error: "Incorrect password." });
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
const popupDataSchema = new mongoose.Schema({
    // Define the schema based on the data structure of your popup
    // Example:
    date: { type: Date, required: true },
    content: { type: String, required: true },
    // Add other fields as necessary
});

const PopupData = mongoose.model('PopupData', popupDataSchema);

app.post('/savePopupData', verifyToken, async (req, res) => {
    try {
        const newPopupData = new PopupData(req.body); // Create a new instance of PopupData model with request body data
        await newPopupData.save(); // Save the new instance to the database

        res.status(200).json({ message: 'Popup data saved successfully' });
    } catch (err) {
        console.error('Error saving popup data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/process", verifyToken, async (req, res) => {
    const listFiles = [relativeFilePath];
    const zipFilePath = 'receipts.zip';

    const output = fs.createWriteStream(zipFilePath);

    const archive = archiver('zip', {
        zlib: { level: 9 },
    });

    archive.pipe(output);

    for (const file of listFiles) {
        archive.file(file, { name: file });
    }

    archive.finalize();
    output.on('close', async () => {

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
            const response = await request(requestOptions);
            const responseData = typeof response === 'string' ? JSON.parse(response) : response;
            fs.writeFileSync(`./JSONuploads/${userEmail}.json`, JSON.stringify(responseData, null, 2));
            res.status(200).json({ message: 'File processed successfully' });
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

app.get('/getPopupData', verifyToken, async (req, res) => {
    try {
        const popupData = await PopupData.find({}); // Fetch all documents from PopupData collection
        res.json(popupData);
    } catch (err) {
        console.error('Error fetching popup data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port ${port}`);
});

