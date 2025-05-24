import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";
import Navbar from "../../components/Navbar";
import SecondSidebar from "../../components/SecondSidebar";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import ListIcon from "@mui/icons-material/List";

const UserRole = () => {
  const roles = [
    {
      name: "Admin",
      status: "Active",
      level: "Level 1",
    },
    {
      name: "Party Organizer",
      status: "Active",
      level: "Level 2",
    },
    {
      name: "User",
      status: "Active",
      level: "Level 3",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <SecondSidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#F7F2F0",
          p: 3,
          mt: 8,
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            User Role
          </Typography>
          <IconButton
            sx={{
              backgroundColor: "#007AFF",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#0062cc",
              },
            }}
          >
            <AddBoxIcon sx={{ color: "#fff" }} />
          </IconButton>
        </Box>

        {/* Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Role name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role Level</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role, index) => (
              <TableRow key={index}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.status}</TableCell>
                <TableCell>{role.level}</TableCell>
                <TableCell>
                  <IconButton>
                    <EditIcon sx={{ color: "#000" }} />
                  </IconButton>
                  <IconButton>
                    <ListIcon sx={{ color: "#000" }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default UserRole;
