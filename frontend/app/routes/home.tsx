import type { Route } from "./+types/home";
import { Container, Paper, Typography, Box } from '@mui/material';
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Phonebook" },
    { name: "description", content: "Welcome to Phonebook!" },
  ];
}

export default function HomePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <Box sx={{ py: 6, minHeight: 'calc(100vh - 64px)' }}>
        <Container maxWidth="sm">
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Welcome to Phonebook
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
              Your AI powered phonebook!
            </Typography>
            {user && (
              <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                Hello, {user.username}!
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}
