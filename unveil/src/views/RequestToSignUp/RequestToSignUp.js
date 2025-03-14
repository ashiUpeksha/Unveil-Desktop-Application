import { Grid, Box, Typography, TextField, MenuItem, Select, FormControl, Checkbox, ListItemText, Button } from "@mui/material";
import { useState, Fragment } from "react";
import * as Yup from 'yup';
import { Formik } from 'formik';

export default function TwoPartLayout() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const options = ["Option 1", "Option 2", "Option 3", "Option 4"];

  const handleChange = (event) => {
    setSelectedOptions(event.target.value);
  };

  const [submitSData, setSubmitData] = useState({
    organizationName: '',
    contactNumber: '',
    email: '',
    address: '',
    description: '',
    eventTypeID: []
  })

  async function saveData(values, { setSubmitting }) {
    try {
      const model = {
        organizationName: values.organizationName,
        contactNumber: values.contactNumber,
        email: values.email,
        address: values.address,
        description: values.description,
        eventTypeID: values.eventTypeID
      };
  
      console.log("Submitting Data:", model);

      const response = await fetch("https://your-api-endpoint.com/save", {
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
      console.log("Submission Success:", result);
  
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Error submitting form. Please try again.");
    } finally {
      setSubmitting(false);
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
          eventTypeID: []
        }}
        validationSchema={Yup.object().shape({
          organizationName: Yup.string().required('Organization Name is Required'),
          contactNumber: Yup.string().matches(/^[0-9]+$/, "Must be only digits").required('Contact Number is Required'),
          email: Yup.string().email('Invalid Email').required('Email is Required'),
          address: Yup.string().required('Address is Required'),
          description: Yup.string().required('Description is Required'),
        })}
        onSubmit={(saveData)}
      >
        {({ errors, handleBlur, handleSubmit, touched, values, setFieldValue, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <Grid container sx={{ minHeight: "100vh", overflow: "hidden" }}>
              {/* Left Side */}
              <Grid item xs={6}>
                <Box sx={{ bgcolor: "#000000", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", p: 2 }}>
                  <img src="/static/logo.png" alt="Logo" style={{ width: "300px", height: "auto", marginBottom: "20px" }} />
                  <Typography variant="h2" sx={{ background: "linear-gradient(90deg, #FFD874, #FF407A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "Sansita One", fontWeight: "bold", mt: -1 }}>
                    U  n  v  e  i  l
                  </Typography>
                  <Typography variant="h4" sx={{ background: "linear-gradient(90deg, #FFD874, #FF407A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: "bold", mt: -1 }}>
                    Only for party lovers...
                  </Typography>
                </Box>
              </Grid>

              {/* Right Side */}
              <Grid item xs={6}>
                <Box sx={{ bgcolor: "#FDF8F8", height: "100%", p: 8 }}>
                  <Typography variant="h3" gutterBottom>Request to Sign In</Typography>

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

                  <Box sx={{ mt: 2 }}>
                  <Typography sx={{ mb: 1, color: " rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}>Event types</Typography>
                    <FormControl fullWidth>
                      <Select
                        multiple
                        value={selectedOptions}
                        onChange={handleChange}
                        size="small"
                        id="eventTypeID"
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
                      type="submit"
                      sx={{ borderRadius: "10px", textTransform: "none", fontSize: "16px", color: "rgb(0, 0, 0)", fontWeight: "bold" }}
                    >
                      SUBMIT
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Fragment>
  );
}