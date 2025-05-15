import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Switch,
  Button,
  IconButton,
  Grid,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import NewSecondSidebar from "../../components/NewSecondSidebar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AcceptEvent = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <NewSecondSidebar />

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
            Accept Event
          </Typography>
          <IconButton sx={{ backgroundColor: "#007AFF" }}>
            <ArrowBackIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>

        {/* Form */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Event type" size="small" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Event Name" size="small" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Date" size="small" />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Start Time" size="small" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="End Time" size="small" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Duration" size="small" />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Venue" size="small" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Entrance Fee" size="small" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Contact Number" size="small" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Description"
              size="small"
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Special Guests"
              size="small"
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Images and Videos of the event
            </Typography>
            {/* You can add an upload component here */}
          </Grid>

          {/* Active Toggle */}
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ mr: 2 }}>Active</Typography>
              <Switch
                checked={isActive}
                onChange={() => setIsActive(!isActive)}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FF3B30",
              color: "#fff",
              px: 5,
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
              px: 5,
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

export default AcceptEvent;
