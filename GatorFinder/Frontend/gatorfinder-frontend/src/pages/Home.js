import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const events = [
    { id: 1, title: 'Event 1', description: 'Event 1 Description' },
    { id: 2, title: 'Event 2', description: 'Event 2 Description' },
    { id: 3, title: 'Event 3', description: 'Event 3 Description' },
  ];

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8080/events/get");
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch Events");
      setData(null);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/users/get");
      setData(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch Users");
      setData(null);
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#ff9800' }}>
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
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button component={Link} to="/login" sx={{ color: '#000000', textTransform: 'none' }}>
              LOGIN
            </Button>
            <Button component={Link} to="/signup" sx={{ color: '#000000', textTransform: 'none' }}>
              SIGN UP
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container 
        maxWidth="md" 
        sx={{ 
          mt: 4, 
          backgroundColor: '#f5f5f5',
          p: 3, 
          borderRadius: 2,
          boxShadow: 3
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: <SearchIcon sx={{ color: 'grey.500' }} />,
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredEvents.map((event) => (
            <Box
              key={event.id}
              sx={{
                border: 1,
                borderColor: 'grey.300',
                borderRadius: 2,
                p: 2,
                backgroundColor: '#ffffff'
              }}
            >
              <Typography variant="h3">{event.title}</Typography>
              <Typography variant="body1">{event.description}</Typography>
            </Box>
          ))}
        </Box>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={fetchEvents} sx={{ mr: 2, textTransform: 'none' }}>
            Get Events
          </Button>
          <Button variant="contained" onClick={fetchUsers} sx={{ textTransform: 'none' }}>
            Get Users
          </Button>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {data && (
            <pre
              style={{
                textAlign: 'left',
                background: "#e0e0e0",
                padding: "10px",
                marginTop: "16px",
                borderRadius: 4,
              }}
            >
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;