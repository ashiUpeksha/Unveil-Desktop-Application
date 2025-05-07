import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

const UpdateEventsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const eventData = location.state?.event || {};

  const [formData, setFormData] = useState({
    type: "",
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    duration: "",
    venue: "",
    entranceFee: "",
    contactNumber: "",
    description: "",
    specialGuests: "",
  });

  useEffect(() => {
    if (eventData) {
      setFormData({
        type: eventData.type || "",
        name: eventData.name || "",
        date: eventData.date || "",
        startTime: eventData.startTime || "",
        endTime: eventData.endTime || "",
        duration: eventData.duration || "",
        venue: eventData.venue || "",
        entranceFee: eventData.entranceFee || "",
        contactNumber: eventData.contactNumber || "",
        description: eventData.description || "",
        specialGuests: eventData.specialGuests || "",
      });
    }
  }, [eventData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle API update call here using formData
    console.log("Updated Event Data:", formData);
    // After update, redirect or show success message
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />

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
        <Box
          sx={{
            backgroundColor: "white",
            p: 3,
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
            Update Event
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
              gap: 2,
            }}
          >
            {[
              {
                label: "Event Type",
                name: "type",
                type: "select",
                options: ["Music", "Art", "Tech", "Food"],
              },
              {
                label: "Event Name",
                name: "name",
                type: "text",
                placeholder: "Event Name",
              },
              {
                label: "Date",
                name: "date",
                type: "date",
              },
              {
                label: "Start Time",
                name: "startTime",
                type: "text",
                placeholder: "Start Time",
              },
              {
                label: "End Time",
                name: "endTime",
                type: "text",
                placeholder: "End Time",
              },
              {
                label: "Duration",
                name: "duration",
                type: "text",
                placeholder: "Duration",
              },
              {
                label: "Venue",
                name: "venue",
                type: "text",
                placeholder: "Venue",
              },
              {
                label: "Entrance Fee",
                name: "entranceFee",
                type: "text",
                placeholder: "Entrance Fee",
              },
              {
                label: "Contact Number",
                name: "contactNumber",
                type: "text",
                placeholder: "Contact Number",
              },
            ].map((field, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  {field.label}
                </Typography>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
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
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
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
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Description"
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
                name="specialGuests"
                value={formData.specialGuests}
                onChange={handleChange}
                rows={4}
                placeholder="Special Guests"
                style={{
                  width: "90%",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginTop: "5px",
                }}
              />
            </Box>

            {/* Media */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Images and Videos of the Event
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/addimageorvideos')}
              >
                Show Images or Videos
              </Button>
            </Box>

            {/* Submit Button */}
            <Box sx={{ gridColumn: "span 3", textAlign: "right", mt: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                UPDATE
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateEventsPage;
