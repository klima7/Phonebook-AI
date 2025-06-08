import { Link, useNavigate } from "react-router";
import { Container, Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const buttonStyle = {
    border: '1px solid white',
    borderRadius: '4px',
    padding: '0.375rem 0.75rem',
    margin: '0 0.25rem',
    backgroundColor: 'transparent'
  };

  return (
    <BootstrapNavbar bg="primary" variant="dark">
      <Container className="d-flex flex-row justify-content-between align-items-center">
        <BootstrapNavbar.Brand as={Link} to="/">Phonebook</BootstrapNavbar.Brand>
        <Nav className="d-flex flex-row">
          {isAuthenticated ? (
            <>
              <Nav.Link as="span" className="text-light">
                {user?.username}
              </Nav.Link>
              <Nav.Link onClick={handleLogout} className="text-light" style={buttonStyle}>
                Logout
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login" className="text-light" style={buttonStyle}>
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" className="text-light" style={buttonStyle}>
                Register
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </BootstrapNavbar>
  );
}