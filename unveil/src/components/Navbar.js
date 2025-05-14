import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#4F4F4F",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Link to="/home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
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
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" component={Link} to="/about">About</Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;