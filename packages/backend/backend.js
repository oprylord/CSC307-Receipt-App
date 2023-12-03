import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import {readFile} from 'fs/promises';
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
    try {
        const data = await readFile('main.json', 'utf8');
        const jsonData = JSON.parse(data);
        res.json({ data: jsonData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error reading JSON file' });
    }});

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
            res.json({ message: "Login successful", token });
        } else {
            res.status(401).json({ error: "Incorrect password." });
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal server error" });
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
            fs.writeFileSync('./main.json', JSON.stringify(responseData, null, 2));
            console.log('Response from Veryfi:', response);
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port ${port}`);
});

