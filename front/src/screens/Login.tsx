// src/screens/Login.tsx
import React, { useState } from 'react';
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import ReCAPTCHA from 'react-google-recaptcha';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY!;

  // Login local
  const handleLocalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setErrorMsg('Por favor, completa el captcha');
      return;
    }
    try {
      const { data } = await axios.post(
        'http://localhost:5000/auth/login',
        { username, password, recaptchaToken }
      );
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      navigate('/alumnos');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Usuario o contraseña inválidos');
    }
  };

  // Login con Google
  const handleGoogleSuccess = async (res: CredentialResponse) => {
    if (!res.credential) {
      setErrorMsg('No se recibió credencial de Google');
      return;
    }
    if (!recaptchaToken) {
      setErrorMsg('Por favor, completa el captcha');
      return;
    }
    try {
      const { data } = await axios.post(
        'http://localhost:5000/auth/google',
        { idToken: res.credential, recaptchaToken }
      );
      localStorage.setItem('token', data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      navigate('/alumnos');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Error al autenticar con Google');
    }
  };
  const handleGoogleError = () => {
    setErrorMsg('Error en Google Login');
  };

  return (
    <Container className="mt-5" style={{ maxWidth: 400 }}>
      <h2 className="mb-4 text-center">Iniciar Sesión</h2>

      {errorMsg && (
        <Alert variant="danger" onClose={() => setErrorMsg(null)} dismissible>
          {errorMsg}
        </Alert>
      )}

      <Form onSubmit={handleLocalLogin}>
        <Form.Group className="mb-3" controlId="loginUsername">
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            type="text"
            placeholder="Matrícula"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="loginPassword">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        {/* reCAPTCHA */}
        <Row className="justify-content-center mb-4">
          <Col xs="auto">
            <ReCAPTCHA
              sitekey={siteKey}
              onChange={token => setRecaptchaToken(token)}
            />
          </Col>
        </Row>

        <Button variant="primary" type="submit" className="w-100 mb-3">
          Entrar
        </Button>
      </Form>

      <div className="text-center mb-3">
        <small>
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </small>
      </div>

      <Row className="justify-content-center">
        <Col xs="auto">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </Col>
      </Row>
    </Container>
  );
}
