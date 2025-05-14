import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import SecondSidebar from "../../components/SecondSidebar";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const PartyOrganizer = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [userType, setUserType] = useState("");

  const handleChange = (e) => {
    setUserType(e.target.value);
  };

  const organizers = [
    {
      username: "Orga_001",
      organization: "Arora music band",
      status: "Active",
      locked: false,
    },
    {
      username: "Orga_01",
      organization: "ABC night club",
      status: "Pending",
      locked: true,
    },
    {
      username: "Orga_03",
      organization: "XYZ party organizers",
      status: "Rejected",
      locked: false,
    },
  ];

  const filteredOrganizers = statusFilter
    ? organizers.filter((o) => o.status === statusFilter)
    : organizers;

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
            User
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

        {/* Dropdown Filters */}
        <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
          {/* User Type Dropdown */}
          <Box>
            <Typography
              sx={{ fontWeight: "bold", color: "#A9A9A9", mb: 0.5 }}
              variant="body2"
            >
              
            </Typography>
            <FormControl
              fullWidth
              sx={{
                minWidth: 300,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 3,
                mb: 3,
              }}
            >
              <InputLabel>User Type</InputLabel>
              <Select value={userType} label="User Type" onChange={handleChange}>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="organizer">Party Organizer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Status */}
          <Box>
            <Typography
              sx={{ fontWeight: "bold", color: "#A9A9A9", mb: 0.5 }}
              variant="body2"
            >
              
            </Typography>
            <FormControl
              fullWidth
              sx={{
                minWidth: 300,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">--Select Status--</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Organization Name
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrganizers.map((org, index) => (
              <TableRow key={index}>
                <TableCell>{org.username}</TableCell>
                <TableCell>{org.organization}</TableCell>
                <TableCell>{org.status}</TableCell>
                <TableCell>
                  <IconButton>
                    <EditIcon sx={{ color: "#000" }} />
                  </IconButton>
                  <IconButton>
                    {org.locked ? (
                      <LockOpenIcon sx={{ color: "#000" }} />
                    ) : (
                      <LockIcon sx={{ color: "#F5A623" }} />
                    )}
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

export default PartyOrganizer;
