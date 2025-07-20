import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useEffect } from "react";

const NavBar = () => {
  // Get user info from localStorage
  const [organization, setOrganization] = React.useState("");
  const [username, setUsername] = React.useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Parse localStorage.user as JSON
    const userObj = JSON.parse(localStorage.user || "{}");
    setOrganization(userObj.organization || "");
    setUsername(userObj.username || "");
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#4F4F4F",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        px: 2,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left section: Logo and App Name */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link
            to="/admindashboard"
            style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          >
            <img
              src="/static/logo.png"
              alt="Unveil Logo"
              style={{ height: 40, marginRight: 50 }}
            />
          </Link>
          <Typography
            variant="h6"
            sx={{
              background: "linear-gradient(90deg, #FFD874, #FF407A)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: "Sansita One",
              fontWeight: "bold",
              mt: -1,
            }}
          >
            U&nbsp;&nbsp;n&nbsp;&nbsp;v&nbsp;&nbsp;e&nbsp;&nbsp;i&nbsp;&nbsp;l
          </Typography>
        </Box>

        {/* Right section: Org Info and Profile Icon */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#fff" }}>
              {organization}
            </Typography>
            <Typography variant="body2" sx={{ color: "#ccc", fontSize: "0.85rem" }}>
              {username}
            </Typography>
          </Box>
          <AccountCircleIcon sx={{ color: "#fff", fontSize: 30 }} />
          {/* Sign Out Button */}
          <Box
            sx={{
              ml: 2,
              cursor: "pointer",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1rem",
              px: 2,
              py: 0.5,
              borderRadius: 2,
              background: "#FF407A",
              "&:hover": {
                background: "#FFD874",
                color: "#222",
              },
            }}
            onClick={() => navigate("/signout")}
          >
            Sign Out
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;