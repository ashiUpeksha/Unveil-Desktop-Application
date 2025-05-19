import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 200; // Match Sidebar.js width

const AdminDashBoardSidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      label: "User Management",
      icon: <PersonIcon sx={{ fontSize: 30, mb: 1 }} />,
      path: "/usermanagement",
    },
    {
      label: "Event Handling",
      icon: <AssignmentIcon sx={{ fontSize: 30, mb: 1 }} />,
      path: "/admineventhandling", // updated path
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#863F55",
          color: "white",
          mt: 8,
          display: "flex",
          alignItems: "center",
        },
      }}
    >
      <List sx={{ width: "100%" }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.label}
              disablePadding
              sx={{ justifyContent: "center" }}
            >
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  flexDirection: "column",
                  alignItems: "center",
                  py: 2,
                  borderLeft: isActive ? "4px solid white" : "none",
                  backgroundColor: isActive ? "#A5536D" : "inherit",
                }}
              >
                {item.icon}
                <ListItemText
                  primary={item.label}
                  sx={{ textAlign: "center", m: 0 }}
                  primaryTypographyProps={{ fontSize: 14 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default AdminDashBoardSidebar;
