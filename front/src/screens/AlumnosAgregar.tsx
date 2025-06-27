// src/screens/AlumnosAgregar.tsx
import React, { useState } from 'react';
import {
  Breadcrumb,
  Container,
  Row,
  Col,
  FloatingLabel,
  Form,
  Button,
  Card
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

type AlumnoPayload = {
  matricula: string;
  nombre: string;
  aPaterno: string;
  aMaterno: string;
  sexo: string;
  aTelefono: string;
  aCorreo: string;
  aFacebook: string;
  aInstagram: string;
  tiposangre: string;
  contrasenha: string;
  dCalle: string;
  dNumero: number | string;
  dColonia: string;
  dCodigoPostal: number | string;
  nombreContacto: string;
  telefonoContacto: string;
};

const initialState: AlumnoPayload = {
  matricula: '',
  nombre: '',
  aPaterno: '',
  aMaterno: '',
  sexo: '',
  aTelefono: '',
  aCorreo: '',
  aFacebook: '',
  aInstagram: '',
  tiposangre: '',
  contrasenha: '',
  dCalle: '',
  dNumero: '',
  dColonia: '',
  dCodigoPostal: '',
  nombreContacto: '',
  telefonoContacto: ''
};

export default function AlumnosAgregar() {
  const [alumno, setAlumno] = useState<AlumnoPayload>(initialState);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/alumnos', alumno);
      Swal.fire('¡Éxito!', 'Alumno agregado correctamente.', 'success');
      navigate('/alumnos');
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.message || 'No se pudo agregar.', 'error');
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setAlumno(prev => ({ ...prev, [name]: name.includes('Telefono') ? value.replace(/\D/g, '') : value }));
  };

  return (
    <>
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item onClick={() => navigate('/alumnos')} style={{ cursor: 'pointer' }}>
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Agregar Alumno</Breadcrumb.Item>
      </Breadcrumb>

      <Container>
        <Card className="p-4">
          <Form onSubmit={handleSubmit}>
            {/* Sección personal */}
            <h5>Datos personales</h5>
            <Row className="gy-3">
              <Col md={4}>
                <FloatingLabel label="Matrícula">
                  <Form.Control
                    name="matricula"
                    value={alumno.matricula}
                    onChange={handleChange}
                    required
                  />
                </FloatingLabel>
              </Col>
              <Col md={4}>
                <FloatingLabel label="Nombre">
                  <Form.Control name="nombre" value={alumno.nombre} onChange={handleChange} required />
                </FloatingLabel>
              </Col>
              <Col md={4}>
                <FloatingLabel label="Apellido Paterno">
                  <Form.Control name="aPaterno" value={alumno.aPaterno} onChange={handleChange} required />
                </FloatingLabel>
              </Col>

              <Col md={4}>
                <FloatingLabel label="Apellido Materno">
                  <Form.Control name="aMaterno" value={alumno.aMaterno} onChange={handleChange} />
                </FloatingLabel>
              </Col>
              <Col md={4}>
                <FloatingLabel label="Sexo">
                  <Form.Select name="sexo" value={alumno.sexo} onChange={handleChange} required>
                    <option value="">Selecciona</option>
                    <option value="1">Masculino</option>
                    <option value="2">Femenino</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col md={4}>
                <FloatingLabel label="Teléfono">
                  <Form.Control name="aTelefono" value={alumno.aTelefono} onChange={handleChange} />
                </FloatingLabel>
              </Col>
            </Row>

            {/* Sección de contacto */}
            <h5 className="mt-4">Contacto</h5>
            <Row className="gy-3">
              <Col md={6}>
                <FloatingLabel label="Correo Electrónico">
                  <Form.Control name="aCorreo" value={alumno.aCorreo} onChange={handleChange} type="email" required />
                </FloatingLabel>
              </Col>
              <Col md={3}>
                <FloatingLabel label="Facebook">
                  <Form.Control name="aFacebook" value={alumno.aFacebook} onChange={handleChange} />
                </FloatingLabel>
              </Col>
              <Col md={3}>
                <FloatingLabel label="Instagram">
                  <Form.Control name="aInstagram" value={alumno.aInstagram} onChange={handleChange} />
                </FloatingLabel>
              </Col>
            </Row>

            {/* Sección adicional */}
            <h5 className="mt-4">Información adicional</h5>
            <Row className="gy-3">
              <Col md={4}>
                <FloatingLabel label="Tipo de Sangre">
                  <Form.Control name="tiposangre" value={alumno.tiposangre} onChange={handleChange} />
                </FloatingLabel>
              </Col>
              <Col md={4}>
                <FloatingLabel label="Contraseña">
                  <Form.Control
                    name="contrasenha"
                    type="password"
                    value={alumno.contrasenha}
                    onChange={handleChange}
                    required
                  />
                </FloatingLabel>
              </Col>
            </Row>

            {/* Sección dirección */}
            <h5 className="mt-4">Dirección</h5>
            <Row className="gy-3">
              <Col md={6}>
                <FloatingLabel label="Calle">
                  <Form.Control name="dCalle" value={alumno.dCalle} onChange={handleChange} required />
                </FloatingLabel>
              </Col>
              <Col md={2}>
                <FloatingLabel label="Número">
                  <Form.Control name="dNumero" type="number" value={alumno.dNumero} onChange={handleChange} required />
                </FloatingLabel>
              </Col>
              <Col md={4}>
                <FloatingLabel label="Colonia">
                  <Form.Control name="dColonia" value={alumno.dColonia} onChange={handleChange} required />
                </FloatingLabel>
              </Col>
            </Row>
            <Row className="gy-3 mt-3">
              <Col md={3}>
                <FloatingLabel label="C.P.">
                  <Form.Control name="dCodigoPostal" type="number" value={alumno.dCodigoPostal} onChange={handleChange} required />
                </FloatingLabel>
              </Col>
            </Row>

            {/* Sección contacto emergencia */}
            <h5 className="mt-4">Contacto de Emergencia</h5>
            <Row className="gy-3">
              <Col md={6}>
                <FloatingLabel label="Nombre">
                  <Form.Control name="nombreContacto" value={alumno.nombreContacto} onChange={handleChange} required />
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel label="Teléfono">
                  <Form.Control name="telefonoContacto" value={alumno.telefonoContacto} onChange={handleChange} required />
                </FloatingLabel>
              </Col>
            </Row>

            {/* Botones */}
            <Row className="mt-4">
              <Col className="text-end">
                <Button variant="secondary" onClick={() => setAlumno(initialState)} className="me-2">
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Guardar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
    </>
  );
}
