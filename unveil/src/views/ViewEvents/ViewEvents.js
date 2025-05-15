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
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {[ 
              {
                label: "Event Type",
                type: "select",
                options: eventTypes, // <-- use fetched event types
              },
              { label: "Event Name", type: "text", placeholder: "Event Name" },
              { label: "Start Date", type: "date" },
            ].map((field, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {field.label}
                </Typography>
                {field.type === "select" ? (
                  <select
                    style={{
                      width: "90%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      marginTop: "5px",
                    }}
                  >
                    <option value="">-Select event type-</option>
                    {field.options.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    placeholder={field.placeholder || ""}
                    style={{
                      width: "90%",
                      padding: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      marginTop: "5px",
                    }}
                  />
                )}
              </Box>
            ))}
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
                      <strong>Action</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventData.map((event, index) => {
                    let displayDate = "";
                    if (event.event_start_date) {
                      // Always use the first 10 characters if it's a string (YYYY-MM-DD)
                      if (typeof event.event_start_date === "string") {
                        displayDate = event.event_start_date.substring(0, 10);
                      } else {
                        // If it's a Date object or something else, fallback to toString
                        displayDate = event.event_start_date.toString().substring(0, 10);
                      }
                    }
                    // If you want to force UTC and avoid timezone shift, do NOT use new Date()
                    return (
                      <TableRow key={index}>
                        <TableCell>{event.event_type}</TableCell>
                        <TableCell>{event.event_name}</TableCell>
                        <TableCell>{displayDate}</TableCell>
                        <TableCell>{event.event_venue}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            onClick={() => handleEdit(event)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" aria-label="delete">
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