import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Container, Box, Typography, TextField, Button, Paper, Alert, Stack, Link as MuiLink } from '@mui/material';

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Here you would typically make an API call to register the user
    console.log("Registration attempt with:", { email, password });
    
    // For demo purposes, just redirect to login
    // In a real app, you'd register the user first
    navigate("/login");
  };

  return (
    <Box sx={{ py: 6, minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Create a new account
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Stack spacing={2}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!error && error.includes("Passwords")}
                helperText={error.includes("Passwords") ? error : ""}
              />
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary" display="inline">
                Already have an account?{' '}
              </Typography>
              <MuiLink component={Link} to="/login" variant="body2">
                Sign in
              </MuiLink>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 