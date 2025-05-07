import { Grid, Box, Typography, TextField, Button } from "@mui/material";
import { useState, Fragment } from "react";
import * as Yup from "yup";
import { Formik } from "formik";

export default function ResetPassword() {
  async function saveData(values, { setSubmitting }) {
    try {
      const model = {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      };

      console.log("Submitting Data:", model);

      const response = await fetch("https://your-api-endpoint.com/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(model),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password");
      }

      const result = await response.json();
      console.log("Reset Success:", result);

      alert("Password reset successfully!");
    } catch (error) {
      console.error("Reset Error:", error);
      alert("Error resetting password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Fragment>
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }}
        validationSchema={Yup.object().shape({
          currentPassword: Yup.string().required("Current password is required"),
          newPassword: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("New password is required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
            .required("Confirm password is required"),
        })}
        onSubmit={saveData}
      >
        {({ errors, handleBlur, handleSubmit, touched, values, handleChange }) => (
          <form onSubmit={handleSubmit}>
            <Grid container sx={{ minHeight: "100vh", overflow: "hidden" }}>
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
                    Password Reset
                  </Typography>
                </Box>
              </Grid>

              {/* Right Side */}
              <Grid item xs={6}>
                <Box sx={{ bgcolor: "#FDF8F8", height: "100%", p: 8 }}>
                  <Typography variant="h3" gutterBottom>
                    Reset Password
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}
                    >
                      Current Password
                    </Typography>
                    <TextField
                      fullWidth
                      name="currentPassword"
                      placeholder="Enter your current password"
                      type="password"
                      value={values.currentPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.currentPassword && errors.currentPassword)}
                      helperText={touched.currentPassword && errors.currentPassword}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}
                    >
                      New Password
                    </Typography>
                    <TextField
                      fullWidth
                      name="newPassword"
                      placeholder="Enter your new password"
                      type="password"
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(touched.newPassword && errors.newPassword)}
                      helperText={touched.newPassword && errors.newPassword}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: "10px", "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      sx={{ mb: 1, color: "rgb(122, 121, 121)", fontWeight: "bold", fontSize: "18px" }}
                    >
                      Confirm Password
                    </Typography>
                    <TextField
                      fullWidth
                      name="confirmPassword"
                      placeholder="Confirm your new password"
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

                  {/* Submit Button */}
                  <Box sx={{ mt: 4 }}>
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
                      Save
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
