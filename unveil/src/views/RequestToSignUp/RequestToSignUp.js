import React, { useState, Fragment, useEffect } from 'react';
import * as Yup from 'yup';
import { Link, useNavigate } from "react-router-dom";
import { Grid, Box, Typography, TextField, MenuItem, Select, FormControl, Checkbox, ListItemText, Button } from "@mui/material";
import { Formik } from 'formik';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

// Styles
const containerStyle = {
  display: 'flex',
  height: '100vh',
  width: '100%',
};

const leftColStyle = {
  flex: 1,
  background: '#000',
  color: '#fff',
  height: '100vh', // Ensure same height as rightColStyle
  minHeight: 0,    // Allow flexbox to control height
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  boxSizing: 'border-box', // Ensure padding doesn't affect height
  overflow: 'auto',        // Allow scrolling if content overflows
};

const rightColStyle = {
  flex: 1,
  background: '#FDF8F8',
  height: '100vh',
  minHeight: 0,
  padding: '20px',
  paddingBottom: '20px', // Add extra bottom padding
  overflowY: 'auto',
  boxSizing: 'border-box',
};

const logoStyle = {
  width: '300px',
  height: 'auto',
  marginBottom: '20px'
};

const unveilTextStyle = {
  fontFamily: 'Sansita One',
  fontSize: '3rem',
  fontWeight: 'bold',
  marginTop: '-10px',
  background: 'linear-gradient(90deg, #FFD874, #FF407A)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '0.3rem'
};

const taglineStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  marginTop: '-10px',
  background: 'linear-gradient(90deg, #FFD874, #FF407A)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
};

const inputLabelStyle = {
  marginBottom: '8px',
  color: 'rgb(122, 121, 121)',
  fontWeight: 'bold',
  fontSize: '18px'
};

const inputStyle = {
  width: '100%',
  borderRadius: '10px'
};

const buttonStyle = {
  width: '100%',
  borderRadius: '10px',
  textTransform: 'none',
  fontSize: '16px',
  color: 'rgb(0, 0, 0)',
  fontWeight: 'bold',
  padding: '10px'
};

const linkStyle = {
  color: "rgb(25, 118, 210)",
  background: "none",
  border: "none",
  padding: 0,
  font: "inherit",
  cursor: "pointer",
  textDecoration: 'underline'
};

