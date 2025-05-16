import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Link, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { Formik } from "formik";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export default function AdminRegister() {
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userTypes, setUserTypes] = useState([]);
  const navigate = useNavigate();

  // Fetch user types from backend
  useEffect(() => {
    fetch("http://localhost:3000/api/userTypes")
      .then(res => res.json())
      .then(data => setUserTypes(data))
      .catch(() => setUserTypes([]));
  }, []);

  async function handleRegister(values, { setSubmitting }) {
    // Registration logic here (not implemented)
    setSubmitting(false);
  }

  return (
    <>
      <Formik
        initialValues={{
          userType: "",
          username: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={Yup.object().shape({
          userType: Yup.string().required("User Type is required"),
          username: Yup.string().required("Username is required"),
          password: Yup.string().required("Password is required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required("Confirm Password is required"),
        })}
        onSubmit={handleRegister}
      >
        {({ errors, handleBlur, handleSubmit, touched, values, handleChange, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <Grid container sx={{ minHeight: "100vh", overflow: "hidden" }}>
              {/* Left Side */}
              <Grid item xs={12} md={6}>
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
                  <img
                    src="/static/logo.png"
                    alt="Logo"
                    style={{ width: "300px", height: "auto", marginBottom: "20px" }}
                  />
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
              <Grid item xs={12} md={6}>
                <Box sx={{ bgcolor: "#FDF8F8", height: "100%", p: 8 }}>
                  <Typography variant="h3" gutterBottom>
                    Admin Registration
                  </Typography>

                  {/* User Type */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}
                    >
                      User Type
                    </Typography>
                    <select
                      name="userType"
                      value={values.userType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{
                        width: "100%",
                        height: "40px",
                        borderRadius: "5px",
                        border: touched.userType && errors.userType ? "1.5px solid #d32f2f" : "1px solid #ccc",
                        padding: "8px",
                        fontSize: "16px",
                        color: values.userType ? "#222" : "#888",
                        background: "#fff"
                      }}
                    >
                      <option value="">Select User Type</option>
                      {userTypes.map((type) => (
                        <option key={type.user_type_id} value={type.user_type}>
                          {type.user_type}
                        </option>
                      ))}
                    </select>
                    {touched.userType && errors.userType && (
                      <Typography variant="caption" color="error">
                        {errors.userType}
                      </Typography>
                    )}
                  </Box>

                  {/* Username */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}
                    >
                      Username
                    </Typography>
                    <TextField
                      fullWidth
                      name="username"
                      placeholder="Enter your username"
                      type="text"
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
                    <Typography
                      sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}
                    >
                      Password
                    </Typography>
                    <TextField
                      fullWidth
                      name="password"
                      placeholder="Enter your password"
                      type="password"
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
                    <Typography
                      sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}
                    >
                      Confirm Password
                    </Typography>
                    <TextField
                      fullWidth
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      type="password"
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

                  <Box>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      type="submit"
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        fontSize: "16px",
                        color: "rgb(0, 0, 0)",
                        fontWeight: "bold",
                      }}
                    >
                      Register
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      {/* Error Dialog */}
      <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setErrorDialogOpen(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}