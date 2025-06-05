import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Container, Box, Typography, TextField, Button, Paper, Alert, Stack, Link as MuiLink } from '@mui/material';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Here you would typically make an API call to authenticate
    console.log("Login attempt with:", { username, password });
    
    // For demo purposes, just redirect to home
    // In a real app, you'd validate credentials first
    navigate("/");
  };

  return (
    <Box sx={{ py: 6, minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Sign in to your account
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Stack spacing={2}>
              <TextField
                label="Username"
                type="text"
                fullWidth
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary" display="inline">
                Don't have an account?{' '}
              </Typography>
              <MuiLink component={Link} to="/register" variant="body2">
                Register here
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 