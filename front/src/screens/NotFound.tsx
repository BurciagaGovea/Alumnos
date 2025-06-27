// src/screens/NotFound.tsx
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const nav = useNavigate();
  return (
    <Container className="text-center mt-5">
      <h1>404</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Button onClick={() => nav('/alumnos')}>Ir a Inicio</Button>
    </Container>
  );
}
