const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const requestRoutes = require('./routes/requestRoutes');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Upload media route
app.post('/api/uploadMedia', upload.array('files'), (req, res) => {
  console.log('Files uploaded:', req.files);
  res.json({ message: 'Upload successful', files: req.files });
});

// Routes
app.use('/api', requestRoutes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Unveil API!');
});
