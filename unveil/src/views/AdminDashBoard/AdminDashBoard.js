import React from "react";
import AdminNavbar from "../../components/AdminNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import Box from "@mui/material/Box";

const AdminDashBoard = () => {
  return (
    <div>
      <AdminNavbar />
      <div style={{ display: "flex" }}>
        <AdminSidebar />
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