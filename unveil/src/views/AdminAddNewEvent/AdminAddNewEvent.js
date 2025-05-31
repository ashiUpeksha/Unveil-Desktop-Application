import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';

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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import {
  LocalizationProvider,
  DateTimePicker
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const validationSchema = Yup.object({
  eventType: Yup.string().required("Required"),
  eventName: Yup.string().required("Required"),
  venue: Yup.string().required("Required"),
  startDateTime: Yup.date().required("Start date and time is required"),
  endDateTime: Yup.date().required("End date and time is required"),
  duration: Yup.string().required("Required"),
  entranceFee: Yup.string().required("Required"),
  contactNumber: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .required("Required"),
  description: Yup.string().required("Required"),
  venueAddress: Yup.string().required("Event venue address is required"), 
});

const AdminAddNewEventPage = () => {
  const navigate = useNavigate();
  const [eventTypes, setEventTypes] = useState([]);
  const [openMediaDialog, setOpenMediaDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [resultDialogMsg, setResultDialogMsg] = useState("");
  const [resultDialogType, setResultDialogType] = useState(""); // "success" or "error"

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

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/eventTypes");
        setEventTypes(response.data);
      } catch (error) {
        console.error("Error fetching event types", error);
      }
    };

    fetchEventTypes();
  }, []);

  const formik = useFormik({
    initialValues: {
      eventType: "",
      eventName: "",
      venue: "",
      startDateTime: null,
      endDateTime: null,
      duration: "",
      entranceFee: "",
      contactNumber: "",
      description: "",
      specialGuests: "",
      venueAddress: "", 
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // 1. Call OpenCage Geocoding API with the entered venue address
        const venueQuery = encodeURIComponent(values.venue);

        const openCageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${venueQuery}&key=d626d87c3c6742b2880c16631183dd25`;

        const geoResponse = await axios.get(openCageUrl);
        // You can use geoResponse.data as needed, e.g., extract coordinates
        // For now, just log the response
        console.log("OpenCage Geocoding API response:", geoResponse);
        const lat = geoResponse.data.results[0]?.geometry?.lat;
        const lng = geoResponse.data.results[0]?.geometry?.lng;

        setIsUploading(true);

        const formData = new FormData();
        selectedFiles.forEach((file) => {
          formData.append('UploadedFiles[]', file);
        });

        // Debugging: Log FormData keys and values
        /* for (let pair of formData.entries()) {
          console.log(pair[0] + ':', pair[1]);
        } */
        console.log("FormData before submission:", formData.getAll('media'));
        const model = {
          eventType: values.eventType,
          eventName: values.eventName,
          venue: values.venue,
          startDateTime: values.startDateTime,
          endDateTime: values.endDateTime,
          duration: values.duration,
          entranceFee: values.entranceFee,
          contactNumber: values.contactNumber,
          description: values.description,
          specialGuests: values.specialGuests,
          UploadedFiles: selectedFiles,
          venueAddress: values.venueAddress, 
          latitude: lat, 
          longitude: lng, 
        };

        // Retrieve the token from localStorage
        const token = localStorage.authToken;
        console.log("Retrieved token:", model); // Debugging: Log the token

        if (!token) {
          alert("Authorization token is missing. Please log in again.");
          navigate("/login"); // Redirect to login page if token is missing
          return;
        }

        const response = await axios.post(
          "http://localhost:3000/api/addNewEvent", 
          model,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            },
            onUploadProgress: (progressEvent) => {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            }
          }
        );

        if (response.data.success) {
          setResultDialogMsg("Event added successfully!");
          setResultDialogType("success");
          setResultDialogOpen(true);
          // Do not navigate or reset form here, do it after dialog OK
        } else {
          throw new Error(response.data.error || "Failed to add event");
        }
      } catch (error) {
        console.error("Error submitting event:", error);

        // Debugging: Log server response if available
        if (error.response) {
          console.error("Server response:", error.response.data);
        }

        if (error.response && error.response.status === 403) {
          alert("You are not authorized to perform this action. Please log in again.");
        } else {
          setResultDialogMsg(
            error.response && error.response.data && error.response.data.error
              ? error.response.data.error
              : error.message || "Failed to add event."
          );
          setResultDialogType("error");
          setResultDialogOpen(true);
        }
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        setSelectedFiles([]);
      }
    }
  });

  useEffect(() => {
    const { startDateTime, endDateTime } = formik.values;

    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);

      if (!isNaN(start) && !isNaN(end) && end > start) {
        const diffMs = end - start;
        
        // Calculate days
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const remainingMsAfterDays = diffMs % (1000 * 60 * 60 * 24);
        
        // Calculate hours
        const diffHours = Math.floor(remainingMsAfterDays / (1000 * 60 * 60));
        const remainingMsAfterHours = remainingMsAfterDays % (1000 * 60 * 60);
        
        // Calculate minutes
        const diffMinutes = Math.floor(remainingMsAfterHours / (1000 * 60));

        // Build duration string
        let durationString = '';
        if (diffDays > 0) {
          durationString += `${diffDays}d `;
        }
        if (diffHours > 0 || diffDays > 0) {
          durationString += `${diffHours}h `;
        }
        durationString += `${diffMinutes}m`;

        formik.setFieldValue("duration", durationString.trim(), false);
      } else {
        formik.setFieldValue("duration", "", false);
      }
    }
  }, [formik.values.startDateTime, formik.values.endDateTime]);

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

  const fields = [
    { name: "eventType", label: "Event Type", type: "select" },
    { name: "eventName", label: "Event Name", type: "text", placeholder: "Event Name" },
    { name: "venue", label: "Venue", type: "text", placeholder: "Venue" },
    { name: "duration", label: "Duration", type: "text", placeholder: "Duration" },
    { name: "entranceFee", label: "Entrance Fee", type: "text", placeholder: "Entrance Fee" },
    { name: "contactNumber", label: "Contact Number", type: "text", placeholder: "Contact Number" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AdminNavbar />
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#C6C6C6", p: 3, mt: 8, minHeight: "100vh" }}>
        <Box sx={{ backgroundColor: "white", p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>Add New Event</Typography>
          <form onSubmit={formik.handleSubmit}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>

              {fields.slice(0, 3).map((field, index) => (
                <Box key={index}>
                  <Typography variant="subtitle1">{field.label}</Typography>
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formik.values[field.name]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={inputStyle}
                    >
                      <option value="">Select {field.label}</option>
                      {eventTypes.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder || ""}
                      value={formik.values[field.name]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      style={inputStyle}
                    />
                  )}
                  {formik.touched[field.name] && formik.errors[field.name] && (
                    <div style={{ color: "red", fontSize: "0.8rem" }}>{formik.errors[field.name]}</div>
                  )}
                </Box>
              ))}

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box>
                  <Typography variant="subtitle1">Start Date and Time</Typography>
                  <DateTimePicker
                    value={formik.values.startDateTime}
                    onChange={(value) => formik.setFieldValue("startDateTime", value)}
                    onBlur={formik.handleBlur}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(formik.touched.startDateTime && formik.errors.startDateTime),
                        helperText: formik.touched.startDateTime && formik.errors.startDateTime ? formik.errors.startDateTime : "",
                        size: "medium",
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle1">End Date and Time</Typography>
                  <DateTimePicker
                    value={formik.values.endDateTime}
                    onChange={(value) => formik.setFieldValue("endDateTime", value)}
                    onBlur={formik.handleBlur}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: Boolean(formik.touched.endDateTime && formik.errors.endDateTime),
                        helperText: formik.touched.endDateTime && formik.errors.endDateTime ? formik.errors.endDateTime : "",
                        size: "medium",
                      },
                    }}
                  />
                </Box>
              </LocalizationProvider>

              <Box>
                <Typography variant="subtitle1">Duration</Typography>
                <input
                  type="text"
                  name="duration"
                  placeholder="Duration"
                  value={formik.values.duration}
                  readOnly
                  style={{ ...inputStyle, backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                />
                {formik.touched.duration && formik.errors.duration && (
                  <div style={{ color: "red", fontSize: "0.8rem" }}>{formik.errors.duration}</div>
                )}
              </Box>

              {/* Entrance Fee */}
              <Box>
                <Typography variant="subtitle1">Entrance Fee</Typography>
                <input
                  type="text"
                  name="entranceFee"
                  placeholder="Entrance Fee"
                  value={formik.values.entranceFee}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={inputStyle}
                />
                {formik.touched.entranceFee && formik.errors.entranceFee && (
                  <div style={{ color: "red", fontSize: "0.8rem" }}>{formik.errors.entranceFee}</div>
                )}
              </Box>

              {/* Contact Number */}
              <Box>
                <Typography variant="subtitle1">Contact Number</Typography>
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="Contact Number"
                  value={formik.values.contactNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={inputStyle}
                />
                {formik.touched.contactNumber && formik.errors.contactNumber && (
                  <div style={{ color: "red", fontSize: "0.8rem" }}>{formik.errors.contactNumber}</div>
                )}
              </Box>

              {/* Empty box to fill the third column in this row */}
              <Box />

              {/* New row: Event Venue Address, Description, Special Guests */}
              <Box>
                <Typography variant="subtitle1">Event Venue Address</Typography>
                <textarea
                  name="venueAddress"
                  placeholder="Address of the event venue"
                  value={formik.values.venueAddress || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={textareaStyle}
                />
                {formik.touched.venueAddress && formik.errors.venueAddress && (
                  <div style={{ color: "red", fontSize: "0.8rem" }}>{formik.errors.venueAddress}</div>
                )}
              </Box>
              <Box>
                <Typography variant="subtitle1">Description</Typography>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={textareaStyle}
                />
                {formik.touched.description && formik.errors.description && (
                  <div style={{ color: "red", fontSize: "0.8rem" }}>{formik.errors.description}</div>
                )}
              </Box>
              <Box>
                <Typography variant="subtitle1">Special Guests</Typography>
                <textarea
                  name="specialGuests"
                  placeholder="Special Guests"
                  value={formik.values.specialGuests}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={textareaStyle}
                />
              </Box>

              {/* Images and Videos Field */}
              <Box sx={{ gridColumn: { xs: "span 1", sm: "span 3" } }}>
                <Typography variant="subtitle1">Images and Videos of the Event</Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => setOpenMediaDialog(true)}
                  startIcon={<CloudUploadIcon />}
                >
                  Add Media
                </Button>
                {selectedFiles.length > 0 && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                    {selectedFiles.length} file(s) selected
                  </Typography>
                )}
              </Box>
              <Box sx={{ gridColumn: "span 3", textAlign: "right", mt: 2 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                      Uploading ({uploadProgress}%)
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>

      {/* Media Upload Dialog */}
      <Dialog 
        open={openMediaDialog} 
        onClose={() => setOpenMediaDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Add Images and Videos of the Event
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
            onClick={() => setOpenMediaDialog(false)} 
            color="primary"
            variant="contained"
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Result Dialog for success/error */}
      <Dialog
        open={resultDialogOpen}
        onClose={() => {
          setResultDialogOpen(false);
          if (resultDialogType === "success") {
            formik.resetForm();
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
              formik.resetForm();
              setSelectedFiles([]);
            }
          }} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminAddNewEventPage;