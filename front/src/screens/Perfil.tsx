// src/screens/Perfil.tsx
import React, { useState, useEffect } from 'react';
import { Container, Breadcrumb, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Usuario = {
  username: string;
  nombre?: string;
  aPaterno?: string;
  aMaterno?: string;
  email?: string;
  rol?: string;
};

export default function Perfil() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:5000/auth/me');
        setUser(data.user);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar perfil');
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  if (loading) return <Spinner animation="border" className="m-4" />;
  if (error) return <Alert variant="danger" className="m-4">{error}</Alert>;
  if (!user) return null;

  return (
    <Container fluid className="mt-4">
      <Breadcrumb>
        <Breadcrumb.Item style={{ cursor: 'pointer' }} onClick={() => navigate('/alumnos')}>
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Mi Perfil</Breadcrumb.Item>
      </Breadcrumb>

      <Card className="p-4">
        <Card.Title>Mi Perfil</Card.Title>
        <Row className="mt-3">
          <Col md={4}><strong>Matrícula / Usuario:</strong></Col>
          <Col md={8}>{user.username}</Col>
        </Row>
        {user.nombre && (
          <Row className="mt-2">
            <Col md={4}><strong>Nombre:</strong></Col>
            <Col md={8}>{user.nombre} {user.aPaterno} {user.aMaterno}</Col>
          </Row>
        )}
        {user.email && (
          <Row className="mt-2">
            <Col md={4}><strong>Email:</strong></Col>
            <Col md={8}>{user.email}</Col>
          </Row>
        )}
        {user.rol && (
          <Row className="mt-2">
            <Col md={4}><strong>Rol:</strong></Col>
            <Col md={8}>{user.rol}</Col>
          </Row>
        )}
      </Card>
    </Container>
  );
}
