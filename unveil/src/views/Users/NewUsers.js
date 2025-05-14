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
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";

const NewUsers = () => {
  const [userType, setUserType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = (event) => {
    setUserType(event.target.value);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const users = [
    {
      username: "Chathu_1010",
      firstName: "Chathuri",
      lastName: "Kavindi",
      status: "Active",
      locked: false,
    },
    {
      username: "Alena",
      firstName: "Alena",
      lastName: "Peiris",
      status: "Active",
      locked: true,
    },
    {
      username: "kasun_0512",
      firstName: "Kasun",
      lastName: "Sandaruwan",
      status: "Active",
      locked: false,
    },
  ];

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        {/* User Type Dropdown */}
        <Typography
          sx={{ fontWeight: "bold", color: "#A9A9A9", mb: 0.5 }}
          variant="body2"
        >
          
        </Typography>
        <FormControl
          fullWidth
          sx={{
            maxWidth: 300,
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: 3,
            mb: 3,
          }}
        >
          <InputLabel>User Type</InputLabel>
          <Select value={userType} label="User Type" onChange={handleChange}>
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="organizer">Party organizer</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>

        {/* Search Box */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <TextField
            size="small"
            placeholder="Search"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            sx={{ backgroundColor: "#fff", borderRadius: 1, boxShadow: 1 }}
          />
        </Box>

        {/* User Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>First Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Last Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>
                  <IconButton>
                    <EditIcon sx={{ color: "#000" }} />
                  </IconButton>
                  <IconButton>
                    {user.locked ? (
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

export default NewUsers;
