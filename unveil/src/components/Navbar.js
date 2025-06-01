import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useEffect } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

const NavBar = () => {
  // Get user info from localStorage
  const [organization, setOrganization] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Parse localStorage.user as JSON
    const userObj = JSON.parse(localStorage.user || "{}");
    setOrganization(userObj.organization || "");
    setUsername(userObj.username || "");
  }, []);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/profile");
  };
  const handleSignOut = () => {
    handleMenuClose();
    // Clear user info and redirect to SignOut page
    localStorage.removeItem("user");
    navigate("/signout");
  };

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
            to="/eventorganizerdashboard"
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
          <AccountCircleIcon
            sx={{
              color: "#fff",
              fontSize: 30,
              cursor: "pointer",
              transition: "color 0.2s",
              "&:hover": { color: "#FF407A" } // pink on hover
            }}
            onClick={handleProfileMenuOpen}
          />
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              elevation: 6,
              sx: {
                minWidth: 220,
                borderRadius: 3,
                mt: 1,
                background: "linear-gradient(135deg, #fffbe6 0%, #f0f4f8 100%)",
                boxShadow: "0 4px 24px rgba(25, 118, 210, 0.10)",
                p: 1,
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 1.5,
                py: 1,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#FFD874",
                  color: "#222",
                  width: 38,
                  height: 38,
                  transition: "background 0.2s",
                  "&:hover": {
                    bgcolor: "#FF407A", // pink on hover
                    color: "#fff",
                  },
                }}
                // Add tabIndex and aria-label for accessibility
                tabIndex={0}
                aria-label="profile avatar"
                onMouseOver={e => e.currentTarget.style.backgroundColor = "#FF407A"}
                onMouseOut={e => e.currentTarget.style.backgroundColor = "#FFD874"}
              >
                {username ? username[0].toUpperCase() : <PersonIcon />}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: "#222" }}>
                  {username}
                </Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>
                  {organization}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleProfileClick} sx={{ borderRadius: 2, px: 2 }}>
              <ListItemIcon>
                <PersonIcon fontSize="small" sx={{ color: "#1976d2" }} />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleSignOut} sx={{ borderRadius: 2, px: 2 }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: "#ef4444" }} />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
