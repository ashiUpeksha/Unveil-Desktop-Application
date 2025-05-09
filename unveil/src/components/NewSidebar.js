import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 70; // Narrow width for compact sidebar

const NewSidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      label: "User Management",
      icon: <PersonIcon sx={{ fontSize: 28 }} />,
      path: "/usermanagement",
    },
    {
      label: "Event Handling",
      icon: <AssignmentIcon sx={{ fontSize: 28 }} />,
      path: "/eventhandling",
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
          backgroundColor: "#863F55",
          color: "white",
          mt: 8,
          display: "flex",
          alignItems: "center",
          overflowX: "hidden",
        },
      }}
    >
      <List sx={{ width: "100%", mt: 2 }}>
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
                  backgroundColor: isActive ? "#A5536D" : "inherit",
                  borderLeft: isActive ? "4px solid white" : "none",
                }}
              >
                {item.icon}
                <ListItemText
                  primary={item.label}
                  sx={{ textAlign: "center" }}
                  primaryTypographyProps={{ fontSize: 10 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default NewSidebar;
