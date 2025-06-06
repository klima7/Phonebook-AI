import type { Route } from "./+types/home";
import { Container, Card } from 'react-bootstrap';
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
      <div className="py-5 min-vh-100">
        <Container className="py-4">
          <div className="d-flex justify-content-center">
            <Card className="shadow-sm mt-4" style={{ maxWidth: '500px', width: '100%' }}>
              <Card.Body className="p-4">
                <h1 className="text-center mb-3">Welcome to Phonebook</h1>
                <p className="text-center text-muted mb-3">
                  Your AI powered phonebook!
                </p>
                {user && (
                  <h5 className="text-center mt-4">
                    Hello, {user.username}!
                  </h5>
                )}
              </Card.Body>
            </Card>
          </div>
        </Container>
      </div>
    </ProtectedRoute>
  );
}
