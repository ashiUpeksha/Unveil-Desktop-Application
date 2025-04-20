import React from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const AddNewEventPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
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
        {/* White Box with Title + Form */}
        <Box
          sx={{
            backgroundColor: "white",
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
            Add New Event
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {[
              { label: "Event Type", type: "select", options: ["Music", "Art", "Tech", "Food"] },
              { label: "Event Name", type: "text", placeholder: "Event Name" },
              { label: "Date", type: "date" },
              { label: "Start Time", type: "text", placeholder: "Start Time" },
              { label: "End Time", type: "text", placeholder: "End Time" },
              { label: "Duration", type: "text", placeholder: "Duration" },
              { label: "Venue", type: "text", placeholder: "Venue" },
              { label: "Entrance Fee", type: "text", placeholder: "Entrance Fee" },
              { label: "Contact Number", type: "text", placeholder: "Contact Number" },
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
                    <option value="">Select {field.label}</option>
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

            {/* Description */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Description
              </Typography>
              <textarea
                placeholder="Description"
                rows={4}
                style={{
                  width: "90%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginTop: "5px",
                }}
              />
            </Box>

            {/* Special Guests */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Special Guests
              </Typography>
              <textarea
                placeholder="Special Guests"
                rows={4}
                style={{
                  width: "90%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginTop: "5px",
                }}
              />
            </Box>

            {/* Images and Videos of the Event */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Images and Videos of the Event
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/addimageorvideos')}
              >
                Add Images or Videos
              </Button>
            </Box>

            {/* Submit Button */}
            <Box sx={{ gridColumn: "span 3", textAlign: "right", mt: 2 }}>
              <Button variant="contained" color="primary">
                Submit
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddNewEventPage;