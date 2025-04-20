import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 200;

const Sidebar = () => {
  const location = useLocation();

  // Check if "Add New Event" should be active
  const isAddEventActive =
    location.pathname === "/addnewevent" || location.pathname === "/addimageorvideos";

  // Check if "View Events" should be active
  const isViewEventsActive = location.pathname === "/viewevents";

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
        {/* Add New Event Button */}
        <ListItem disablePadding sx={{ justifyContent: "center" }}>
          <ListItemButton
            component={Link}
            to="/addnewevent"
            sx={{
              flexDirection: "column",
              alignItems: "center",
              py: 2,
              borderLeft: isAddEventActive ? "4px solid white" : "none",
              backgroundColor: isAddEventActive ? "#A5536D" : "inherit",
            }}
          >
            <AddBoxOutlinedIcon sx={{ fontSize: 30, mb: 1 }} />
            <ListItemText
              primary="Add New Event"
              sx={{ textAlign: "center", m: 0 }}
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </ListItemButton>
        </ListItem>

        {/* View Events Button */}
        <ListItem disablePadding sx={{ justifyContent: "center" }}>
          <ListItemButton
            component={Link}
            to="/viewevents"
            sx={{
              flexDirection: "column",
              alignItems: "center",
              py: 2,
              borderLeft: isViewEventsActive ? "4px solid white" : "none",
              backgroundColor: isViewEventsActive ? "#A5536D" : "inherit",
            }}
          >
            <AssignmentOutlinedIcon sx={{ fontSize: 30, mb: 1 }} />
            <ListItemText
              primary="View Events"
              sx={{ textAlign: "center", m: 0 }}
              primaryTypographyProps={{ fontSize: 14 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;