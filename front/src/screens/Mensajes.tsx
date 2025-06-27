// src/screens/Mensajes.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Spinner,
  Alert,
  Modal
} from 'react-bootstrap';
import axios from 'axios';

type Mensaje = {
  id: number;
  remiteNombre: string;
  receptor: string;
  asunto: string;
  cuerpo: string;
  fecha: string;
};

export default function Mensajes() {
  const [inbox, setInbox] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState(false);
  const [receptor, setReceptor] = useState('');
  const [asunto, setAsunto] = useState('');
  const [cuerpo, setCuerpo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Mensaje | null>(null);

  const fetchInbox = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/mensajes');
      setInbox(data.mensajes);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar mensajes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await axios.post('http://localhost:5000/mensajes', { receptor, asunto, cuerpo });
      setSuccess('Mensaje enviado');
      setReceptor('');
      setAsunto('');
      setCuerpo('');
      fetchInbox();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar mensaje');
    }
  };

  const openModal = (msg: Mensaje) => {
    setSelected(msg);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={6}>
          <h5>Enviar Mensaje</h5>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSend}>
            <Form.Group className="mb-3">
              <Form.Label>Matrícula receptor</Form.Label>
              <Form.Control
                value={receptor}
                onChange={e => setReceptor(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Asunto</Form.Label>
              <Form.Control
                value={asunto}
                onChange={e => setAsunto(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={cuerpo}
                onChange={e => setCuerpo(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit">Enviar</Button>
          </Form>
        </Col>
      </Row>

      <hr />

      <h5>Mensajes Recibidos</h5>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped hover responsive>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Emisor</th>
              <th>Asunto</th>
              <th>Mensaje</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inbox.map(m => (
              <tr key={m.id}>
                <td>{new Date(m.fecha).toLocaleString()}</td>
                <td>{m.remiteNombre}</td>
                <td style={{ maxWidth: '200px' }}>
                  <div
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {m.asunto}
                  </div>
                </td>
                <td style={{ maxWidth: '300px' }}>
                  <div
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {m.cuerpo}
                  </div>
                </td>
                <td>
                  <Button size="sm" onClick={() => openModal(m)}>
                    Ver
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal mostrar mensaje completo */}
      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Mensaje completo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <>
              <p><strong>De:</strong> {selected.remiteNombre}</p>
              <p><strong>Asunto:</strong> {selected.asunto}</p>
              <hr />
              <p style={{ whiteSpace: 'pre-wrap' }}>{selected.cuerpo}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
