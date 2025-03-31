import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

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

  const [newEvent, setNewEvent] = useState({
    uid: 1,
    username: "temp",
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    image: "temp"
  });
  
  const [openDialog, setOpenDialog] = useState(false);
  const handleCreateEvent = async () => {
    console.log("Posting event:", newEvent);
    try {
      await axios.post("http://localhost:8080/events/add", newEvent);
      setOpenDialog(false);
      setNewEvent({
        name: '',
        description: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        image: ''
      });
      fetchEvents();
    } catch (err) {
      setError("Failed to create event");
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
        <Fab
          color="primary"
          aria-label="add"
          sx={{ position: 'fixed', bottom: 32, right: 32, backgroundColor: '#ff9800' }}
          onClick={() => setOpenDialog(true)}
        >
          <AddIcon />
        </Fab>
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>Create Event</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Event Name"
              value={newEvent.name}
              onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            />
            <TextField
              label="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              multiline
              rows={3}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                fullWidth
              />
              <TextField
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                fullWidth
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Start Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                fullWidth
              />
              <TextField
                label="End Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateEvent} variant="contained" sx={{ textTransform: 'none' }}>
              Create
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </>
  );
};

export default Home;