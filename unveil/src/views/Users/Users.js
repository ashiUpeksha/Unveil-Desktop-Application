import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import SecondSidebar from "../../components/SecondSidebar";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";

const Users = () => {
  const [userType, setUserType] = useState("");

  const handleChange = (event) => {
    setUserType(event.target.value);
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
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            User
          </Typography>
          <IconButton
            color="primary"
            sx={{
              backgroundColor: "#007AFF",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#0062cc",
              },
            }}
          >
            <AddBoxIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>

        {/* User Type Dropdown */}
        <Box sx={{ maxWidth: 300 }}>
          <FormControl
            fullWidth
            variant="outlined"
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <InputLabel>User Type</InputLabel>
            <Select
              value={userType}
              label="User Type"
              onChange={handleChange}
              MenuProps={{
                PaperProps: {
                  sx: {
                    mt: 1, // Add margin to prevent overlap with label
                    borderRadius: 2,
                    boxShadow: 3,
                  },
                },
              }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="organizer">Party organizer</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
};

export default Users;
