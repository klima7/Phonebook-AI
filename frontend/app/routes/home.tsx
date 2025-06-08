import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import ProtectedRoute from "../components/ProtectedRoute";
import ContactsList from "../components/ContactsList";
import Chat from "../components/Chat";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div>
        <Container fluid className="pt-4 px-4">
          <Row>
            <Col md={7}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-5"
              >
                <ContactsList/>
              </motion.div>
            </Col>
            
            <Col md={5}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Chat/>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>
    </ProtectedRoute>
  );
}
