const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Store files in 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp for unique filename
    }
});

const upload = multer({ storage: storage });

app.use(express.static('uploads')); // Serve images from 'uploads' folder

// Handle file upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const imageUrl = `http://localhost:3000/${req.file.path}`;
    res.status(200).json({ url: imageUrl });
});

// Fetch all uploaded images
app.get('/images', (req, res) => {
    const fs = require('fs');
    const uploadsDir = './uploads';
    const images = fs.readdirSync(uploadsDir).map(file => ({
        url: `http://localhost:3000/uploads/${file}`
    }));
    res.json(images);
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
