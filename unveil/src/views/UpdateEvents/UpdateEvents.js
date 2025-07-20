import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import {
  LocalizationProvider,
  DateTimePicker,
  TimePicker
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useLocation } from "react-router-dom";

const inputStyle = {
  width: '100%',
  height: '50px',
  padding: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  marginTop: '5px',
  boxSizing: 'border-box',
}

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

const UpdateEventsPage = () => {
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

  // Log media data whenever it changes
  useEffect(() => {
    console.log("Media files:", media);
  } );

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
          console.log("Fetched event data:", data);
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
      <Navbar />
      <Sidebar />
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


              
              