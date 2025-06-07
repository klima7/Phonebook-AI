import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  // Redirect to home if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.non_field_errors?.[0] || 'Invalid credentials');
      }

      if (!data.token) {
        throw new Error('No authentication token received');
      }

      // Store token and redirect
      login(data.token);
      navigate("/");
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-5">
      <Container className="py-4">
        <div className="d-flex justify-content-center">
          <Card className="shadow-sm" style={{ maxWidth: '500px', width: '100%' }}>
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Sign in to your account</h2>
              
              <Form onSubmit={handleSubmit}>
                {error && (
                  <Alert variant="danger" className="mb-3">
                    {error}
                  </Alert>
                )}
                
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="bg-white border border-secondary"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="bg-white border border-secondary"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mt-3"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                  Sign In
                </Button>
                
                <div className="text-center mt-3">
                  <small className="text-muted">
                    Don't have an account?{' '}
                    <Link to="/register">Register here</Link>
                  </small>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
} 