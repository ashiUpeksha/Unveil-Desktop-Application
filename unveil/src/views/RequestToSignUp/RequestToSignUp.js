import { Grid, Box, Typography, TextField, MenuItem, Select, FormControl, Checkbox, ListItemText, Button } from "@mui/material";
import { useState } from "react";

export default function TwoPartLayout() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

  const handleChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  const handleSubmit = () => {
    alert("Form Submitted!");
  };

  return (
    <Grid
      container
      sx={{
        minHeight: "100vh",  // Ensures it covers full screen height
        overflow: "hidden",  // Prevents scrolling
      }}
    >
      {/* Left Side */}
      <Grid item xs={6}>
        <Box
          sx={{
            bgcolor: "#000000",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            p: 2,
          }}
        >
          <img src="/static/logo.png" alt="Logo" style={{ width: "300px", height: "auto", marginBottom: "20px" }} />
          <Typography
            variant="h2"
            sx={{
              background: "linear-gradient(90deg, #FFD874, #FF407A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "Sansita One",
              fontWeight: "bold",
              mt: -1,
            }}
          >
            U  n  v  e  i  l
          </Typography>

          <Typography
            variant="h4"
            sx={{
              background: "linear-gradient(90deg, #FFD874, #FF407A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              mt: -1,
            }}
          >
            Only for party lovers...
          </Typography>
        </Box>
      </Grid>

      {/* Right Side */}
      <Grid item xs={6}>
        <Box sx={{ bgcolor: "#FDF8F8", height: "100%", p: 8 }}>
          <Typography variant="h3" gutterBottom>
            Request to Sign In
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>Name of the organization</Typography>
            <TextField
              fullWidth
              placeholder="Enter the User Name"
              variant="outlined"
              size="small"
              sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1, color: " rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>Contact Number</Typography>
            <TextField
              fullWidth
              placeholder="Enter the Contact Number"
              variant="outlined"
              size="small"
              sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1, color: " rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>E-mail</Typography>
            <TextField
              fullWidth
              placeholder="Enter the Last Name"
              variant="outlined"
              size="small"
              sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1, color: " rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>Address</Typography>
            <TextField
              fullWidth
              placeholder="Enter the Email"
              variant="outlined"
              size="small"
              sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1, color: " rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>Description about organuization</Typography>
            <TextField
              fullWidth
              type="password"
              placeholder="Enter the Password"
              variant="outlined"
              size="small"
              sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Box>

          {/* Multi-Select Dropdown */}
          <Box sx={{ mt: 2 }}>
          <Typography sx={{ mb: 1, color: " rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>Event types</Typography>
            <FormControl fullWidth>
              <Select
                multiple
                value={selectedOptions}
                onChange={handleChange}
                size="small"
                sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                renderValue={(selected) => selected.join(", ")}
              >
                {options.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Checkbox checked={selectedOptions.indexOf(option) > -1} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Submit Button */}
          <Box sx={{ mt: 4 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              sx={{ borderRadius: "10px", textTransform: "none", fontSize: "16px", color: " rgb(0, 0, 0)", fontWeight: "bold" }}
              onClick={handleSubmit}
            >
              SUBMIT
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}