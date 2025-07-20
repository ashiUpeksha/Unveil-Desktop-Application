import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton,
  CircularProgress
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';
import {
  LocalizationProvider,
  DateTimePicker,
  TimePicker
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useLocation } from "react-router-dom";
import axios from 'axios';

const inputStyle = {
  width: '100%',
  height: '50px',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  marginTop: '5px',
  boxSizing: 'border-box',
};

const textareaStyle = {
  width: '100%',
  minHeight: '100px',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  marginTop: '5px',
  boxSizing: 'border-box',
  resize: 'vertical',
};

const AdminUpdateEventsPage = () => {
  const location = useLocation();
  const [eventId, setEventId] = useState(null);

  // Form fields state
  const [eventType, setEventType] = useState("");
  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [duration, setDuration] = useState("");
  const [entranceFee, setEntranceFee] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [description, setDescription] = useState("");
  const [specialGuests, setSpecialGuests] = useState("");
  const [media, setMedia] = useState([]);

  // New states for image management
  const [images, setImages] = useState([]);
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Dialog state
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [resultDialogMsg, setResultDialogMsg] = useState("");
  const [resultDialogType, setResultDialogType] = useState(""); // "success" or "error"

  // Get eventId from location.state (when navigating from ViewEvents)
  useEffect(() => {
    if (location.state && location.state.event && location.state.event.event_id) {
      setEventId(location.state.event.event_id);
    }
  }, [location.state]);

  // Fetch event data from backend when eventId is set
  useEffect(() => {
    if (eventId) {
      fetch(`http://localhost:3000/api/event/${eventId}`)
        .then(res => res.json())
        .then(data => {
          setEventType(data.event_type || "");
          setEventName(data.event_name || "");
          setVenue(data.event_venue || "");
          setVenueAddress(data.event_venue_address || "");
          // Ensure startDate uses only event_start_date (date only, no time)
          if (data.event_start_date) {
            setStartDate(dayjs(data.event_start_date));
          } else {
            setStartDate(null);
          }
          // Start time uses only event_start_time (time only, today as date context)
          if (data.event_start_time) {
            setStartTime(dayjs(`1970-01-01T${data.event_start_time}`));
          } else {
            setStartTime(null);
          }
          // End date uses only event_end_date (date only, no time)
          if (data.event_end_date) {
            setEndDate(dayjs(data.event_end_date));
          } else {
            setEndDate(null);
          }
          // End time uses only event_end_time (time only, today as date context)
          if (data.event_end_time) {
            setEndTime(dayjs(`1970-01-01T${data.event_end_time}`));
          } else {
            setEndTime(null);
          }
          setDuration(data.event_duration || "");
          setEntranceFee(data.entrance_fee || "");
          setContactNumber(data.contact_number || "");
          setDescription(data.description || "");
          setSpecialGuests(data.special_guests || "");
          setMedia(data.media || []);
        })
        .catch((err) => {
          // Optionally handle error
          console.error("Failed to fetch event data:", err);
        });
    }
  }, [eventId]);

  // Fetch event images
  useEffect(() => {
    if (eventId) {
      const fetchImages = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/event/${eventId}/images`);
          if (response.data.success) {
            setImages(response.data.images);
          }
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      };
      fetchImages();
    }
  }, [eventId]);

  // Image management functions
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB
      return isValidType && isValidSize;
    });
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileChange({ target: { files: e.dataTransfer.files } });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const token = localStorage.authToken;
      const response = await axios.delete(
        `http://localhost:3000/api/event/${eventId}/image/${imageId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        // Remove from local state
        setImages(prev => prev.filter(img => img.id !== imageId));
        setResultDialogMsg("Image deleted successfully!");
        setResultDialogType("success");
        setResultDialogOpen(true);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      setResultDialogMsg("Failed to delete image");
      setResultDialogType("error");
      setResultDialogOpen(true);
    }
  };

  const handleUploadNewImages = async () => {
    if (selectedFiles.length === 0) {
      setOpenMediaDialog(false);
      return;
    }

    setIsUploading(true);

    try {
      const token = localStorage.authToken;
      const formData = new FormData();
      
      selectedFiles.forEach((file) => {
        formData.append('UploadedFiles[]', file);
      });

      const response = await axios.post(
        `http://localhost:3000/api/event/${eventId}/images`,
        formData,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        }
      );

      if (response.data.success) {
        // Refresh images list
        const imagesResponse = await axios.get(`http://localhost:3000/api/event/${eventId}/images`);
        if (imagesResponse.data.success) {
          setImages(imagesResponse.data.images);
        }
        
        setSelectedFiles([]);
        setOpenMediaDialog(false);
        setResultDialogMsg("Images uploaded successfully!");
        setResultDialogType("success");
        setResultDialogOpen(true);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setResultDialogMsg("Failed to upload images");
      setResultDialogType("error");
      setResultDialogOpen(true);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Helper to combine date and time into a single Date object
  const getCombinedDateTime = (date, time) => {
    if (!date || !time) return null;
    const d = dayjs(date);
    const t = dayjs(time);
    return d.hour(t.hour()).minute(t.minute()).second(0).millisecond(0);
  };

  // Helper to format duration as "X days Y hours Z minutes"
  const getDurationString = (start, end) => {
    if (!start || !end) return duration;
    const diff = end.diff(start, 'minute');
    if (diff <= 0) return "0 minutes";
    const days = Math.floor(diff / (60 * 24));
    const hours = Math.floor((diff % (60 * 24)) / 60);
    const minutes = diff % 60;
    let str = "";
    if (days > 0) str += `${days} day${days > 1 ? "s" : ""} `;
    if (hours > 0) str += `${hours} hour${hours > 1 ? "s" : ""} `;
    if (minutes > 0) str += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    return str.trim();
  };

  const eventStartDateTime = getCombinedDateTime(startDate, startTime);
  const eventEndDateTime = getCombinedDateTime(endDate, endTime);

  // Add update handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!eventId) return;

    // Combine date and time for start and end
    const startDateStr = startDate ? dayjs(startDate).format('YYYY-MM-DD') : null;
    const startTimeStr = startTime ? dayjs(startTime).format('HH:mm:ss') : null;
    const endDateStr = endDate ? dayjs(endDate).format('YYYY-MM-DD') : null;
    const endTimeStr = endTime ? dayjs(endTime).format('HH:mm:ss') : null;
    const durationStr = eventStartDateTime && eventEndDateTime
      ? getDurationString(eventStartDateTime, eventEndDateTime)
      : duration;

    let latitude = null;
    let longitude = null;

    // Get new lat/lng if venue changed
    if (venue) {
      try {
        const venueQuery = encodeURIComponent(venue);
        // Use your OpenCage API key from .env (React: REACT_APP_OPENCAGE_API_KEY)
        const openCageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${venueQuery}&key=d626d87c3c6742b2880c16631183dd25`;
        const geoResponse = await fetch(openCageUrl);
        const geoData = await geoResponse.json();
        latitude = geoData.results[0]?.geometry?.lat || null;
        longitude = geoData.results[0]?.geometry?.lng || null;
      } catch (err) {
        // If geocoding fails, keep lat/lng as null
        latitude = null;
        longitude = null;
      }
    }

    try {
      const res = await fetch(`http://localhost:3000/api/event/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          eventName,
          event_venue: venue,
          event_venue_address: venueAddress,
          event_start_date: startDateStr,
          event_start_time: startTimeStr,
          event_end_date: endDateStr,
          event_end_time: endTimeStr,
          event_duration: durationStr,
          entrance_fee: entranceFee,
          contact_number: contactNumber,
          description,
          special_guests: specialGuests,
          latitude,
          longitude
        })
      });
      const data = await res.json();
      if (data.success) {
        setResultDialogMsg("Event updated successfully!");
        setResultDialogType("success");
        setResultDialogOpen(true);
      } else {
        setResultDialogMsg(data.error || "Failed to update event.");
        setResultDialogType("error");
        setResultDialogOpen(true);
      }
    } catch (err) {
      setResultDialogMsg("Failed to update event.");
      setResultDialogType("error");
      setResultDialogOpen(true);
      console.error(err);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AdminNavbar />
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#C6C6C6", p: 3, mt: 8, minHeight: "100vh" }}>
        <Box sx={{ backgroundColor: "white", p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>Update Event</Typography>
          <form onSubmit={handleUpdate}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
              {/* Event Type */}
              <Box>
                <Typography variant="subtitle1">Event Type</Typography>
                <input
                  type="text"
                  name="eventType"
                  style={{ ...inputStyle, backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                  value={eventType}
                  readOnly
                />
              </Box>
              {/* Event Name */}
              <Box>
                <Typography variant="subtitle1">Event Name</Typography>
                <input
                  type="text"
                  name="eventName"
                  placeholder="Event Name"
                  style={inputStyle}
                  value={eventName}
                  onChange={e => setEventName(e.target.value)}
                />
              </Box>
              {/* Venue */}
              <Box>
                <Typography variant="subtitle1">Venue</Typography>
                <input
                  type="text"
                  name="venue"
                  placeholder="Venue"
                  style={inputStyle}
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                />
              </Box>
              {/* Start Date and Time */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box>
                  <Typography variant="subtitle1">Start Date</Typography>
                  <DateTimePicker
                    value={startDate}
                    onChange={setStartDate}
                    views={['year', 'month', 'day']}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: "MM/DD/YYYY",
                        size: "medium",
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle1">Start Time</Typography>
                  <TimePicker
                    value={startTime}
                    onChange={setStartTime}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: "hh:mm aa",
                        size: "medium",
                      },
                    }}
                  />
                </Box>
                {/* End Date and Time */}
                <Box>
                  <Typography variant="subtitle1">End Date</Typography>
                  <DateTimePicker
                    value={endDate}
                    onChange={setEndDate}
                    views={['year', 'month', 'day']}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: "MM/DD/YYYY",
                        size: "medium",
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle1">End Time</Typography>
                  <TimePicker
                    value={endTime}
                    onChange={setEndTime}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: "hh:mm aa",
                        size: "medium",
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>
              {/* Duration */}
              <Box>
                <Typography variant="subtitle1">Duration</Typography>
                <input
                  type="text"
                  name="duration"
                  placeholder="Duration"
                  style={{ ...inputStyle, backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                  readOnly
                  value={
                    eventStartDateTime && eventEndDateTime
                      ? getDurationString(eventStartDateTime, eventEndDateTime)
                      : duration
                  }
                />
              </Box>
              {/* Entrance Fee */}
              <Box>
                <Typography variant="subtitle1">Entrance Fee</Typography>
                <input
                  type="text"
                  name="entranceFee"
                  placeholder="Entrance Fee"
                  style={inputStyle}
                  value={entranceFee}
                  onChange={e => setEntranceFee(e.target.value)}
                />
              </Box>
              {/* Contact Number */}
              <Box>
                <Typography variant="subtitle1">Contact Number</Typography>
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="Contact Number"
                  style={inputStyle}
                  value={contactNumber}
                  onChange={e => setContactNumber(e.target.value)}
                />
              </Box>
              {/* Empty box to fill the next column */}
              <Box />
              {/* Empty box to fill the next column */}
              <Box />
              {/* Event Venue Address, Description, Special Guests in the same row */}
              <Box>
                <Typography variant="subtitle1">Event Venue Address</Typography>
                <textarea
                  name="venueAddress"
                  placeholder="Address of the event venue"
                  style={textareaStyle}
                  value={venueAddress}
                  onChange={e => setVenueAddress(e.target.value)}
                />
              </Box>
              <Box>
                <Typography variant="subtitle1">Description</Typography>
                <textarea
                  name="description"
                  placeholder="Description"
                  style={textareaStyle}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </Box>
              <Box>
                <Typography variant="subtitle1">Special Guests</Typography>
                <textarea
                  name="specialGuests"
                  placeholder="Special Guests"
                  style={textareaStyle}
                  value={specialGuests}
                  onChange={e => setSpecialGuests(e.target.value)}
                />
              </Box>
              {/* Images and Videos Field */}
              {/* Images and Videos Field */}
              <Box sx={{ gridColumn: { xs: "span 1", sm: "span 3" } }}>
                <Typography variant="subtitle1">Images and Videos of the Event</Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => setOpenMediaDialog(true)}
                    startIcon={<CloudUploadIcon />}
                  >
                    Add Media
                  </Button>
                </Box>
                
                {/* Display existing images */}
                {images && images.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>Current Images:</Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 2,
                      maxHeight: '300px',
                      overflow: 'auto',
                      border: '1px solid #eee',
                      borderRadius: '4px',
                      p: 2
                    }}>
                      {images.map((image) => (
                        <Box 
                          key={image.id} 
                          sx={{ 
                            position: 'relative',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}
                        >
                          {image.path && image.path.match(/\.(jpg|jpeg|png)$/i) ? (
                            <img
                              src={image.url}
                              alt="event media"
                              style={{ 
                                width: '120px', 
                                height: '120px', 
                                objectFit: 'cover',
                                display: 'block'
                              }}
                              onError={e => {
                                console.error('Image failed to load:', image.url);
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : image.path && image.path.match(/\.(mp4)$/i) ? (
                            <video 
                              src={image.url} 
                              controls 
                              style={{ 
                                width: '120px', 
                                height: '120px', 
                                objectFit: 'cover'
                              }} 
                            />
                          ) : (
                            <Box sx={{ 
                              width: '120px', 
                              height: '120px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              backgroundColor: '#f5f5f5'
                            }}>
                              <Typography variant="caption">File</Typography>
                            </Box>
                          )}
                          <IconButton
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              backgroundColor: 'rgba(255, 255, 255, 0.8)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              },
                              padding: '4px'
                            }}
                            size="small"
                            onClick={() => handleDeleteImage(image.id)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
              {/* Submit Button */}
              <Box sx={{ gridColumn: "span 3", textAlign: "right", mt: 2 }}>
                <Button variant="contained" color="primary" type="submit">
                  Update
                </Button>
              </Box>
            </Box>
          </form>

          {/* Media Upload Dialog */}
          <Dialog 
            open={openMediaDialog} 
            onClose={() => setOpenMediaDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Add Images and Videos to Event
              <IconButton
                aria-label="close"
                onClick={() => setOpenMediaDialog(false)}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: '4px',
                  p: 4,
                  textAlign: 'center',
                  mb: 2,
                  backgroundColor: '#f9f9f9',
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  }
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                <Typography variant="h6" gutterBottom>
                  Drag & Drop files here
                </Typography>
                <Typography variant="body1" gutterBottom>
                  or
                </Typography>
                <Button 
                  variant="contained" 
                  component="label"
                  sx={{ mt: 1 }}
                >
                  Browse Files
                  <input 
                    type="file" 
                    hidden 
                    multiple 
                    onChange={handleFileChange}
                    accept=".jpeg,.jpg,.png,.pdf,.mp4"
                  />
                </Button>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 2 }}>
                  Supported formats: JPEG, PNG, PDF, MP4 (Max 50MB each)
                </Typography>
              </Box>

              {/* Selected files preview */}
              {selectedFiles.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Selected Files:</Typography>
                  <Box sx={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #eee', borderRadius: '4px' }}>
                    {selectedFiles.map((file, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          p: 1.5,
                          borderBottom: '1px solid #eee',
                          '&:last-child': {
                            borderBottom: 'none'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '300px'
                            }}
                          >
                            {file.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>
                            ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </Typography>
                        </Box>
                        <IconButton 
                          size="small" 
                          onClick={() => handleRemoveFile(index)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenMediaDialog(false)}>Cancel</Button>
              <Button 
                onClick={handleUploadNewImages}
                color="primary"
                variant="contained"
                disabled={selectedFiles.length === 0 || isUploading}
              >
                {isUploading ? (
                  <>
                    <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                    Uploading ({uploadProgress}%)
                  </>
                ) : (
                  `Upload ${selectedFiles.length} file(s)`
                )}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Result Dialog for success/error */}
          <Dialog
            open={resultDialogOpen}
            onClose={() => {
              setResultDialogOpen(false);
              if (resultDialogType === "success") {
                // Reset all fields on success
                setEventType("");
                setEventName("");
                setVenue("");
                setVenueAddress("");
                setStartDate(null);
                setStartTime(null);
                setEndDate(null);
                setEndTime(null);
                setDuration("");
                setEntranceFee("");
                setContactNumber("");
                setDescription("");
                setSpecialGuests("");
                setMedia([]);
                setImages([]);
                setSelectedFiles([]);
              }
            }}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle>Status</DialogTitle>
            <DialogContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {resultDialogType === "success" && (
                <CheckCircleIcon sx={{ color: "#00C853", fontSize: 40 }} />
              )}
              {resultDialogType === "error" && (
                <CancelIcon sx={{ color: "#FF1744", fontSize: 40 }} />
              )}
              <Typography>{resultDialogMsg}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setResultDialogOpen(false);
                if (resultDialogType === "success") {
                  // Reset all fields on success
                  setEventType("");
                  setEventName("");
                  setVenue("");
                  setVenueAddress("");
                  setStartDate(null);
                  setStartTime(null);
                  setEndDate(null);
                  setEndTime(null);
                  setDuration("");
                  setEntranceFee("");
                  setContactNumber("");
                  setDescription("");
                  setSpecialGuests("");
                  setMedia([]);
                  setImages([]);
                  setSelectedFiles([]);
                }
              }} autoFocus>
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminUpdateEventsPage;