import React from "react";
import NavBar from "../../components/Navbar";
import NewSidebar from "../../components/AdminSidebar";
import Box from "@mui/material/Box";

const AdminDashBoard = () => {
  return (
    <div>
      <NavBar />
      <div style={{ display: "flex" }}>
        <NewSidebar />
        <div style={{ flex: 1 }}>
          <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#C6C6C6",
          p: 3,
          mt: 8,
          minHeight: "100vh",
        }}
      >
        <h1>Welcome to Unveil!</h1>
        <p>This is the homepage.</p>
      </Box>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;