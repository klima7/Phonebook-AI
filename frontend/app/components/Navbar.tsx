import { Link, useNavigate } from "react-router";
import { Container, Navbar as BootstrapNavbar, Nav } from 'react-bootstrap';
import { useAuth } from "../contexts/AuthContext";

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
    <BootstrapNavbar bg="primary" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">☎️ Phonebook</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
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
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}