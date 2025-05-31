import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';
import {
  LocalizationProvider,
  DateTimePicker,
  TimePicker
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

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

const AdminDeleteEventPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogSuccess, setDialogSuccess] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
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

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!eventId) return;
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    try {
      const res = await fetch(`http://localhost:3000/api/event/${eventId}/deactivate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        setResultDialogMsg("Event deleted successfully.");
        setResultDialogType("success");
        setResultDialogOpen(true);
      } else {
        const data = await res.json();
        setResultDialogMsg(data.error || "Failed to delete event.");
        setResultDialogType("error");
        setResultDialogOpen(true);
      }
    } catch (err) {
      setResultDialogMsg("Failed to delete event.");
      setResultDialogType("error");
      setResultDialogOpen(true);
    }
  };

  // const handleDialogClose = () => {
  //   setDialogOpen(false);
  //   if (dialogSuccess) {
  //     navigate("/viewevents");
  //   }
  // };

  return (
    <Box sx={{ display: "flex" }}>
      <AdminNavbar />
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#C6C6C6", p: 3, mt: 8, minHeight: "100vh" }}>
        <Box sx={{ backgroundColor: "white", p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>Delete Event</Typography>
          <form onSubmit={handleDelete}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
              {/* Event Type */}
              <Box>
                <Typography variant="subtitle1">Event Type</Typography>
                <input
                  type="text"
                  name="eventType"
                  style={{ ...inputStyle, backgroundColor: "#f0f0f0", cursor: "not-allowed", color: "#000" }}
                  value={eventType}
                  readOnly
                  disabled
                />
              </Box>
              {/* Event Name */}
              <Box>
                <Typography variant="subtitle1">Event Name</Typography>
                <input
                  type="text"
                  name="eventName"
                  placeholder="Event Name"
                  style={{ ...inputStyle, backgroundColor: "#f0f0f0", cursor: "not-allowed", color: "#000" }}
                  value={eventName}
                  readOnly
                  disabled
                />
              </Box>
              {/* Venue */}
              <Box>
                <Typography variant="subtitle1">Venue</Typography>
                <input
                  type="text"
                  name="venue"
                  placeholder="Venue"
                  style={{ ...inputStyle, backgroundColor: "#f0f0f0", cursor: "not-allowed", color: "#000" }}
                  value={venue}
                  readOnly
                  disabled
                />
              </Box>
              {/* Start Date and Time */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box>
                  <Typography variant="subtitle1">Start Date</Typography>
                  <DateTimePicker
                    value={startDate}
                    onChange={() => {}}
                    views={['year', 'month', 'day']}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: "MM/DD/YYYY",
                        size: "medium",
                        InputProps: {
                          readOnly: true,
                          disabled: true,
                          style: { backgroundColor: "#f0f0f0", cursor: "not-allowed" }
                        },
                        inputProps: { style: { color: "#000" } }
                      },
                    }}
                    disabled
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle1">Start Time</Typography>
                  <TimePicker
                    value={startTime}
                    onChange={() => {}}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: "hh:mm aa",
                        size: "medium",
                        InputProps: {
                          readOnly: true,
                          disabled: true,
                          style: { backgroundColor: "#f0f0f0", cursor: "not-allowed" }
                        },
                        inputProps: { style: { color: "#000" } }
                      },
                    }}
                    disabled
                  />
                </Box>
                {/* End Date and Time */}
                <Box>
                  <Typography variant="subtitle1">End Date</Typography>
                  <DateTimePicker
                    value={endDate}
                    onChange={() => {}}
                    views={['year', 'month', 'day']}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: "MM/DD/YYYY",
                        size: "medium",
                        InputProps: {
                          readOnly: true,
                          disabled: true,
                          style: { backgroundColor: "#f0f0f0", cursor: "not-allowed" }
                        },
                        inputProps: { style: { color: "#000" } }
                      },
                    }}
                    disabled
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle1">End Time</Typography>
                  <TimePicker
                    value={endTime}
                    onChange={() => {}}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        placeholder: "hh:mm aa",
                        size: "medium",
                        InputProps: {
                          readOnly: true,
                          disabled: true,
                          style: { backgroundColor: "#f0f0f0", cursor: "not-allowed" }
                        },
                        inputProps: { style: { color: "#000" } }
                      },
                    }}
                    disabled
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
                  style={{ ...inputStyle, backgroundColor: "#f0f0f0", cursor: "not-allowed", color: "#000" }}
                  readOnly
                  disabled
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
                  style={{ ...inputStyle, backgroundColor: "#f0f0f0", cursor: "not-allowed", color: "#000" }}
                  value={entranceFee}
                  readOnly
                  disabled
                />
              </Box>
              {/* Contact Number */}
              <Box>
                <Typography variant="subtitle1">Contact Number</Typography>
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="Contact Number"
                  style={{ ...inputStyle, backgroundColor: "#f0f0f0", cursor: "not-allowed", color: "#000" }}
                  value={contactNumber}
                  readOnly
                  disabled
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
                  style={{ ...textareaStyle, backgroundColor: "#f0f0f0", cursor: "not-allowed", color: "#000" }}
                  value={venueAddress}
                  readOnly
                  disabled
                />
              </Box>
              <Box>
                <Typography variant="subtitle1">Description</Typography>
                <textarea
                  name="description"
                  placeholder="Description"
                  style={{ ...textareaStyle, backgroundColor: "#f0f0f0", cursor: "not-allowed", color: "#000" }}
                  value={description}
                  readOnly
                  disabled
                />
              </Box>
              <Box>
                <Typography variant="subtitle1">Special Guests</Typography>
                <textarea
                  name="specialGuests"
                  placeholder="Special Guests"
                  style={{ ...textareaStyle, backgroundColor: "#f0f0f0", cursor: "not-allowed", color: "#000" }}
                  value={specialGuests}
                  readOnly
                  disabled
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
                    {media.map((url, idx) => (
                      <div key={idx}>
                        {url.match(/\.(jpg|jpeg|png)$/i) ? (
                          <img src={url} alt="event media" style={{ maxWidth: 120, marginRight: 8 }} />
                        ) : url.match(/\.(mp4)$/i) ? (
                          <video src={url} controls style={{ maxWidth: 120, marginRight: 8 }} />
                        ) : (
                          <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
                        )}
                      </div>
                    ))}
                  </Box>
                )}
              </Box>
              {/* Submit Button */}
              <Box sx={{ gridColumn: "span 3", textAlign: "right", mt: 2 }}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: "#FF0004",
                    color: "#fff",
                    '&:hover': { backgroundColor: "#d90004" }
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ textAlign: "center" }}>
          <WarningAmberIcon sx={{ color: "#FF9800", fontSize: 60 }} />
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Are you sure you want to delete this event?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              backgroundColor: "#FF0004",
              color: "#fff",
              '&:hover': { backgroundColor: "#d90004" }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* Result Dialog for success/error */}
      <Dialog
        open={resultDialogOpen}
        onClose={() => {
          setResultDialogOpen(false);
          if (resultDialogType === "success") {
            navigate("/viewevents");
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
              navigate("/admineventhandling");
            }
          }} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDeleteEventPage;