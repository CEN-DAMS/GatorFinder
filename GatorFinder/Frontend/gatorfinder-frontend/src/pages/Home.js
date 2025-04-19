import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box, 
  TextField,
  Alert,
  CircularProgress,
  Snackbar,
  Card,
  CardContent,
  CardHeader,
  Divider
} from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { IconButton } from '@mui/material';
import axios from 'axios';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [calenderEvents, setcalenderEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [displayType, setDisplayType] = useState('events');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [rawEventData, setRawEventData] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  const filteredEvents = calenderEvents.filter((event) =>
    [event[2]]
      .filter(Boolean)
      .some(field => field.toLowerCase().includes(searchTerm.toLowerCase())),
      console.log(events)
  );

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const normalizeData = (data) => {
    if (!data) return [];
    
    if (Array.isArray(data)) return data;
    
    if (typeof data === 'object') {
      if (data.id || data.eventname || data.name) {
        return [data];
      }
      
      for (const key in data) {
        if (Array.isArray(data[key])) {
          return data[key];
        }
      }
      
      return [data];
    }
    
    return [];
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get("http://localhost:8080/events/get");
      const scrapperResponse = await axios.get("http://localhost:8080//users/getcalender");
      console.log("Events API response:", response.data);
      console.log("Scrapper API response:", scrapperResponse.data);
    
      setRawEventData(response.data);
      setcalenderEvents(scrapperResponse.data)
      const normalizedData = normalizeData(response.data);
      console.log("Normalized events data:", normalizedData);
      
      setEvents(normalizedData);
      setDisplayType('events');

      if (normalizedData.length > 0) {
        const eventToPost = { ...normalizedData[0] };
        
        try {
          const postResponse = await axios.post("http://localhost:8080/events/add", eventToPost);
          console.log("POST response:", postResponse.data);
          
          setSnackbar({
            open: true,
            message: 'Event data successfully posted to server!',
            severity: 'success'
          });
        } catch (postErr) {
          console.error("Error posting event data:", postErr);
          setSnackbar({
            open: true,
            message: `Error posting data: ${postErr.message}`,
            severity: 'error'
          });
        }
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(`Failed to fetch Events: ${err.message}`);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get("http://localhost:8080/users/get");
      console.log("Users API response:", response.data);
      
      const normalizedData = normalizeData(response.data);
      console.log("Normalized users data:", normalizedData);
      
      setUsers(normalizedData);
      setDisplayType('users');
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(`Failed to fetch Users: ${err.message}`);
      setUsers([]);
    } finally {
      setLoading(false);
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

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const renderEventCard = (calendarEvents, index) => {
    // Check if the event exists and is in the correct format
    const event = calendarEvents[index];
    
    if (event && Array.isArray(event) && event.length === 3) {
      const [description = '', time = '', title = ''] = event;  // Default to empty strings if missing
      
      return (
        <Card 
          key={index} // Use the index as the key
          sx={{ 
            mb: 2, 
            boxShadow: 3,
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          <CardHeader
            title={title || 'Untitled Event'}
            subheader={`Event Time: ${time || 'Unknown time'}`}
            sx={{ 
              backgroundColor: '#f5f5f5',
              borderBottom: '1px solid #e0e0e0'
            }}
          />
          <CardContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {description || 'No description available'}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
              {time && (
                <Typography variant="body2">
                  <strong>Event Time:</strong> {time}
                </Typography>
              )}
            </Box>
            {event.image && (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
          Event Image:
        </Typography>
        <img
          src={event.image}
          alt={event.eventname || 'Event'}
          style={{
            maxWidth: '100%',
            maxHeight: '200px',
            objectFit: 'contain',
            borderRadius: '4px',
          }}
        />
      </Box>
            )}
              </CardContent>
        </Card>
      );
    } else {
      console.error("Invalid event data at index:", index, event);
      return null; // Return null or an error message if data is invalid
    }
  };
  

  const renderUserCard = (user, index) => {
    return (
      <Card 
        key={user.id || index}
        sx={{ 
          mb: 2, 
          boxShadow: 3,
          borderRadius: 2
        }}
      >
        <CardHeader
          title={user.name || 'Unknown User'}
          subheader={user.email || 'No email available'}
          sx={{ 
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #e0e0e0'
          }}
        />
        <CardContent>
          <Box sx={{ mt: 1 }}>
            {Object.entries(user)
              .filter(([key]) => !['id', 'name', 'email'].includes(key))
              .map(([key, value]) => (
                <Typography key={key} variant="body2" sx={{ mb: 0.5 }}>
                  <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
                </Typography>
              ))}
          </Box>
        </CardContent>
      </Card>
    );
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              component={Link} 
              to="/profile" 
              sx={{ color: '#000000' }}
              aria-label="Profile"
            >
              <AccountBoxIcon fontSize="large" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Container 
        maxWidth="md" 
        sx={{ 
          mt: 4, 
          mb: 4,
          p: 0
        }}
      >
        <Box 
          sx={{ 
            backgroundColor: '#f5f5f5',
            p: 3, 
            borderRadius: 2,
            boxShadow: 3,
            mb: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={`Search ${displayType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon sx={{ color: 'grey.500' }} />,
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', mb: 3 }}>
            <Button 
              variant={displayType === 'events' ? "contained" : "outlined"} 
              onClick={fetchEvents} 
              sx={{ mr: 2, textTransform: 'none' }}
              disabled={loading && displayType === 'events'}
            >
              {loading && displayType === 'events' ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading...
                </Box>
              ) : 'Show Events & Post'}
            </Button>
            <Button 
              variant={displayType === 'users' ? "contained" : "outlined"} 
              onClick={fetchUsers} 
              sx={{ textTransform: 'none' }}
              disabled={loading && displayType === 'users'}
            >
              {loading && displayType === 'users' ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading...
                </Box>
              ) : 'Show Users'}
            </Button>
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
        
        {loading && !error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {displayType === 'events' && rawEventData && showDebug && (
                <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2 }}>
                <CardHeader 
                  title="Raw JSON Data" 
                  sx={{ 
                    backgroundColor: '#e3f2fd',
                    borderBottom: '1px solid #bbdefb'
                  }}
                />
                <CardContent>
                  <Box 
                    sx={{ 
                      p: 2, 
                      backgroundColor: '#f5f5f5', 
                      borderRadius: 1,
                      maxHeight: '300px',
                      overflow: 'auto'
                    }}
                  >
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {JSON.stringify(rawEventData, null, 2)}
                    </pre>
                  </Box>
                </CardContent>
              </Card>
            )}
            <Box>
              {displayType === 'events' && filteredEvents.length > 0 ? (
                filteredEvents.map((calendarEvents, index) => renderEventCard(calenderEvents, index))
              ) : displayType === 'events' && !loading ? (
                <Alert severity="info">
                  No events found. Click "Show Events & Post" to fetch events.
                </Alert>
              ) : null}
              
              {displayType === 'users' && filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => renderUserCard(user, index))
              ) : displayType === 'users' && !loading ? (
                <Alert severity="info">
                  No users found. Click "Show Users" to fetch users.
                </Alert>
              ) : null}
            </Box>
          </>
        )}
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
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
        <Button
          onClick={() => setShowDebug(prev => !prev)}
          sx={{
            position: 'fixed',
            bottom: 32,
            left: 32,
            backgroundColor: 'rgba(255, 89, 0, 0.2)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(4px)',
            fontSize: '0.85rem',
            padding: '6px 12px',
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(255, 183, 0, 0.1)',
              borderColor: '#ffffff',
            },
          }}
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'}
        </Button>

    </>
  );
};

export default Home;