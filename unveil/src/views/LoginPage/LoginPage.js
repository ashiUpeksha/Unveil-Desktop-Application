
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Link, TextField, Typography } from "@mui/material";

export default function LoginPage() {
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  async function handleLogin(values, { setSubmitting }) {
    try {
      const model = {
        username: values.username,
        password: values.password,
      };

      console.log("Submitting Login Data:", model);

      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(model),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login failed. Please check your credentials.");
      }

      console.log("Login Success:", result);
      
      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      
      if (result.user.userType === 1) {
        navigate("/admindashboard");
      } else if (result.user.userType === 2) {
        navigate("/eventorganizerdashboard"); 
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage(error.message || "Error during login. Please try again.");
      setErrorDialogOpen(true);
    } finally {
      setSubmitting(false);
    }
  }

  // Styles
  const containerStyle = {
    display: 'flex',
    minHeight: '100vh',
    overflow: 'hidden',
    width: '100%'
  };

  const leftSideStyle = {
    flex: 1,
    backgroundColor: '#000000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '20px'
  };

  const rightSideStyle = {
    flex: 1,
    backgroundColor: '#FDF8F8',
    padding: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const logoStyle = {
    width: '300px',
    height: 'auto',
    marginBottom: '20px'
  };

  const titleStyle = {
    background: 'linear-gradient(90deg, #FFD874, #FF407A)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontFamily: 'Sansita One',
    fontWeight: 'bold',
    fontSize: '3rem',
    marginTop: '-10px',
    letterSpacing: '0.3rem'
  };

  const taglineStyle = {
    background: 'linear-gradient(90deg, #FFD874, #FF407A)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 'bold',
    fontSize: '2rem',
    marginTop: '-10px'
  };

  const inputLabelStyle = {
    marginBottom: '8px',
    color: 'rgb(122, 121, 121)',
    fontWeight: 'bold',
    fontSize: '18px'
  };

  const inputStyle = {
    width: '100%',
    borderRadius: '10px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px'
    }
  };

  const buttonStyle = {
    borderRadius: '10px',
    textTransform: 'none',
    fontSize: '16px',
    color: 'rgb(0, 0, 0)',
    fontWeight: 'bold',
    padding: '12px 0'
  };

  return (
    <>
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
            <div style={containerStyle}>
              {/* Left Side */}
              <div style={leftSideStyle}>
                <img
                  src="/static/logo.png"
                  alt="Logo"
                  style={logoStyle}
                />
                <div style={titleStyle}>U  n  v  e  i  l</div>
                <div style={taglineStyle}>Only for party lovers...</div>
              </div>

              {/* Right Side */}
              <div style={rightSideStyle}>
                <Typography variant="h3" gutterBottom>
                  LOGIN TO YOUR ACCOUNT
                </Typography>

                <div style={{ marginBottom: '20px' }}>
                  <Typography style={inputLabelStyle}>
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
                    sx={inputStyle}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <Typography style={inputLabelStyle}>
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
                    sx={inputStyle}
                  />
                </div>

                <div style={{ textAlign: "right", marginBottom: '30px' }}>
                  <Link
                    href="#"
                    underline="hover"
                    sx={{ color: "rgb(25, 118, 210)" }}
                    onClick={() => navigate("/resetpassword")}
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    sx={buttonStyle}
                  >
                    Login
                  </Button>
                </div>

                <Typography textAlign="center" sx={{ marginTop: '30px' }}>
                  Not Registered Yet?{" "}
                  <Link
                    href="#"
                    underline="hover"
                    sx={{ color: "rgb(25, 118, 210)" }}
                    onClick={() => navigate("/register")}
                  >
                    Create an account
                  </Link>
                </Typography>
              </div>
            </div>
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
