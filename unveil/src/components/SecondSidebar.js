import React from "react";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import { Link, useLocation } from "react-router-dom";

const mainSidebarWidth = 80;
const secondarySidebarWidth = 160;
const appBarOffset = 64; // height of your AppBar

const SecondSidebar = () => {
    const location = useLocation();

    const isUserActive = location.pathname === "/user";
    const isRollActive = location.pathname === "/roll";

    return (
        <>
            {/* Main Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: mainSidebarWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: mainSidebarWidth,
                        backgroundColor: "#863F55",
                        color: "white",
                        boxSizing: "border-box",
                        position: "fixed",
                        top: appBarOffset,
                        left: 0,
                        height: `calc(100vh - ${appBarOffset}px)`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        overflow: "hidden",
                    },
                }}
            >
                <List>
                    <ListItem disablePadding sx={{ justifyContent: "center" }}>
                        <ListItemButton
                            component={Link}
                            to="/user"
                            sx={{
                                flexDirection: "column",
                                py: 2,
                                px: 1,
                                textAlign: "center",
                            }}
                        >
                            <PersonIcon sx={{ fontSize: 28, mb: 1 }} />
                            <ListItemText
                                primary="User"
                                secondary="Management"
                                primaryTypographyProps={{ fontSize: 12, color: "#FFFFFF" }}
                                secondaryTypographyProps={{ fontSize: 12, color: "#FFFFFF" }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>

            {/* Secondary Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: secondarySidebarWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: secondarySidebarWidth,
                        backgroundColor: "#4F4F4F",
                        color: "white",
                        boxSizing: "border-box",
                        position: "fixed",
                        top: appBarOffset,
                        left: mainSidebarWidth,
                        height: `calc(100vh - ${appBarOffset}px)`,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        pt: 2,
                        overflow: "hidden",
                    },
                }}
            >
                <List sx={{ width: "100%" }}>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={Link}
                            to="/user"
                            sx={{
                                justifyContent: "center",
                                backgroundColor: isUserActive ? "#ffffff22" : "transparent",
                            }}
                        >
                            <PersonAddAltOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                            <ListItemText
                                primary="User"
                                primaryTypographyProps={{ fontSize: 14, color: "white" }}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={Link}
                            to="/roll"
                            sx={{
                                justifyContent: "center",
                                backgroundColor: isRollActive ? "#ffffff22" : "transparent",
                            }}
                        >
                            <LayersOutlinedIcon fontSize="small" sx={{ mr: 1 }} />
                            <ListItemText
                                primary="Roll"
                                primaryTypographyProps={{ fontSize: 14, color: "white" }}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
        </>
    );
};

export default SecondSidebar;