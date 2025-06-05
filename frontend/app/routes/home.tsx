import type { Route } from "./+types/home";
import { Container, Paper, Typography, Box } from '@mui/material';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Phonebook" },
    { name: "description", content: "Welcome to Phonebook!" },
  ];
}

export default function HomePage() {
  return (
    <Box sx={{ py: 6, minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome to Phonebook
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary">
            Your AI powered phonebook!
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
