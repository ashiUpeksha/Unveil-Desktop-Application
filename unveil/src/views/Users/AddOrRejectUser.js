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

const AddOrRejectUser = () => {
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
        {/* Top Row with Title and Back Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 3,
            alignItems: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Accept or Reject User
          </Typography>
          <IconButton sx={{ backgroundColor: "#007AFF" }}>
            <ArrowBackIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>

        {/* Form Fields */}
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(3, 1fr)", mb: 2 }}>
          {/* Row 1 */}
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

          {/* Row 2 */}
          <TextField label="Organizing Name" fullWidth />
          <TextField label="First Name" fullWidth />
          <TextField label="Last Name" fullWidth />

          {/* Row 3 */}
          <TextField label="Address" fullWidth multiline rows={1} sx={{ gridColumn: "span 3" }} />
          <TextField label="Description" fullWidth multiline rows={2} sx={{ gridColumn: "span 3" }} />

          {/* Row 4 */}
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

          {/* Row 5 */}
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

          {/* Active and Locked Switch */}
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

        {/* Accept and Reject Buttons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FF3B30",
              color: "#fff",
              px: 4,
              "&:hover": {
                backgroundColor: "#D32F2F",
              },
            }}
          >
            REJECT
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              px: 4,
              "&:hover": {
                backgroundColor: "#388E3C",
              },
            }}
          >
            ACCEPT
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddOrRejectUser;
