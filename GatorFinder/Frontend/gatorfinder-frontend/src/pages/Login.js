import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';

const Login = () => {
  const [usernameEmail, setUsernameEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login data:', { usernameEmail, password });

    // TODO: Add actual authentication logic here

    // After successful login, redirect to Home
    navigate('/home');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, backgroundColor: '#f5f5f5', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#ffffff' }}>
        <Typography variant="h4" align="center" gutterBottom color="#ff9800">
          LOGIN
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Username or Email"
            variant="outlined"
            required
            fullWidth
            value={usernameEmail}
            onChange={(e) => setUsernameEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ textTransform: 'none' }}>
            Login
          </Button>
        </Box>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;