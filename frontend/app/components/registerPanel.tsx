import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useAuthApi } from '~/api/authApi';

interface RegisterPanelProps {}

export default function RegisterPanel({}: RegisterPanelProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const authApi = useAuthApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await authApi.register({ username, password });
      // Registration successful
      console.log('Registration successful');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm" style={{ maxWidth: '500px', width: '100%' }}>
      <Card.Body className="p-4">
        <h2 className="text-center mb-4">Create a new account</h2>
        
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-white border border-secondary"
            />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isInvalid={!!error && error.includes("Passwords")}
              disabled={isLoading}
              className="bg-white border border-secondary"
            />
            {error.includes("Passwords") && (
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 mt-3"
            disabled={isLoading}
          >
            {isLoading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
            Register
          </Button>
          
          <div className="text-center mt-3">
            <small className="text-muted">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </small>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
