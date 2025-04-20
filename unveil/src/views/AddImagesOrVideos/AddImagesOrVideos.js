import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useNavigate } from "react-router-dom";

const AddImagesOrVideos = () => {
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    console.log("Dropped files:", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "image/*": [],
      "video/mp4": []
    },
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#C6C6C6",
          p: 3,
          mt: 8,
          minHeight: "100vh",
        }}
      >
        {/* white background */}
        <Box
          sx={{
            backgroundColor: "white",
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            position: "relative",
          }}
        >
          {/* Back Arrow */}
          <Button
            variant="contained"

            onClick={() => navigate("/addnewevent")}     
            
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              backgroundColor: "#007AFF",
              color: "white",
              minWidth: "100px",
              height: "36px",
              borderRadius: "8px",
              padding: "6px 12px",
              "&:hover": {
                backgroundColor: "#0066d6",
              },
            }}
          >
            <ArrowBackIcon />
          </Button>


          {/* Title */}
          <Typography
            variant="h5"
            sx={{ mb: 4, fontWeight: "bold", textAlign: "left" }}
          >
            Add Images and Videos of the Event
          </Typography>

          {/* Drag and Drop Box */}
          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed #aaa",
              borderRadius: "10px",
              padding: "40px",
              backgroundColor: "#eee",
              textAlign: "center",
              maxWidth: 500,
              margin: "0 auto",
              cursor: "pointer",
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography sx={{ mb: 1 }}>
              Choose a file or drag & drop it here
            </Typography>
            <Typography variant="body2" color="textSecondary">
              JPEG, PNG, PDG, and MP4 formats, up to 50MB
            </Typography>

            {/* Browse Button */}
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#666",
                "&:hover": { backgroundColor: "#444" },
              }}
            >
              Browse File
            </Button>
          </Box>

          {/* Done Button */}
          <Box sx={{ textAlign: "right", mt: 4 }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#007AFF",
              color: "white",
              px: 4,
              "&:hover": {
                backgroundColor: "#0066d6",
              },
            }}
          >
            DONE
          </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddImagesOrVideos;