export default function TwoPartLayout() {
  const [options, setOptions] = useState([]);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEventTypes() {
      try {
        const response = await fetch("http://localhost:3000/api/eventTypes");
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error('Error fetching event types:', error);
      }
    }
    fetchEventTypes();
  }, []);

  async function saveData(values, { setSubmitting, resetForm }) {
    try {
      const model = {
        organizationName: values.organizationName,
        contactNumber: values.contactNumber,
        email: values.email,
        address: values.address,
        description: values.description,
        eventTypeID: values.eventTypeID,
        username: values.username, 
        password: values.password
      };

      const response = await fetch("http://localhost:3000/api/requestToRegister", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(model),
      });

      if (!response.ok) {
        throw new Error("Failed to submit data");
      }

      const result = await response.json();
      setSuccessMessage("✅ Form submitted successfully!");
      setSuccessDialogOpen(true);
      resetForm();
    } catch (error) {
      setErrorMessage(error.message || "Error submitting form. Please try again.");
      setErrorDialogOpen(true);
    }
  }

  return (
    <Fragment>
      <Formik 
        initialValues={{
          organizationName: '',
          contactNumber: '',
          email: '',
          address: '',
          description: '',
          eventTypeID: [],
          username: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={Yup.object().shape({
          organizationName: Yup.string().required('Organization Name is Required'),
          contactNumber: Yup.string()
            .matches(/^[0-9]+$/, "Must be only digits")
            .required('Contact Number is Required'),
          email: Yup.string().email('Invalid Email').required('Email is Required'),
          address: Yup.string().required('Address is Required'),
          description: Yup.string().required('Description is Required'),
          eventTypeID: Yup.array()
            .min(1, 'At least one Event Type must be selected')
            .required('Event Type is required'),
          username: Yup.string().required('Username is Required'),
          password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is Required'),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is Required'),
        })}
        onSubmit={saveData}
      >
        {({ errors, handleBlur, handleSubmit, touched, values, setFieldValue, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <div style={containerStyle}>
              {/* Left Side */}
              <div style={leftColStyle}>
                <img src="/static/logo.png" alt="Logo" style={logoStyle} />
                <div style={unveilTextStyle}>U  n  v  e  i  l</div>
                <div style={taglineStyle}>Only for party lovers...</div>
              </div>

              <div style={rightColStyle}>
                {/* Right Side */}
              {/* <Grid item xs={6}> */}
                <Box sx={{ bgcolor: "#FDF8F8", height: "100%", p: 8 }}>
                  <Typography variant="h3" gutterBottom>SIGN UP</Typography>

                  {/* Organization Name */}
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>Name of the organization</Typography>
                    <TextField
                      fullWidth
                      name="organizationName"
                      placeholder="Enter the Organization Name"
                      value={values.organizationName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.organizationName && errors.organizationName)}
                      helperText={touched.organizationName && errors.organizationName}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Box>

                  {/* Contact Number */}
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>Contact Number</Typography>
                    <TextField
                      fullWidth
                      name="contactNumber"
                      placeholder="Enter the Contact Number"
                      value={values.contactNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.contactNumber && errors.contactNumber)}
                      helperText={touched.contactNumber && errors.contactNumber}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Box>

                  {/* Email */}
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>E-mail</Typography>
                    <TextField
                      fullWidth
                      name="email"
                      placeholder="Enter the Email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Box>

                  {/* Address */}
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>Address</Typography>
                    <TextField
                      fullWidth
                      name="address"
                      placeholder="Enter the Address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.address && errors.address)}
                      helperText={touched.address && errors.address}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Box>

                  {/* Description */}
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>Description about organization</Typography>
                    <TextField
                      fullWidth
                      name="description"
                      placeholder="Enter the Description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.description && errors.description)}
                      helperText={touched.description && errors.description}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Box>

                  {/* Event types */}
                  <Box sx={{ mt: 2 }}>
                    <Typography sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>
                      Event types
                    </Typography>
                    <FormControl fullWidth>
                    <Select
                      multiple
                      name="eventTypeID"
                      value={values.eventTypeID}
                      onChange={(event) => setFieldValue('eventTypeID', event.target.value)}
                      size="small"
                      id="eventTypeID"
                      disabled={options.length === 0} // disable if not loaded yet
                      renderValue={(selected) => selected.join(", ")}
                    >
                      {options.length === 0 ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : (
                        options.map((option) => (
                          <MenuItem key={option} value={option}>
                            <Checkbox checked={values.eventTypeID.indexOf(option) > -1} />
                            <ListItemText primary={option} />
                          </MenuItem>
                        ))
                      )}
                    </Select>
                      {touched.eventTypeID && errors.eventTypeID && (
                        <Typography variant="caption" color="error">
                          {errors.eventTypeID}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>

                  {/* Username */}
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>Username</Typography>
                    <TextField
                      fullWidth
                      name="username"
                      placeholder="Enter your Username"
                      value={values.username}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.username && errors.username)}
                      helperText={touched.username && errors.username}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Box>

                  {/* Password */}
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>Password</Typography>
                    <TextField
                      fullWidth
                      name="password"
                      type="password"
                      placeholder="Enter your Password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Box>

                  {/* Confirm Password */}
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>Confirm Password</Typography>
                    <TextField
                      fullWidth
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your Password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Box>

                  {/* Submit Button */}
                  <Box sx={{ mt: 4 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      type="submit"
                      sx={{ borderRadius: "10px", textTransform: "none", fontSize: "16px", color: "rgb(0, 0, 0)", fontWeight: "bold" }}
                    >
                      SUBMIT
                    </Button>
                  </Box>

                  <Typography textAlign="center" sx={{ mt: 4, pb: '40px' }}>
                    Already have an account?{" "}
                    <Box
                      component="span"
                      sx={{
                        color: "rgb(25, 118, 210)",
                        cursor: "pointer",
                        textDecoration: "none",
                        transition: "text-decoration 0.2s",
                        "&:hover": {
                          textDecoration: "underline"
                        },
                        fontWeight: 500,
                        display: "inline",
                      }}
                      onClick={e => {
                        e.preventDefault();
                        navigate("/");
                      }}
                    >
                      Login to the account
                    </Box>
                  </Typography>

                  <Dialog
                    open={successDialogOpen}
                    onClose={() => setSuccessDialogOpen(false)}
                  >
                    <DialogTitle>Success</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                        {successMessage}
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setSuccessDialogOpen(false)} color="primary">
                        OK
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              {/* </Grid> */}
              </div>
              
            </div>
          </form>
        )}
      </Formik>
    </Fragment>
  );
}