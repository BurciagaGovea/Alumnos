// src/screens/ServerError.tsx
import React from 'react';
import { Container, Button } from 'react-bootstrap';

export default function ServerError() {
  return (
    <Container className="text-center mt-5">
      <h1>500</h1>
      <p>Ha ocurrido un error en el servidor. Por favor intenta de nuevo más tarde.</p>
      <Button onClick={() => window.location.reload()}>Recargar</Button>
    </Container>
  );
}
