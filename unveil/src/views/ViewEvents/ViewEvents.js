import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

const ViewEvents = () => {
  const [userId, setUserId] = useState(""); 
  const [eventData, setEventData] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [filters, setFilters] = useState({
    eventType: "",
    eventName: "",
    startDate: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Parse localStorage.user as JSON
    const userObj = JSON.parse(localStorage.user || "{}");
    setUserId(userObj.userId || "");

    // Fetch events for this user
    if (userObj.userId) {
      fetch(`http://localhost:3000/api/events?userId=${userObj.userId}`)
        .then(res => res.json())
        .then(data => {
          setEventData(data.events || []);
        })
        .catch(err => {
          console.error("Failed to fetch events:", err);
          setEventData([]);
        });
    }

    // Fetch event types from backend
    fetch("http://localhost:3000/api/eventTypes")
      .then(res => res.json())
      .then(data => setEventTypes(data || []))
      .catch(err => {
        console.error("Failed to fetch event types:", err);
        setEventTypes([]);
      });
  }, []);

  const handleEdit = (event) => {
    navigate("/updateevents", { state: { event } });
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Filtered events based on filters
  const filteredEvents = eventData.filter(event => {
    // Event Type filter
    if (filters.eventType && event.event_type !== filters.eventType) return false;
    // Status filter
    if (filters.status) {
      if (filters.status === "Pending" && event.status !== 1) return false;
      if (filters.status === "Approved" && event.status !== 2) return false;
      if (filters.status === "Rejected" && event.status !== 3) return false;
    }
    // Event Name filter (case-insensitive substring match)
    if (
      filters.eventName &&
      !event.event_name?.toLowerCase().includes(filters.eventName.toLowerCase())
    )
      return false;
    // Start Date filter (compare only date part)
    if (
      filters.startDate &&
      (!event.event_start_date ||
        event.event_start_date.substring(0, 10) !== filters.startDate)
    )
      return false;
    return true;
  });

  return (
    <Box sx={{ display: "flex" }}>
      {/* Navbar at top */}
      <Navbar />

      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#C6C6C6",
          p: 3,
          mt: 8,
          minHeight: "100vh",
        }}
      >
        {/* white background */}
        <Box
          sx={{
            backgroundColor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            position: "relative",
            maxWidth: "96vw",
            margin: "0 auto"
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
            Events
          </Typography>

          {/* Filter fields */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 3,
              mb: 2,
              alignItems: "end",
              mx: 0, // Remove extra margin here
            }}
          >
            {/* Status Dropdown */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Status
              </Typography>
              <FormControl fullWidth>
                <Select
                  variant="outlined"
                  value={filters.status || ""}
                  displayEmpty
                  onChange={e => handleFilterChange("status", e.target.value)}
                  sx={{
                    background: "#fff",
                    height: 50,
                    borderRadius: "8px",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ccc",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#863F55",
                    },
                    fontSize: 16,
                    pl: 2,
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: "8px",
                        mt: 1,
                      },
                    },
                  }}
                >
                  <MenuItem value="">-Select Status-</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {/* Event Type */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Event Type
              </Typography>
              <FormControl fullWidth>
                <Select
                  variant="outlined"
                  value={filters.eventType}
                  displayEmpty
                  onChange={e => handleFilterChange("eventType", e.target.value)}
                  sx={{
                    background: "#fff",
                    height: 50,
                    borderRadius: "8px",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ccc",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#863F55",
                    },
                    fontSize: 16,
                    pl: 2,
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        borderRadius: "8px",
                        mt: 1,
                      },
                    },
                  }}
                >
                  <MenuItem value="">-Select Event Type-</MenuItem>
                  {eventTypes.map((opt, i) => (
                    <MenuItem key={i} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {/* Event Name */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Event Name
              </Typography>
              <TextField
                fullWidth
                placeholder="Event Name"
                value={filters.eventName}
                onChange={e => handleFilterChange("eventName", e.target.value)}
                variant="outlined"
                sx={{
                  background: "#fff",
                  height: 50,
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    height: 50,
                    borderRadius: "8px",
                    fontSize: 16,
                    pl: 2,
                    "& fieldset": {
                      borderColor: "#ccc",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#863F55",
                    },
                  },
                }}
                InputProps={{
                  style: {
                    height: 50,
                    borderRadius: "8px",
                    fontSize: 16,
                    paddingLeft: 16,
                    background: "#fff",
                  },
                }}
              />
            </Box>
          </Box>
          {/* Table of events */}
          <Box mt={4} sx={{ mx: 0 }}>
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f3f3f3" }}>
                    <TableCell>
                      <strong>Event Type</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Event Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Start Date</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Venue</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Status</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Action</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEvents.map((event, index) => {
                    let displayDate = "";
                    if (event.event_start_date) {
                      // Format as M/D/YYYY (no leading zeros)
                      const dateObj = new Date(event.event_start_date);
                      displayDate = `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
                    }
                    // Status label logic and color
                    let statusLabel = "Pending...";
                    let statusColor = "#007AFF";
                    if (event.status === 2) {
                      statusLabel = "Approved";
                      statusColor = "#00FF15";
                    } else if (event.status === 3) {
                      statusLabel = "Rejected";
                      statusColor = "#FF0004";
                    }
                    return (
                      <TableRow key={index}>
                        <TableCell>{event.event_type}</TableCell>
                        <TableCell>{event.event_name}</TableCell>
                        <TableCell>{displayDate}</TableCell>
                        <TableCell>{event.event_venue}</TableCell>
                        <TableCell>
                          <span style={{ color: statusColor, fontWeight: 500 }}>
                            {statusLabel}
                          </span>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            onClick={() => handleEdit(event)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            aria-label="delete"
                            onClick={() => navigate("/deleteevent", { state: { event } })}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewEvents;