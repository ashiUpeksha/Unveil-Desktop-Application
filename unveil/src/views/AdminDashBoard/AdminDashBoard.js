import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Navbar from '../../components/AdminNavbar';
import AdminSidebar from '../../components/AdminSidebar';


const SimpleWelcomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const primaryColor = "#863F55";
  const lightBg = "rgba(134, 63, 85, 0.05)";

  return (
    <>
      <Navbar />
      <AdminSidebar />
      <Box
        sx={{
          ml: { xs: 0, md: `${80 + 160}px` },
          mt: "64px",
          p: isMobile ? 2 : 4,
          minHeight: `calc(100vh - 64px)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: lightBg,
        }}
      >
        <Box
          sx={{
            maxWidth: 600,
            width: "100%",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Logo Integration */}
          <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
            <img
              src="/static/logo.png"
              alt="App Logo"
              style={{
                height: isMobile ? 80 : 100,
                width: "auto",
                objectFit: "contain",
              }}
            />
          </Box>

          {/* Decorative Elements */}
          <Box
            sx={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 120,
              height: 120,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(134,63,85,0.1) 0%, rgba(134,63,85,0) 70%)`,
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(134,63,85,0.1) 0%, rgba(134,63,85,0) 70%)`,
              zIndex: 0,
            }}
          />

          {/* Main Content */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              p: isMobile ? 3 : 4,
              borderRadius: 2,
              backgroundColor: "background.paper",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                mb: 2,
                fontWeight: 700,
                color: primaryColor,
                lineHeight: 1.2,
              }}
            >
              Welcome to Your Dashboard
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: "text.secondary",
                lineHeight: 1.6,
              }}
            >
              Manage your{" "}
              {typeof window !== "undefined" &&
              window.location.pathname.includes("admin")
                ? "administrative tasks"
                : "event planning"}{" "}
              efficiently using the sidebar navigation.
            </Typography>

            {/* Feature Indicators */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mt: 4,
                flexWrap: "wrap",
              }}
            >
              {[
                { title: "Quick Access", subtitle: "All tools in the sidebar" },
                { title: "Recent Updates", subtitle: "Always up-to-date" },
              ].map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    px: 3,
                    py: 2,
                    borderLeft: `3px solid ${primaryColor}`,
                    textAlign: "left",
                    background: "rgba(134,63,85,0.03)",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ color: primaryColor }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.subtitle}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SimpleWelcomePage;