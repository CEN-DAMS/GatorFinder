import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import axios from 'axios';
const Login = () => {
  const [usernameEmail, setUsernameEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Login data:', { usernameEmail});
    let response
   if(usernameEmail.includes('ufl.edu')){

    response = await axios.get(`http://localhost:8080/login/requestOtp?email=${usernameEmail}`)
    navigate('/OTP')
   }
   else {
    setError('Only ufl.edu email addresses are allowed.');
  }
    
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, backgroundColor: '#f5f5f5', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#ffffff' }}>
        <Typography variant="h4" align="center" gutterBottom color="#ff9800">
          Login to Gator Finder
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Enter your UF Email"
            variant="outlined"
            required
            fullWidth
            value={usernameEmail}
            onChange={(e) => setUsernameEmail(e.target.value)}
          />         
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ textTransform: 'none' }}>
            Request OTP
          </Button>
        </Box>       
      </Paper>
      {error && <p style={{ color: 'red', fontSize: 'large' }}>{error}</p>}
      </Container>
    
  );
};

export default Login;