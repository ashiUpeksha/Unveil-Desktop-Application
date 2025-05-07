const express = require('express');
const router = express.Router();
const pool = require('../db'); // we'll create this db.js file next
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Route to save request
router.post('/requestToRegister', async (req, res) => {
  try {
    const { organizationName, contactNumber, email, address, description, eventTypeID } = req.body;

    const result = await pool.query(
      `INSERT INTO requesttoregister
        (organization_name, contact_number, email, address, description, event_types)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [organizationName, contactNumber, email, address, description, eventTypeID.join(", ")]
    );

    res.status(201).json({ message: "Organization request saved!", data: result.rows[0] });
  } catch (error) {
    console.error('Error saving request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get all event types
router.get('/eventTypes', async (req, res) => {
  try {
    const result = await pool.query('SELECT event_type_name FROM eventtypes WHERE is_active = true');
    const eventTypes = result.rows.map(row => row.event_type_name);
    res.status(200).json(eventTypes);
  } catch (error) {
    console.error('Error fetching event types:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Temporary upload folder (will move files after getting event ID)
    cb(null, 'uploads/temp/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf|mp4/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .jpeg, .jpg, .png, .pdf, and .mp4 files are allowed'));
  }
}).array('media', 10); // Allow up to 10 files

// Modified uploadMedia endpoint
router.post('/uploadMedia', (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded' });
    }

    const fileUrls = req.files.map(file => ({
      originalName: file.originalname,
      path: file.path,
      filename: file.filename
    }));

    res.json({ urls: fileUrls });
  });
});


// Modified addNewEvent endpoint
router.post('/addNewEvent', async (req, res) => {
  try {
    const {
      eventType,
      eventName,
      venue,
      startDateTime,
      endDateTime,
      duration,
      entranceFee,
      contactNumber,
      description,
      specialGuests,
      mediaUrls = []
    } = req.body;

    // First insert the event to get the ID
    const result = await pool.query(
      `INSERT INTO addnewevent (
        event_type, 
        event_name, 
        event_venue, 
        event_start_date, 
        event_start_time, 
        event_end_date, 
        event_end_time, 
        event_duration, 
        entrance_fee, 
        contact_number, 
        description, 
        special_guests
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING event_id`,
      [
        eventType,
        eventName,
        venue,
        new Date(startDateTime).toISOString().split('T')[0],
        new Date(startDateTime).toTimeString().split(' ')[0],
        new Date(endDateTime).toISOString().split('T')[0],
        new Date(endDateTime).toTimeString().split(' ')[0],
        duration,
        entranceFee,
        contactNumber,
        description,
        specialGuests
      ]
    );

    const eventId = result.rows[0].event_id;
    const eventFolder = path.join(__dirname, '../../public/event_Image', eventId.toString());

    // Create event folder if it doesn't exist
    if (!fs.existsSync(eventFolder)) {
      fs.mkdirSync(eventFolder, { recursive: true });
    }

    // Process uploaded files
    const finalMediaUrls = [];
    for (const media of mediaUrls) {
      const oldPath = media.path; // Temporary path from upload
      const newPath = path.join(eventFolder, media.filename);

      // Move file from temp to event folder
      fs.renameSync(oldPath, newPath);

      // Store relative path in database
      finalMediaUrls.push(`/event_Image/${eventId}/${media.filename}`);
    }

    // Update event with final media URLs
    await pool.query(
      'UPDATE addnewevent SET images_and_videos = $1 WHERE event_id = $2',
      [finalMediaUrls.join(', '), eventId]
    );

    res.status(201).json({ 
      success: true,
      message: "Event added successfully!",
      eventId: eventId
    });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
});

module.exports = router;