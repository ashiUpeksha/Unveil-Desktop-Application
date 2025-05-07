import { Grid, Box, Typography, TextField, Button, Link } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";

export default function LoginPage() {
  async function handleLogin(values, { setSubmitting }) {
    try {
      const model = {
        username: values.username,
        password: values.password,
      };

      console.log("Submitting Login Data:", model);

      // Simulate an API call
      const response = await fetch("https://your-api-endpoint.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(model),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const result = await response.json();
      console.log("Login Success:", result);

      alert("Login successful!");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Error during login. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required"),
      })}
      onSubmit={handleLogin}
    >
      {({ errors, handleBlur, handleSubmit, touched, values, handleChange }) => (
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
                  Login to your Account
                </Typography>

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

                <Box sx={{ textAlign: "right", mb: 4 }}>
                  <Link href="#" underline="hover" sx={{ color: "rgb(25, 118, 210)" }}>
                    Forgot Password?
                  </Link>
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
                    Login
                  </Button>
                </Box>

                <Typography textAlign="center" sx={{ mt: 4 }}>
                  Not Registered Yet?{" "}
                  <Link href="#" underline="hover" sx={{ color: "rgb(25, 118, 210)" }}>
                    Create an account
                  </Link>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
}
