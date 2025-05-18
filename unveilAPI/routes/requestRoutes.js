const express = require('express');
const router = express.Router();
const pool = require('../db'); // we'll create this db.js file next
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config(); 
const authenticateToken = require('../middleware/auth'); // Import middleware


// Protected route test: shows user info if token is valid
router.get('/views/AddNewEvent/AddNewEvent', authenticateToken, (req, res) => {
  res.json({ message: 'You are allowed!', user: req.user });   // ✅ Shows data decoded from token
});

// Route to save request (no token required)
router.post('/requestToRegister', async (req, res) => {
  const client = await pool.connect();
  try {
    const { organizationName, contactNumber, email, address, description, eventTypeID, username, password } = req.body;
    await client.query('BEGIN');

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user (user_type_id = 2)
    const userResult = await client.query(
      `INSERT INTO users
        (user_type_id, organization_name, contact_number, email, address, description, username, password)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING user_id`,
      [
        2,
        organizationName,
        contactNumber,
        email,
        address,
        description,
        username,
        hashedPassword
      ]
    );
    const userId = userResult.rows[0].user_id;

    // Fetch event_type_ids for selected event type names
    // Ensure eventTypeID is an array of event type names
    let eventTypeNames = eventTypeID;
    if (!Array.isArray(eventTypeNames)) {
      eventTypeNames = [eventTypeID];
    }
    const eventTypesRes = await client.query(
      `SELECT event_type_id FROM eventtypes WHERE event_type_name = ANY($1::text[]) AND is_active = true`,
      [eventTypeNames]
    );
    const eventTypeIds = eventTypesRes.rows.map(row => row.event_type_id);

    // Insert into user_eventTypes for each event_type_id
    for (const eventTypeId of eventTypeIds) {
      await client.query(
        `INSERT INTO user_eventTypes (event_type_id, created_by) VALUES ($1, $2)`,
        [eventTypeId, userId]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ message: "Organization request saved!", userId });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saving request:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
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

// Route to get all user types
router.get('/userTypes', async (req, res) => {
  try {
    const result = await pool.query('SELECT user_type_id, user_type FROM usertypes WHERE is_active = true');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user types" });
  }
});

// File upload config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const tempDir = path.join(__dirname, '../uploads/temp');
    
    // Ensure the directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    cb(null, tempDir); // Set the destination to the temp directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Update multer configuration to handle both event data and files
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
}).array('UploadedFiles[]', 10); // Update field name to 'UploadedFiles[]' to match the frontend

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
router.post('/addNewEvent', authenticateToken, (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    // Debugging: Log the parsed request body and files
    console.log("Request body:", req.body);
    console.log("Uploaded files:", req.files);

    try {
      const userId = req.user.userId; // Extract userId from the JWT token
      console.log('User ID from token:', userId); // Debugging: Log the userId
      if (!userId) {
        return res.status(403).json({ error: "Unauthorized: Invalid token" });
      }

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
        venueAddress // <-- get from req.body
      } = req.body;

      // Validate date inputs
      const startDate = new Date(startDateTime);
      const endDate = new Date(endDateTime);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format for startDateTime or endDateTime" });
      }

      // Format dates
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedStartTime = startDate.toTimeString().split(' ')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];
      const formattedEndTime = endDate.toTimeString().split(' ')[0];

      // Insert event data into the database
      const result = await pool.query(
        `INSERT INTO addnewevent (
          event_type, 
          event_name, 
          event_venue, 
          event_venue_address,  
          event_start_date, 
          event_start_time, 
          event_end_date, 
          event_end_time, 
          event_duration, 
          entrance_fee, 
          contact_number, 
          description, 
          special_guests,
          created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING event_id`,
        [
          eventType,
          eventName,
          venue,
          venueAddress,
          formattedStartDate,
          formattedStartTime,
          formattedEndDate,
          formattedEndTime,
          duration,
          entranceFee,
          contactNumber,
          description,
          specialGuests,
          userId // Use userId from the token as createdBy
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
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const oldPath = file.path; // Temporary path from upload
          const newPath = path.join(eventFolder, file.filename);

          // Move file from temp to event folder
          fs.renameSync(oldPath, newPath);

          // Store relative path in database
          finalMediaUrls.push(`event_Image/${eventId}/${file.filename}`);
        }
      }

      // Update event with final media URLs
      for (const mediaUrl of finalMediaUrls) {
        await pool.query(
          'INSERT INTO eventimage (event_id, images_and_videos, created_by) VALUES ($1, $2, $3)',
          [eventId, mediaUrl, userId]
        );
      }

      res.status(201).json({ 
        success: true,
        message: "Event added successfully!",
        eventId: eventId,
        mediaUrls: finalMediaUrls
      });
    } catch (error) {
      console.error('Error adding event:', error);
      res.status(500).json({ 
        success: false,
        error: 'Internal server error' 
      });
    }
  });
});

// New endpoint to get events by userId
router.get('/events', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Missing userId" });
  try {
    const result = await pool.query(
      'SELECT * FROM addnewevent WHERE created_by = $1 ORDER BY event_id DESC',
      [userId]
    );
    res.json({ events: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// Get single event by event_id
router.get('/event/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM addnewevent WHERE event_id = $1',
      [eventId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    // Optionally, fetch images/videos if needed:
    const mediaResult = await pool.query(
      'SELECT images_and_videos FROM eventimage WHERE event_id = $1',
      [eventId]
    );
    const event = result.rows[0];
    event.media = mediaResult.rows.map(row => row.images_and_videos);
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

/* Login */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Get user by username
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    // Check if user exists
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = result.rows[0];

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    // console.log('User found:', user);

    // Generate JWT token with userId included in the payload
    const token = jwt.sign(
      { 
        userId: user.user_id, // Include userId in the token payload
        username: user.username,
        email: user.email,
        organization: user.organization_name,
        userType: user.user_type_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }  // Token lifetime
    );

    // Include userId explicitly in the user object returned to the frontend
    res.status(200).json({ 
      message: 'Login successful', 
      user: { 
        id: user.user_id,  // Ensure userId is included
        userId: user.user_id, // Add userId explicitly
        username: user.username, 
        email: user.email,
        organization: user.organization_name,
        userType: user.user_type_id
      }, 
      token 
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin registration endpoint
router.post('/adminRegister', async (req, res) => {
  try {
    const { userType, username, password } = req.body;
    if (!userType || !username || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get user_type_id from usertypes table
    const typeResult = await pool.query(
      'SELECT user_type_id FROM usertypes WHERE user_type = $1 AND is_active = true',
      [userType]
    );
    if (typeResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid user type" });
    }
    const user_type_id = typeResult.rows[0].user_type_id;

    // Check if username already exists
    const userExists = await pool.query(
      'SELECT user_id FROM users WHERE username = $1',
      [username]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await pool.query(
      `INSERT INTO users (
        user_type_id, username, password)
      VALUES ($1, $2, $3)
      RETURNING user_id, user_type_id, username`,
      [
        user_type_id,
        username,
        hashedPassword
      ]
    );

    res.status(201).json({
      message: "Admin registered successfully",
      user: insertResult.rows[0]
    });
  } catch (err) {
    console.error('Admin registration error:', err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;