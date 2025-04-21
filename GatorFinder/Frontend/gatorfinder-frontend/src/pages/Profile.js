import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Avatar,
  TextField,
  Button,
  Divider,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import UploadIcon from '@mui/icons-material/Upload';
import axios from 'axios';


const Profile = () => {
  const [profileData, setProfileData] = useState({
    username: 'gatorUser123',
    email: 'user@example.com',
    role: 'Student',
    bio: '',
    image: null,
    birthday: '',
  });

  const handleChange = (field) => (e) => {
    setProfileData({ ...profileData, [field]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setProfileData({ ...profileData, image: imgUrl });
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('http://localhost:8080/api/user/profile', profileData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile.');
    }
  };  

  return (
    <>
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #ff9800 30%, #ffb300 90%)', boxShadow: 4 }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}
            >
              <span
                role="img"
                aria-label="alligator"
                style={{ fontSize: '2.5rem', marginRight: '8px' }}
              >
                🐊
              </span>
              GatorFinder
            </Typography>
          </Box>
          <IconButton
            component={Link}
            to="/home"
            sx={{ color: '#000000' }}
            aria-label="Home"
          >
            <HomeIcon fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box
          sx={{
            p: 3,
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h5">Your Profile</Typography>

          <Avatar
            src={profileData.image}
            sx={{ width: 100, height: 100 }}
          />
          <Button
            component="label"
            variant="outlined"
            startIcon={<UploadIcon />}
            sx={{ textTransform: 'none' }}
          >
            Upload Profile Picture
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>

          <Divider sx={{ width: '100%', my: 2 }} />

          <TextField
            fullWidth
            label="Username"
            value={profileData.username}
            onChange={handleChange('username')}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={profileData.email}
            onChange={handleChange('email')}
          />
          <TextField
            fullWidth
            label="Birthday"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={profileData.birthday}
            onChange={handleChange('birthday')}
          />
          <TextField
            fullWidth
            label="Role"
            value={profileData.role}
            onChange={handleChange('role')}
          />
          <TextField
            fullWidth
            label="Bio"
            value={profileData.bio}
            multiline
            rows={3}
            onChange={handleChange('bio')}
          />
          <Button
            variant="contained"
            sx={{ mt: 2, textTransform: 'none' }}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Profile;
