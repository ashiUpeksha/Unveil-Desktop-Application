import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Switch,
  Button,
  IconButton,
  OutlinedInput,
  Checkbox,
  ListItemText,
  InputAdornment,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import SecondSidebar from "../../components/SecondSidebar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const eventOptions = ["Musical", "Beach parties", "Night parties"];

const UpdateUser = () => {
  const [userType, setUserType] = useState("");
  const [eventTypes, setEventTypes] = useState([]);
  const [locked, setLocked] = useState(false);
  const [active, setActive] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleEventChange = (event) => {
    const {
      target: { value },
    } = event;
    setEventTypes(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <SecondSidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#F7F2F0",
          p: 3,
          mt: 8,
          minHeight: "100vh",
        }}
      >
        {/* Top Row */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Update User
          </Typography>
          <IconButton sx={{ backgroundColor: "#007AFF" }}>
            <ArrowBackIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>

        {/* Form */}
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(3, 1fr)", mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>User Type</InputLabel>
            <Select value={userType} label="User Type" onChange={(e) => setUserType(e.target.value)}>
              <MenuItem value="">--Select user type--</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="organizer">Party Organizer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <TextField label="Contact Number" fullWidth />
          <TextField label="Email" fullWidth />

          <TextField label="Organizing Name" fullWidth />
          <TextField label="First Name" fullWidth />
          <TextField label="Last Name" fullWidth />

          <TextField label="Address" fullWidth multiline rows={1} sx={{ gridColumn: "span 3" }} />
          <TextField label="Description" fullWidth multiline rows={2} sx={{ gridColumn: "span 3" }} />

          <TextField label="Username" fullWidth />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((show) => !show)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirmed Password"
            type={showConfirm ? "text" : "password"}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm((show) => !show)} edge="end">
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
            <InputLabel>Events types</InputLabel>
            <Select
              multiple
              value={eventTypes}
              onChange={handleEventChange}
              input={<OutlinedInput label="Events types" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {eventOptions.map((event) => (
                <MenuItem key={event} value={event}>
                  <Checkbox checked={eventTypes.indexOf(event) > -1} />
                  <ListItemText primary={event} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", flexDirection: "column", pl: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography sx={{ mr: 2 }}>Active</Typography>
              <Switch checked={active} onChange={() => setActive(!active)} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ mr: 2 }}>Locked</Typography>
              <Switch checked={locked} onChange={() => setLocked(!locked)} />
            </Box>
          </Box>
        </Box>

        {/* Update Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1976D2",
              color: "#fff",
              px: 5,
              "&:hover": {
                backgroundColor: "#115293",
              },
            }}
          >
            UPDATE
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateUser;
