import React, { useState } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "../../components/Navbar";
import SecondSidebar from "../../components/SecondSidebar";

const AddRoll = () => {
  const [rollName, setRollName] = useState("");
  const [rollLevel, setRollLevel] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleSave = () => {
    const formData = {
      rollName,
      rollLevel,
      isActive,
    };
    console.log("Form Data:", formData);
    // Add save logic here
  };

  const handleBack = () => {
    console.log("Back button clicked");
    // Add navigation logic if needed
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
          position: "relative",
        }}
      >
        {/* Rectangular Icon-Only Back Button */}
        <Box sx={{ position: "absolute", top: 24, right: 40 }}>
          <IconButton
            onClick={handleBack}
            sx={{
              backgroundColor: "#007AFF",
              borderRadius: "4px",
              padding: "10px",
              "&:hover": {
                backgroundColor: "#005FCC",
              },
            }}
          >
            <ArrowBackIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>

        <Typography variant="h5" fontWeight="bold" mb={3}>
          Add Role
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          {/* Roll Name Section */}
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Roll Name</InputLabel>
              <Select
                value={rollName}
                onChange={(e) => setRollName(e.target.value)}
                label="Roll Name"
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Party Organizer">Party Organizer</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              }
              label="Active"
              sx={{ mt: 1 }}
            />
          </Box>

          {/* Roll Level Section */}
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Roll Level</InputLabel>
              <Select
                value={rollLevel}
                onChange={(e) => setRollLevel(e.target.value)}
                label="Roll Level"
              >
                <MenuItem value="Level 01">Level 01</MenuItem>
                <MenuItem value="Level 02">Level 02</MenuItem>
                <MenuItem value="Level 03">Level 03</MenuItem>
                <MenuItem value="Level 04">Level 04</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Save Button */}
        <Box
          sx={{
            position: "absolute",
            bottom: 120,
            right: 40,
          }}
        >
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "#007AFF",
              color: "#fff",
              px: 5,
              "&:hover": {
                backgroundColor: "#005FCC",
              },
            }}
          >
            SAVE
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddRoll;
