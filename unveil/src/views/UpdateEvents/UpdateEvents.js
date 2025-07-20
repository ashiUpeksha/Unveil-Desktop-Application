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
              <Box sx={{ gridColumn: { xs: "span 1", sm: "span 3" } }}>
                <Typography variant="subtitle1">Images and Videos of the Event</Typography>
                <Button variant="contained" color="primary">
                  Show Media
                </Button>
                {/* Optionally display media */}
                {media && media.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    {media.map((url, idx) => {
                      // Always extract the path after 'public' and prepend '/'
                      let publicUrl = url.replace(/\\/g, '/'); // Normalize slashes
                      const publicIdx = publicUrl.indexOf('/public/');
                      if (publicIdx !== -1) {
                        publicUrl = publicUrl.substring(publicIdx + '/public'.length); // keep the slash before 'event_Image'
                      }
                      // Ensure leading slash
                      if (!publicUrl.startsWith('/')) {
                        publicUrl = '/' + publicUrl;
                      }
                      // Prepend backend server URL for correct loading
                      const backendUrl = 'http://localhost:3000' + publicUrl;
                      return (
                        <div key={idx}>
                          {/* Add onError handler to help debug image loading issues */}
                          {publicUrl.match(/\.(jpg|jpeg|png)$/i) ? (
                            <img
                              src={publicUrl}
                              alt="event media"
                              style={{ maxWidth: 120, marginRight: 8 }}
                              onError={e => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                console.error('Image failed to load:', backendUrl);
                              }}
                            />
                          ) : publicUrl.match(/\.(mp4)$/i) ? (
                            <video src={backendUrl} controls style={{ maxWidth: 120, marginRight: 8 }} />
                          ) : (
                            <a href={backendUrl} target="_blank" rel="noopener noreferrer">{backendUrl}</a>
                          )}
                        </div>
                      );
                    })}
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

export default UpdateEventsPage;

              
              