import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [matricula, setMatricula] = useState('');
  const [contrasenha, setContrasenha] = useState('');
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/auth/register', {
        matricula,
        contrasenha
      });
      setMsg({ type: 'success', text: data.message });
      // Después de 1s, redirige a login
      setTimeout(() => navigate('/'), 1000);
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Error al registrar' });
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4 text-center">Registro de Usuario</h2>

      {msg && (
        <Alert variant={msg.type === 'error' ? 'danger' : 'success'}>
          {msg.text}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="regMatricula">
          <Form.Label>Matrícula</Form.Label>
          <Form.Control
            type="text"
            value={matricula}
            onChange={e => setMatricula(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="regContrasenha">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={contrasenha}
            onChange={e => setContrasenha(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Crear cuenta
        </Button>
      </Form>

      <div className="mt-3 text-center">
        <Link to="/">¿Ya tienes cuenta? Inicia sesión</Link>
      </div>
    </Container>
  );
}
