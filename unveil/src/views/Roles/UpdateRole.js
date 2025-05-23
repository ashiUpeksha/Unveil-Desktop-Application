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

const UpdateRole = () => {
  const [roleName, setRoleName] = useState("Admin"); // Pre-filled for example
  const [roleLevel, setRoleLevel] = useState("Level 01");
  const [isActive, setIsActive] = useState(true);

  const handleUpdate = () => {
    const updatedData = {
      roleName,
      roleLevel,
      isActive,
    };
    console.log("Updated Data:", updatedData);
    // Add update logic here
  };

  const handleBack = () => {
    console.log("Back button clicked");
    // Add navigation logic here
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
          Update Role
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          {/* Role Name Section */}
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Role Name</InputLabel>
              <Select
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                label="Role Name"
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

          {/* Role Level Section */}
          <Box sx={{ flex: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Role Level</InputLabel>
              <Select
                value={roleLevel}
                onChange={(e) => setRoleLevel(e.target.value)}
                label="Role Level"
              >
                <MenuItem value="Level 01">Level 01</MenuItem>
                <MenuItem value="Level 02">Level 02</MenuItem>
                <MenuItem value="Level 03">Level 03</MenuItem>
                <MenuItem value="Level 04">Level 04</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Update Button */}
        <Box
          sx={{
            position: "absolute",
            bottom: 120,
            right: 40,
          }}
        >
          <Button
            variant="contained"
            onClick={handleUpdate}
            sx={{
              backgroundColor: "#007AFF",
              color: "#fff",
              px: 5,
              "&:hover": {
                backgroundColor: "#005FCC",
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

export default UpdateRole;
