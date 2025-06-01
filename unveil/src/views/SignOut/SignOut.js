import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

export default function SignOut() {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (signingOut) {
      // Clear authentication data
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      // Redirect to login after a short delay
      const timer = setTimeout(() => {
        navigate("/");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [signingOut, navigate]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "#fff"
      }}
    >
      <Dialog open={confirmOpen}>
        <DialogTitle
          sx={{
            background: "linear-gradient(90deg,rgb(255, 183, 0),rgb(255, 2, 78))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
            fontSize: "2rem",
            textAlign: "center",
          }}
        >
          Sign Out
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontWeight: 500, fontSize: "1.1rem", color: "rgb(255, 0, 76)" }}>
            Are you sure you want to sign out?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmOpen(false);
              navigate(-1); // Go back
            }}
            sx={{
              background: "#4F4F4F",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: 2,
              px: 3,
              boxShadow: 2,
              fontSize: "1rem",
              fontFamily: "inherit",
              "&:hover": {
                background: "#222",
                color: "rgb(255, 0, 76)"
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setConfirmOpen(false);
              setSigningOut(true);
            }}
            sx={{
              background: "#4F4F4F",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: 2,
              px: 3,
              boxShadow: 2,
              fontSize: "1rem",
              fontFamily: "inherit",
              "&:hover": {
                background: "#222",
                color: "rgb(255, 0, 76)"
              }
            }}
            variant="contained"
          >
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>
      {signingOut && (
        <>
          <CircularProgress sx={{ mb: 3, color: "#FF407A" }} thickness={5} size={60} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(90deg,rgb(255, 183, 0),rgb(255, 0, 76))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center"
            }}
          >
            Signing out...
          </Typography>
        </>
      )}
    </Box>
  );
}
