// src/components/Register.tsx
import React, { useState } from 'react';
import { Form, Button, Row, Col, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';

const Register: React.FC = () => {
  const [matricula, setMatricula] = useState<string>('');
  const [contrasenha, setContrasenha] = useState<string>('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const navigate = useNavigate();
  const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY!; // asegúrate de definir esta variable en tu .env

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recaptchaToken) {
      setMsg({ type: 'error', text: 'Por favor, completa el CAPTCHA antes de continuar.' });
      return;
    }

    try {
      const { data } = await axios.post(
        'http://localhost:5000/auth/register',
        { matricula, contrasenha, recaptchaToken }
      );
      setMsg({ type: 'success', text: 'Cuenta creada correctamente. Redirigiendo al login…' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      const errorText =
        err.response?.data?.message || 'Ocurrió un error al crear la cuenta.';
      setMsg({ type: 'error', text: errorText });
      // reset CAPTCHA para que el usuario pueda volver a intentarlo
      if (window.grecaptcha && typeof window.grecaptcha.reset === 'function') {
        window.grecaptcha.reset();
        setRecaptchaToken(null);
      }
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Crear cuenta</h2>
      {msg && (
        <Alert variant={msg.type === 'error' ? 'danger' : 'success'}>
          {msg.text}
        </Alert>
      )}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="matricula" className="mb-3">
          <Form.Label>Matrícula</Form.Label>
          <Form.Control
            type="text"
            value={matricula}
            onChange={e => setMatricula(e.target.value)}
            placeholder="Ingresa tu matrícula"
            required
          />
        </Form.Group>

        <Form.Group controlId="contrasenha" className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={contrasenha}
            onChange={e => setContrasenha(e.target.value)}
            placeholder="Ingresa tu contraseña"
            required
          />
        </Form.Group>

        <Row className="justify-content-center mb-4">
          <Col xs="auto">
            <ReCAPTCHA
              sitekey={siteKey}
              onChange={token => setRecaptchaToken(token)}
            />
          </Col>
        </Row>

        <div className="d-grid">
          <Button variant="primary" type="submit">
            Crear cuenta
          </Button>
        </div>
      </Form>
      <Row className="mt-3">
        <Col className="text-center">
          ¿Ya tienes cuenta?{' '}
          <Button variant="link" onClick={() => navigate('/')}>
            Inicia sesión
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
