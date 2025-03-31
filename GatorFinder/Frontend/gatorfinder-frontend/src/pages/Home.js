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
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [displayType, setDisplayType] = useState('events');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [rawEventData, setRawEventData] = useState(null);

  const filteredEvents = events.filter(
    (event) =>
      event.eventname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventdescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.username?.toLowerCase().includes(searchTerm.toLowerCase())
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
      console.log("Events API response:", response.data);
    
      setRawEventData(response.data);
      
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

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const renderEventCard = (event, index) => {
    return (
      <Card 
        key={event.id || index}
        sx={{ 
          mb: 2, 
          boxShadow: 3,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <CardHeader
          title={event.eventname || 'Untitled Event'}
          subheader={`Posted by: ${event.username || 'Unknown'}`}
          sx={{ 
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #e0e0e0'
          }}
        />
        <CardContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {event.eventdescription || 'No description available'}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="subtitle2" color="text.secondary">
            Event Details:
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
            {event.startDate && (
              <Typography variant="body2">
                <strong>Start Date:</strong> {event.startDate}
              </Typography>
            )}
            {event.endDate && (
              <Typography variant="body2">
                <strong>End Date:</strong> {event.endDate}
              </Typography>
            )}
            {event.startTime && (
              <Typography variant="body2">
                <strong>Start Time:</strong> {event.startTime}
              </Typography>
            )}
            {event.endTime && (
              <Typography variant="body2">
                <strong>End Time:</strong> {event.endTime}
              </Typography>
            )}
            {event.created && (
              <Typography variant="body2">
                <strong>Created:</strong> {event.created}
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
                  borderRadius: '4px'
                }} 
              />
            </Box>
          )}
        </CardContent>
      </Card>
    );
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
            {displayType === 'events' && rawEventData && (
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
                filteredEvents.map((event, index) => renderEventCard(event, index))
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
    </>
  );
};

export default Home;