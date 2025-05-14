import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import { Link, useLocation } from "react-router-dom";

const mainSidebarWidth = 70;
const secondarySidebarWidth = 160;
const appBarHeight = 64; // Adjust this if your AppBar height is different

const NewSecondSidebar = () => {
  const location = useLocation();

  const isEventsActive = location.pathname === "/events";
  const isRollActive = location.pathname === "/roll";

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
    <>
      {/* Main Sidebar (maroon) */}
      <Drawer
        variant="permanent"
        sx={{
          width: mainSidebarWidth,
          "& .MuiDrawer-paper": {
            width: mainSidebarWidth,
            backgroundColor: "#863F55",
            color: "white",
            position: "fixed",
            top: appBarHeight,
            left: 0,
            height: `calc(100vh - ${appBarHeight}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "hidden",
            pt: 2,
          },
        }}
      >
        <List sx={{ width: "100%" }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.label} disablePadding sx={{ justifyContent: "center" }}>
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

      {/* Secondary Sidebar (gray) */}
      <Drawer
        variant="permanent"
        sx={{
          width: secondarySidebarWidth,
          "& .MuiDrawer-paper": {
            width: secondarySidebarWidth,
            backgroundColor: "#4F4F4F",
            color: "white",
            position: "fixed",
            top: appBarHeight,
            left: mainSidebarWidth,
            height: `calc(100vh - ${appBarHeight}px)`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 4,
            gap: 2,
            overflow: "hidden",
          },
        }}
      >
        <Box
          component={Link}
          to="/events"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: isEventsActive ? "#ffffff22" : "transparent",
            px: 2,
            py: 1,
            borderRadius: 1,
            color: "white",
            textDecoration: "none",
          }}
        >
          <CheckBoxOutlinedIcon fontSize="small" />
          <span>Events</span>
        </Box>
        <Box
          component={Link}
          to="/roll"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            backgroundColor: isRollActive ? "#ffffff22" : "transparent",
            px: 2,
            py: 1,
            borderRadius: 1,
            color: "white",
            textDecoration: "none",
          }}
        >
          <LayersOutlinedIcon fontSize="small" />
          <span>Roll</span>
        </Box>
      </Drawer>
    </>
  );
};

export default NewSecondSidebar;