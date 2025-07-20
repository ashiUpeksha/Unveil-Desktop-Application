import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip, Grid, Avatar, Divider, Stack, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import EventIcon from '@mui/icons-material/Event';

// Helper: get userId from localStorage (assuming login stores it)
function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.userId || user?.id || null;
  } catch {
    return null;
  }
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState("");

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;
    fetch(`http://localhost:3000/api/userProfile/${userId}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleEdit = () => {
    setEditProfile({ ...profile });
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditProfile(null);
  };

  const handleChange = (field, value) => {
    setEditProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userId = getUserId();
      const res = await fetch(`http://localhost:3000/api/userProfile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_name: editProfile.organization_name,
          contact_number: editProfile.contact_number,
          email: editProfile.email,
          address: editProfile.address,
          description: editProfile.description,
          username: editProfile.username
        })
      });
      const data = await res.json();
      if (data.success) {
        setProfile(data.user);
        setDialogMsg("Profile updated successfully!");
        setDialogOpen(true);
        setEditMode(false);
        setEditProfile(null);
      } else {
        setDialogMsg(data.error || "Failed to update profile.");
        setDialogOpen(true);
      }
    } catch (err) {
      setDialogMsg("Failed to update profile.");
      setDialogOpen(true);
    }
    setSaving(false);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!profile) return <Typography>No profile data found.</Typography>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff', position: 'relative' }}>
      {/* Half background color at the top */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: { xs: 180, sm: 240, md: 280 },
          background: 'linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%)',
          zIndex: 0,
          borderBottomLeftRadius: 60,
          borderBottomRightRadius: 60,
        }}
      />
      {/* Profile Card */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          minHeight: '100vh',
          pt: { xs: 4, sm: 7, md: 8 }
        }}
      >
        <Paper elevation={6} sx={{
          p: 4,
          borderRadius: 5,
          background: '#fff',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.15)',
          maxWidth: 600,
          width: '100%',
          mt: { xs: 2, sm: 4, md: 6 }
        }}>
          <Stack alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{
              bgcolor: "#ffb300",
              width: 100,
              height: 100,
              border: '6px solid #fff',
              boxShadow: 3,
              mt: -12
            }}>
              <BusinessIcon sx={{ fontSize: 60 }} />
            </Avatar>
            {editMode ? (
              <TextField
                label="Organization Name"
                value={editProfile.organization_name}
                onChange={e => handleChange("organization_name", e.target.value)}
                fullWidth
                sx={{ maxWidth: 350 }}
              />
            ) : (
              <Typography variant="h4" sx={{
                fontWeight: 700,
                background: 'linear-gradient(90deg, #FFD874, #FF407A)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.1em'
              }}>
                {profile.organization_name}
              </Typography>
            )}
            <Typography variant="subtitle1" color="text.secondary">
              Event Organizer Profile
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#ff407a", mb: 1 }}>
              Organization Information
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                <tbody>
                  <tr>
                    <td style={{ verticalAlign: 'top', width: '33%' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PhoneIcon color="primary" />
                        <Typography variant="subtitle2" color="text.secondary">Contact Number:</Typography>
                      </Stack>
                      {editMode ? (
                        <TextField
                          value={editProfile.contact_number}
                          onChange={e => handleChange("contact_number", e.target.value)}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        <Typography sx={{ ml: 4, color: "#000", fontWeight: "bold" }}>{profile.contact_number}</Typography>
                      )}
                    </td>
                    <td style={{ verticalAlign: 'top', width: '33%' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EmailIcon color="primary" />
                        <Typography variant="subtitle2" color="text.secondary">Email:</Typography>
                      </Stack>
                      {editMode ? (
                        <TextField
                          value={editProfile.email}
                          onChange={e => handleChange("email", e.target.value)}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        <Typography sx={{ ml: 4, color: "#000", fontWeight: "bold" }}>{profile.email}</Typography>
                      )}
                    </td>
                    <td style={{ verticalAlign: 'top', width: '33%' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <PersonIcon color="primary" />
                        <Typography variant="subtitle2" color="text.secondary">Username:</Typography>
                      </Stack>
                      {editMode ? (
                        <TextField
                          value={editProfile.username}
                          onChange={e => handleChange("username", e.target.value)}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        <Typography sx={{ ml: 4, color: "#000", fontWeight: "bold" }}>{profile.username}</Typography>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ verticalAlign: 'top', width: '33%' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <HomeIcon color="primary" />
                        <Typography variant="subtitle2" color="text.secondary">Address:</Typography>
                      </Stack>
                      {editMode ? (
                        <TextField
                          value={editProfile.address}
                          onChange={e => handleChange("address", e.target.value)}
                          size="small"
                          fullWidth
                        />
                      ) : (
                        <Typography sx={{ ml: 4, color: "#000", fontWeight: "bold" }}>{profile.address}</Typography>
                      )}
                    </td>
                    <td style={{ verticalAlign: 'top', width: '33%' }} colSpan={2}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <DescriptionIcon color="primary" />
                        <Typography variant="subtitle2" color="text.secondary">Description:</Typography>
                      </Stack>
                      {editMode ? (
                        <TextField
                          value={editProfile.description}
                          onChange={e => handleChange("description", e.target.value)}
                          size="small"
                          fullWidth
                          multiline
                          minRows={2}
                        />
                      ) : (
                        <Typography sx={{ ml: 4, color: "#000", fontWeight: "bold" }}>{profile.description}</Typography>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#ff407a", mb: 1 }}>
              Event Types
            </Typography>
            {profile.eventTypes && profile.eventTypes.length > 0 ? (
              <Box component="ul" sx={{ pl: 3, mb: 0 }}>
                {profile.eventTypes.map(type => (
                  <li
                    key={type.event_type_id}
                    style={{
                      marginBottom: 8,
                      color: "inherit",
                      fontWeight: 600,
                      fontSize: "1rem"
                    }}
                  >
                    <span style={{ color: "#000", fontWeight: "bold" }}>{type.event_type_name}</span>
                  </li>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No event types</Typography>
            )}
          </Box>
          {/* Edit/Save/Cancel buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            {editMode ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <button
                style={{
                  background: 'rgb(25, 118, 210)',
                  color: '#fff',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 28px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(25,118,210,0.12)'
                }}
                onClick={handleEdit}
              >
                Edit
              </button>
            )}
          </Box>
          {/* Dialog for result */}
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Status</DialogTitle>
            <DialogContent>
              <Typography>{dialogMsg}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>OK</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </Box>
  );
}