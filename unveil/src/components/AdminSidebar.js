import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 200; // Match Sidebar.js width

const AdminDashBoardSidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      label: "Add New Event",
      icon: <EventAvailableIcon sx={{ fontSize: 30, mb: 1 }} />,
      path: "/adminaddnewevent",
    },
    {
      label: "Event Handling",
      icon: <AssignmentIcon sx={{ fontSize: 30, mb: 1 }} />,
      path: "/admineventhandling",
      match: [
        "/admineventhandling",
        "/acceptEvent",
        "/updateevent",
        "/deleteevent",
        "/adminupdateevent",
        "/admindeleteevent",
        "/admineventupdate", 
      ], // highlight for all admin event handling related pages
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
          // Highlight if path matches exactly or starts with any match prefix (including subroutes)
          const isActive =
            item.match
              ? item.match.some(
                  (prefix) =>
                    location.pathname === prefix ||
                    location.pathname.startsWith(prefix + "/")
                )
              : location.pathname === item.path;
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