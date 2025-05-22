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
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
            Events
          </Typography>

          {/* Filter fields */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" }, // 4 columns now
              gap: 2,
            }}
          >
            {/* Event Type */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Event Type
              </Typography>
              <select
                style={{
                  width: "90%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginTop: "5px",
                }}
                value={filters.eventType}
                onChange={e => handleFilterChange("eventType", e.target.value)}
              >
                <option value="">-Select event type-</option>
                {eventTypes.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </Box>
            {/* Status Dropdown */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Status
              </Typography>
              <select
                style={{
                  width: "90%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginTop: "5px",
                }}
                value={filters.status || ""}
                onChange={e => handleFilterChange("status", e.target.value)}
              >
                <option value="">-Select status-</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </Box>
            {/* Event Name */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Event Name
              </Typography>
              <input
                type="text"
                placeholder="Event Name"
                style={{
                  width: "90%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginTop: "5px",
                }}
                value={filters.eventName}
                onChange={e => handleFilterChange("eventName", e.target.value)}
              />
            </Box>
            {/* Start Date */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Start Date
              </Typography>
              <input
                type="date"
                style={{
                  width: "90%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginTop: "5px",
                }}
                value={filters.startDate}
                onChange={e => handleFilterChange("startDate", e.target.value)}
              />
            </Box>
          </Box>

          {/* Table of events */}
          <Box mt={4}>
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