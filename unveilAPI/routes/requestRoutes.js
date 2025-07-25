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
        venueAddress,
        latitude,
        longitude
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
          created_by,
          latitude,
          longitude
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
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
          userId,
          latitude,
          longitude
        ]
      );

      const eventId = result.rows[0].event_id;
      const eventFolder = path.join(__dirname, '../uploads', eventId.toString());

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
          finalMediaUrls.push(`uploads/${eventId}/${file.filename}`);
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
      'SELECT * FROM addnewevent WHERE created_by = $1 AND is_active = true ORDER BY event_id DESC',
      [userId]
    );
    res.json({ events: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

// New endpoint to get all events (for admin event handling)
router.get('/allEvents', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM addnewevent WHERE is_active = true ORDER BY event_id DESC');
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
      console.log(`Event with ID ${eventId} not found`);
      return res.status(404).json({ error: "Event not found" });
    }
    // Fetch images/videos if needed:
    const mediaResult = await pool.query(
      'SELECT images_and_videos FROM eventimage WHERE event_id = $1',
      [eventId]
    );
    const event = result.rows[0];
    // Prefix each media path with the public directory
    event.media = mediaResult.rows.map(row => 
      path.join('C:/Users/aupek/Desktop/capstone2/Unveil-Desktop-Application/public', row.images_and_videos)
    );

    // Log the event and media before returning
    console.log('Fetched event:', event);
    console.log('Fetched media:', event.media);

    res.json(event);
  } catch (err) {
    console.error('Error fetching event:', err);
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

// Update event status by event_id
router.put('/event/:eventId/status', async (req, res) => {
  const { eventId } = req.params;
  const { status } = req.body;
  if (![1, 2, 3].includes(Number(status))) {
    return res.status(400).json({ error: "Invalid status value" });
  }
  try {
    const result = await pool.query(
      'UPDATE addnewevent SET status = $1 WHERE event_id = $2 RETURNING *',
      [status, eventId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ success: true, event: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

// API to soft-delete an event (set is_active = false)
router.put('/event/:eventId/deactivate', async (req, res) => {
  const { eventId } = req.params;
  try {
    const result = await pool.query(
      'UPDATE addnewevent SET is_active = false WHERE event_id = $1 RETURNING *',
      [eventId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ success: true, event: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to deactivate event" });
  }
});

// Update event by event_id
router.put('/event/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const {
    eventName,
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
    latitude,
    longitude
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE addnewevent SET
        event_name = $1,
        event_venue = $2,
        event_venue_address = $3,
        event_start_date = $4,
        event_start_time = $5,
        event_end_date = $6,
        event_end_time = $7,
        event_duration = $8,
        entrance_fee = $9,
        contact_number = $10,
        description = $11,
        special_guests = $12,
        latitude = $13,
        longitude = $14,
        status = 1 -- Reset status to 1 (Pending) on update
        WHERE event_id = $15
        RETURNING *`,
      [
        eventName,
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
        latitude,
        longitude,
        eventId
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ success: true, event: result.rows[0] });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// New endpoint: Admin add event with organization check
router.post('/adminAddEventWithOrgCheck', (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message });
    }

    try {
      // Extract organizationName from form data
      const {
        organizationName,
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
        venueAddress,
        latitude,
        longitude
      } = req.body;

      // Check if organization exists in users table
      const orgResult = await pool.query(
        'SELECT user_id FROM users WHERE organization_name = $1',
        [organizationName]
      );

      if (orgResult.rows.length === 0) {
        return res.status(400).json({ 
          success: false,
          error: "This organization is not registered in the system yet."
        });
      }

      const userId = orgResult.rows[0].user_id;

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
          created_by,
          latitude,
          longitude
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
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
          userId,
          latitude,
          longitude
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

// Get user profile by userId (including event types)
router.get('/userProfile/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // Fetch user details
    const userResult = await pool.query(
      `SELECT user_id, organization_name, contact_number, email, address, description, username
       FROM users WHERE user_id = $1`,
      [userId]
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = userResult.rows[0];

    // Fetch event_type_ids from user_eventTypes
    const userEventTypesResult = await pool.query(
      `SELECT event_type_id FROM user_eventTypes WHERE created_by = $1`,
      [userId]
    );
    const eventTypeIds = userEventTypesResult.rows.map(row => row.event_type_id);

    // Fetch event type names from eventtypes table
    let eventTypes = [];
    if (eventTypeIds.length > 0) {
      const eventTypesResult = await pool.query(
        `SELECT event_type_id, event_type_name FROM eventtypes WHERE event_type_id = ANY($1::int[]) AND is_active = true`,
        [eventTypeIds]
      );
      eventTypes = eventTypesResult.rows; // [{event_type_id, event_type_name}, ...]
    }
    user.eventTypes = eventTypes;

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});



// NEW ENDPOINT: Get all events for ForYouPage (testing purposes)
// This endpoint will fetch all events that are considered "active" or "published"
// and orders them, perhaps by start date.

router.get('/forYouEvents', async (req, res) => {
  try {
    const eventsQuery = `Select event_id, event_type, event_name, event_venue, event_venue_address,
      event_start_date, event_start_time, event_end_date, event_end_time,event_duration, entrance_fee, contact_number,
      description, special_guests, is_active, created_by, created_date,
      (Select array_agg(images_and_videos) from eventimage where eventimage.event_id = addnewevent.event_id) as media_urls
      FROM addnewevent
      WHERE status = 2 AND is_active = true
      ORDER BY event_start_date ASC, event_start_time ASC`;
    const result = await pool.query(eventsQuery);

    const events = result.rows.map(event => {
      const formatDateTime = (date, time) => {
        if (!date || !time) return null;
        const datePart = new Date(date).toISOString().split('T')[0];
        return `${datePart}T${time}`;
      };

      return {
        id: event.event_id,
        eventType: event.event_type,
        eventName: event.event_name,
        eventVenue: event.event_venue, 
        eventVenueAddress: event.event_venue_address,
        startDateTime: formatDateTime(event.event_start_date, event.event_start_time),
        endDateTime: formatDateTime(event.event_end_date, event.event_end_time),
        is_free: event.entrance_fee === null || parseFloat(event.entrance_fee === 0),
        entranceFee: event.entrance_fee,
        contactNumber: event.contact_number,
        description: event.description,
        specialGuests: event.special_guests,
        image_url: event.media_urls && event.media_urls.length > 0 ? event.media_urls[0] : null,
        all_media_urls: event.media_urls || [],
      };
    }); 
    res.status(200).json(events);
  } catch (error) { 
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
);

router.get('/eventDetails/:eventId', async (req, res) => {
  const { eventId } = req.params;
  
  try {
    const eventQuery = `
      SELECT event_id, event_type, event_name, event_venue, event_venue_address,
        event_start_date, event_start_time, event_end_date, event_end_time, event_duration, 
        entrance_fee, contact_number, description, special_guests, is_active, created_by, created_date,
        (SELECT array_agg(images_and_videos) FROM eventimage WHERE eventimage.event_id = addnewevent.event_id) as media_urls
      FROM addnewevent
      WHERE event_id = $1 AND status = 2 AND is_active = true`;
    
    const result = await pool.query(eventQuery, [eventId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Event not found or not active" });
    }
    
    const event = result.rows[0];
    
    const formatDateTime = (date, time) => {
      if (!date || !time) return null;
      const datePart = new Date(date).toISOString().split('T')[0];
      return `${datePart}T${time}`;
    };
    
    const formattedEvent = {
      id: event.event_id,
      eventType: event.event_type,
      eventName: event.event_name,
      eventVenue: event.event_venue,
      eventVenueAddress: event.event_venue_address,
      startDateTime: formatDateTime(event.event_start_date, event.event_start_time),
      endDateTime: formatDateTime(event.event_end_date, event.event_end_time),
      duration: event.event_duration,
      is_free: event.entrance_fee === null || parseFloat(event.entrance_fee) === 0,
      entranceFee: event.entrance_fee,
      contactNumber: event.contact_number,
      description: event.description,
      specialGuests: event.special_guests,
      image_url: event.media_urls && event.media_urls.length > 0 ? event.media_urls[0] : null,
      all_media_urls: event.media_urls || [],
      createdBy: event.created_by,
      createdDate: event.created_date
    };
    
    res.status(200).json(formattedEvent);
  } catch (error) {
    console.error('Error fetching event details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile info
router.put('/userProfile/:userId', async (req, res) => {
  const { userId } = req.params;
  const {
    organization_name,
    contact_number,
    email,
    address,
    description,
    username
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET
        organization_name = $1,
        contact_number = $2,
        email = $3,
        address = $4,
        description = $5,
        username = $6
      WHERE user_id = $7
      RETURNING user_id, organization_name, contact_number, email, address, description, username`,
      [
        organization_name,
        contact_number,
        email,
        address,
        description,
        username,
        userId
      ]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
});

module.exports = router;