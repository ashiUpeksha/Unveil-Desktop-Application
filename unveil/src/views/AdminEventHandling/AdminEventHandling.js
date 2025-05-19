import React, { useEffect } from "react";
import NavBar from "../../components/Navbar";
import AdminDashBoardSidebar from "../../components/AdminSidebar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

const statusOptions = [
  { value: "", label: "-Select Status-" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
  // ...add more as needed
];

const AdminEventHandling = () => {
  const [status, setStatus] = React.useState("");
  const [eventType, setEventType] = React.useState("");
  const [eventName, setEventName] = React.useState("");
  const [eventTypeOptions, setEventTypeOptions] = React.useState([
    { value: "", label: "-Select Event Type-" },
  ]);
  const [events, setEvents] = React.useState([]);

  useEffect(() => {
    // Fetch event types from backend
    axios
      .get("http://localhost:3000/api/eventTypes")
      .then((res) => {
        const options = [
          { value: "", label: "-Select Event Type-" },
          ...res.data.map((type) => ({
            value: type,
            label: type,
          })),
        ];
        setEventTypeOptions(options);
      })
      .catch(() => {
        setEventTypeOptions([{ value: "", label: "-Select Event Type-" }]);
      });

    // Fetch all events from backend
    axios
      .get("http://localhost:3000/api/allEvents")
      .then((res) => {
        setEvents(res.data.events || []);
      })
      .catch(() => setEvents([]));
  }, []);

  return (
    <>
      <NavBar />
      <Box sx={{ display: "flex" }}>
        <AdminDashBoardSidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            background: "#c4c4c4",
            minHeight: "100vh",
          }}
        >
          <Card
            sx={{
              maxWidth: "95%",
              margin: "0 auto",
              borderRadius: 3,
              boxShadow: 6,
              p: 2,
              background: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
                Events
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  mb: 4,
                  flexWrap: "wrap",
                  alignItems: "flex-end",
                }}
              >
                {/* Status Dropdown */}
                <Box sx={{ flex: 1, minWidth: 220 }}>
                  <Typography sx={{ mb: 1, fontWeight: 500 }}>
                    Status
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel id="event-status-label" shrink={false}></InputLabel>
                    <Select
                      labelId="event-status-label"
                      value={status}
                      displayEmpty
                      onChange={(e) => setStatus(e.target.value)}
                      sx={{ background: "#fff" }}
                    >
                      {statusOptions.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                {/* Event Type Dropdown */}
                <Box sx={{ flex: 1, minWidth: 220 }}>
                  <Typography sx={{ mb: 1, fontWeight: 500 }}>
                    Event Type
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel id="event-type-label" shrink={false}></InputLabel>
                    <Select
                      labelId="event-type-label"
                      value={eventType}
                      displayEmpty
                      onChange={(e) => setEventType(e.target.value)}
                      sx={{ background: "#fff" }}
                    >
                      {eventTypeOptions.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                {/* Event Name Textbox */}
                <Box sx={{ flex: 1, minWidth: 220 }}>
                  <Typography sx={{ mb: 1, fontWeight: 500 }}>
                    Event Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Event Name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    sx={{ background: "#fff" }}
                  />
                </Box>
              </Box>
              <TableContainer
                component={Paper}
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  mt: 2,
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Event Type
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Event Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Start Date
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Venue
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Status
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No events found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      events.map((event) => (
                        <TableRow key={event.event_id}>
                          <TableCell>{event.event_type}</TableCell>
                          <TableCell>{event.event_name}</TableCell>
                          <TableCell>
                            {event.event_start_date
                              ? new Date(event.event_start_date).toLocaleDateString()
                              : ""}
                          </TableCell>
                          <TableCell>{event.event_venue}</TableCell>
                          <TableCell>{event.status || "Pending"}</TableCell>
                          <TableCell>
                            {/* Placeholder for actions */}
                            <button>View</button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};

export default AdminEventHandling;