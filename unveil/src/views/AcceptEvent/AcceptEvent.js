import React, { useEffect, useState } from "react";
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import AdminNavbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';
import {
  LocalizationProvider,
  DateTimePicker,
  TimePicker
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

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

const AcceptEvent = () => {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");
  const [dialogType, setDialogType] = useState(""); // "success" or "reject"
  const [selectedStatus, setSelectedStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (eventId) {
      axios.get(`http://localhost:3000/api/event/${eventId}`)
        .then(res => {
          setEventData(res.data);
          setSelectedStatus(res.data.status); // Save status for button highlight
          // Set date/time pickers
          setStartDate(res.data.event_start_date ? dayjs(res.data.event_start_date) : null);
          setStartTime(res.data.event_start_time ? dayjs(res.data.event_start_time, "HH:mm:ss") : null);
          setEndDate(res.data.event_end_date ? dayjs(res.data.event_end_date) : null);
          setEndTime(res.data.event_end_time ? dayjs(res.data.event_end_time, "HH:mm:ss") : null);
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

  // Helper to get duration as "X days Y hours Z minutes"
  const getDurationString = (start, end) => {
    if (!start || !end) return "";
    const diff = end.diff(start, 'minute');
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

  const handleStatusUpdate = async (newStatus) => {
    if (!eventId) return;
    try {
      await axios.put(`http://localhost:3000/api/event/${eventId}/status`, { status: newStatus });
      setSelectedStatus(newStatus); // Update highlight immediately
      if (newStatus === 2) {
        setDialogMsg("Event Approved Successfully!");
        setDialogType("success");
      } else {
        setDialogMsg("Event Rejected Successfully!");
        setDialogType("reject");
      }
      setDialogOpen(true);
    } catch (err) {
      setDialogMsg("Failed to update status");
      setDialogType("");
      setDialogOpen(true);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AdminNavbar />
      <AdminSidebar />
      <Box component="main" sx={{ flexGrow: 1, backgroundColor: "#C6C6C6", p: 3, mt: 8, minHeight: "100vh" }}>
        <Box sx={{ backgroundColor: "white", p: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>Approve or Reject Event</Typography>
          <form>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2 }}>
              {/* Event Type */}
              <Box>
                <Typography variant="subtitle1">Event Type</Typography>
                <input
                  type="text"
                  name="eventType"
                  style={inputStyle}
                  value={eventData?.event_type || ""}
                  readOnly
                />
              </Box>
              {/* Event Name */}
              <Box>
                <Typography variant="subtitle1">Event Name</Typography>
                <input
                  type="text"
                  name="eventName"
                  style={inputStyle}
                  value={eventData?.event_name || ""}
                  readOnly
                />
              </Box>
              {/* Venue */}
              <Box>
                <Typography variant="subtitle1">Venue</Typography>
                <input
                  type="text"
                  name="venue"
                  style={inputStyle}
                  value={eventData?.event_venue || ""}
                  readOnly
                />
              </Box>
              {/* Start Date and Time */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box>
                  <Typography variant="subtitle1">Start Date</Typography>
                  <TextField
                    value={startDate ? startDate.format("MM/DD/YYYY") : ""}
                    InputProps={{
                      readOnly: true,
                      style: { color: "#000", fontWeight: 500, background: "#f5f5f5" }
                    }}
                    fullWidth
                    placeholder="MM/DD/YYYY"
                    size="medium"
                    variant="outlined"
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle1">Start Time</Typography>
                  <TextField
                    value={startTime ? startTime.format("hh:mm A") : ""}
                    InputProps={{
                      readOnly: true,
                      style: { color: "#000", fontWeight: 500, background: "#f5f5f5" }
                    }}
                    fullWidth
                    placeholder="hh:mm aa"
                    size="medium"
                    variant="outlined"
                  />
                </Box>
                {/* End Date and Time */}
                <Box>
                  <Typography variant="subtitle1">End Date</Typography>
                  <TextField
                    value={endDate ? endDate.format("MM/DD/YYYY") : ""}
                    InputProps={{
                      readOnly: true,
                      style: { color: "#000", fontWeight: 500, background: "#f5f5f5" }
                    }}
                    fullWidth
                    placeholder="MM/DD/YYYY"
                    size="medium"
                    variant="outlined"
                  />
                </Box>
                <Box>
                  <Typography variant="subtitle1">End Time</Typography>
                  <TextField
                    value={endTime ? endTime.format("hh:mm A") : ""}
                    InputProps={{
                      readOnly: true,
                      style: { color: "#000", fontWeight: 500, background: "#f5f5f5" }
                    }}
                    fullWidth
                    placeholder="hh:mm aa"
                    size="medium"
                    variant="outlined"
                  />
                </Box>
              </LocalizationProvider>
              {/* Duration */}
              <Box>
                <Typography variant="subtitle1">Duration</Typography>
                <input
                  type="text"
                  name="duration"
                  style={{ ...inputStyle, backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                  readOnly
                  value={
                    eventStartDateTime && eventEndDateTime
                      ? getDurationString(eventStartDateTime, eventEndDateTime)
                      : eventData?.event_duration || ""
                  }
                />
              </Box>
              {/* Entrance Fee */}
              <Box>
                <Typography variant="subtitle1">Entrance Fee</Typography>
                <input
                  type="text"
                  name="entranceFee"
                  style={inputStyle}
                  value={eventData?.entrance_fee || ""}
                  readOnly
                />
              </Box>
              {/* Contact Number */}
              <Box>
                <Typography variant="subtitle1">Contact Number</Typography>
                <input
                  type="text"
                  name="contactNumber"
                  style={inputStyle}
                  value={eventData?.contact_number || ""}
                  readOnly
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
                  style={textareaStyle}
                  value={eventData?.event_venue_address || ""}
                  readOnly
                />
              </Box>
              <Box>
                <Typography variant="subtitle1">Description</Typography>
                <textarea
                  name="description"
                  style={textareaStyle}
                  value={eventData?.description || ""}
                  readOnly
                />
              </Box>
              <Box>
                <Typography variant="subtitle1">Special Guests</Typography>
                <textarea
                  name="specialGuests"
                  style={textareaStyle}
                  value={eventData?.special_guests || ""}
                  readOnly
                />
              </Box>
              {/* Images and Videos Field */}
              <Box sx={{ gridColumn: { xs: "span 1", sm: "span 3" } }}>
                <Typography variant="subtitle1">Images and Videos of the Event</Typography>
                <Button variant="contained" color="primary" >
                  Show Media
                </Button>
              </Box>
              
              
              <Box
                sx={{
                  gridColumn: "span 3",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  variant={selectedStatus === 3 ? "contained" : "outlined"}
                  sx={{
                    backgroundColor: selectedStatus === 3 ? "#FF3B30" : "transparent",
                    color: selectedStatus === 3 ? "#fff" : "#FF3B30",
                    borderColor: "#FF3B30",
                    px: 5,
                    fontWeight: selectedStatus === 3 ? "bold" : "normal",
                    borderWidth: selectedStatus === 3 ? 2 : 1,
                    boxShadow: selectedStatus === 3 ? "0 0 8px #FF3B30" : "none",
                    "&:hover": {
                      backgroundColor: "#D32F2F",
                      color: "#fff",
                      borderColor: "#D32F2F",
                    },
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleStatusUpdate(3); // 3 = Rejected
                  }}
                >
                  REJECT
                </Button>
                <Button
                  variant={selectedStatus === 2 ? "contained" : "outlined"}
                  sx={{
                    backgroundColor: selectedStatus === 2 ? "#4CAF50" : "transparent",
                    color: selectedStatus === 2 ? "#fff" : "#4CAF50",
                    borderColor: "#4CAF50",
                    px: 5,
                    fontWeight: selectedStatus === 2 ? "bold" : "normal",
                    borderWidth: selectedStatus === 2 ? 2 : 1,
                    boxShadow: selectedStatus === 2 ? "0 0 8px #4CAF50" : "none",
                    "&:hover": {
                      backgroundColor: "#388E3C",
                      color: "#fff",
                      borderColor: "#388E3C",
                    },
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleStatusUpdate(2); // 2 = Approved
                  }}
                >
                  ACCEPT
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
        {/* Dialog for status update result */}
        <Dialog open={dialogOpen} onClose={() => {
          setDialogOpen(false);
          navigate("/admineventhandling");
        }}>
          <DialogTitle>Status Update</DialogTitle>
          <DialogContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {dialogType === "success" && (
              <CheckCircleIcon sx={{ color: "#00C853", fontSize: 40 }} />
            )}
            {dialogType === "reject" && (
              <CancelIcon sx={{ color: "#FF1744", fontSize: 40 }} />
            )}
            <Typography>{dialogMsg}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              setDialogOpen(false);
              navigate("/admineventhandling");
            }} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AcceptEvent;