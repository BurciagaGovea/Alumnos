// src/screens/AlumnoModificar.tsx
import React, { useState } from 'react';
import {
  Breadcrumb,
  Container,
  Row,
  Col,
  FloatingLabel,
  Form,
  Button,
  InputGroup,
  FormControl,
  Card
} from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

// Tipado igual al de agregar
type AlumnoPayload = {
  matricula: string;
  nombre: string;
  aPaterno: string;
  aMaterno: string;
  sexo: string;              // '1' o '2'
  aTelefono: string;         // solo dígitos
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
  telefonoContacto: string;  // solo dígitos
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

export default function AlumnoModificar() {
  const [buscarMatricula, setBuscarMatricula] = useState('');
  const [alumno, setAlumno] = useState<AlumnoPayload>(initialState);
  const navigate = useNavigate();

  const buscarAlumno = async () => {
    if (!buscarMatricula.trim()) {
      Swal.fire('Campo vacío', 'Por favor ingresa una matrícula', 'warning');
      return;
    }
    try {
      const { data } = await axios.get(
        `http://localhost:5000/alumnos/${buscarMatricula}`
      );
      const resultados = data.results as any[];
      if (resultados.length) {
        const datos = resultados[0];
        setAlumno({
          matricula: datos.matricula,
          nombre: datos.nombre,
          aPaterno: datos.aPaterno,
          aMaterno: datos.aMaterno || '',
          sexo: String(datos.sexo),
          aTelefono: datos.aTelefono || '',
          aCorreo: datos.aCorreo,
          aFacebook: datos.aFacebook || '',
          aInstagram: datos.aInstagram || '',
          tiposangre: datos.tiposangre || '',
          contrasenha: '',
          dCalle: datos.dCalle || '',
          dNumero: datos.dNumero != null ? datos.dNumero : '',
          dColonia: datos.dColonia || '',
          dCodigoPostal: datos.dCodigoPostal != null ? datos.dCodigoPostal : '',
          nombreContacto: datos.nombreContacto || '',
          telefonoContacto: datos.telefonoContacto || ''
        });
      } else {
        Swal.fire('No encontrado', 'No existe alumno con esa matrícula', 'error');
        setAlumno(initialState);
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Error al obtener alumno', 'error');
      setAlumno(initialState);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let { name, value } = e.target;
    if (name === 'aTelefono' || name === 'telefonoContacto') {
      value = value.replace(/\D/g, '');
    }
    if (name === 'dNumero' || name === 'dCodigoPostal') {
      value = value === '' ? '' : Number(value);
    }
    setAlumno({ ...alumno, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/alumnos/${alumno.matricula}`,
        alumno
      );
      Swal.fire('Éxito', 'Alumno actualizado correctamente', 'success');
      setAlumno(initialState);
      setBuscarMatricula('');
      navigate('/alumnos');
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.errors) {
        const msgs = err.response.data.errors
          .map((e: any) => e.message)
          .join('<br/>');
        Swal.fire({ icon: 'error', title: 'Error', html: msgs });
      } else {
        Swal.fire('Error', 'No se pudo actualizar el alumno', 'error');
      }
    }
  };

  const handleCancelar = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No se guardarán los cambios',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        setAlumno(initialState);
        setBuscarMatricula('');
      }
    });
  };

  return (
    <>
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item
          onClick={() => navigate('/alumnos')}
          style={{ cursor: 'pointer' }}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Modificar Alumno</Breadcrumb.Item>
      </Breadcrumb>

      <Container>
        {/* Sección de búsqueda */}
        <Card className="p-4 mb-4">
          <h5>Buscar Alumno</h5>
          <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <InputGroup>
                <FormControl
                  placeholder="Matrícula"
                  value={buscarMatricula}
                  onChange={e => setBuscarMatricula(e.target.value)}
                />
                <Button variant="primary" onClick={buscarAlumno}>
                  Buscar
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Card>

        {/* Formulario de modificación - Solo aparece cuando hay datos */}
        {alumno.matricula && (
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
                      readOnly
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Nombre">
                    <Form.Control 
                      name="nombre" 
                      value={alumno.nombre} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Apellido Paterno">
                    <Form.Control 
                      name="aPaterno" 
                      value={alumno.aPaterno} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </FloatingLabel>
                </Col>

                <Col md={4}>
                  <FloatingLabel label="Apellido Materno">
                    <Form.Control 
                      name="aMaterno" 
                      value={alumno.aMaterno} 
                      onChange={handleInputChange} 
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Sexo">
                    <Form.Select 
                      name="sexo" 
                      value={alumno.sexo} 
                      onChange={handleInputChange} 
                      required
                    >
                      <option value="">Selecciona</option>
                      <option value="1">Masculino</option>
                      <option value="2">Femenino</option>
                    </Form.Select>
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Teléfono">
                    <Form.Control 
                      name="aTelefono" 
                      value={alumno.aTelefono} 
                      onChange={handleInputChange} 
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              {/* Sección de contacto */}
              <h5 className="mt-4">Contacto</h5>
              <Row className="gy-3">
                <Col md={6}>
                  <FloatingLabel label="Correo Electrónico">
                    <Form.Control 
                      name="aCorreo" 
                      value={alumno.aCorreo} 
                      onChange={handleInputChange} 
                      type="email" 
                      required 
                    />
                  </FloatingLabel>
                </Col>
                <Col md={3}>
                  <FloatingLabel label="Facebook">
                    <Form.Control 
                      name="aFacebook" 
                      value={alumno.aFacebook} 
                      onChange={handleInputChange} 
                    />
                  </FloatingLabel>
                </Col>
                <Col md={3}>
                  <FloatingLabel label="Instagram">
                    <Form.Control 
                      name="aInstagram" 
                      value={alumno.aInstagram} 
                      onChange={handleInputChange} 
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              {/* Sección adicional */}
              <h5 className="mt-4">Información adicional</h5>
              <Row className="gy-3">
                <Col md={4}>
                  <FloatingLabel label="Tipo de Sangre">
                    <Form.Control 
                      name="tiposangre" 
                      value={alumno.tiposangre} 
                      onChange={handleInputChange} 
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Contraseña">
                    <Form.Control
                      name="contrasenha"
                      type="password"
                      value={alumno.contrasenha}
                      onChange={handleInputChange}
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              {/* Sección dirección */}
              <h5 className="mt-4">Dirección</h5>
              <Row className="gy-3">
                <Col md={6}>
                  <FloatingLabel label="Calle">
                    <Form.Control 
                      name="dCalle" 
                      value={alumno.dCalle} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </FloatingLabel>
                </Col>
                <Col md={2}>
                  <FloatingLabel label="Número">
                    <Form.Control 
                      name="dNumero" 
                      type="number" 
                      value={alumno.dNumero} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </FloatingLabel>
                </Col>
                <Col md={4}>
                  <FloatingLabel label="Colonia">
                    <Form.Control 
                      name="dColonia" 
                      value={alumno.dColonia} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </FloatingLabel>
                </Col>
              </Row>
              <Row className="gy-3 mt-3">
                <Col md={3}>
                  <FloatingLabel label="C.P.">
                    <Form.Control 
                      name="dCodigoPostal" 
                      type="number" 
                      value={alumno.dCodigoPostal} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              {/* Sección contacto emergencia */}
              <h5 className="mt-4">Contacto de Emergencia</h5>
              <Row className="gy-3">
                <Col md={6}>
                  <FloatingLabel label="Nombre">
                    <Form.Control 
                      name="nombreContacto" 
                      value={alumno.nombreContacto} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </FloatingLabel>
                </Col>
                <Col md={6}>
                  <FloatingLabel label="Teléfono">
                    <Form.Control 
                      name="telefonoContacto" 
                      value={alumno.telefonoContacto} 
                      onChange={handleInputChange} 
                      required 
                    />
                  </FloatingLabel>
                </Col>
              </Row>

              {/* Botones */}
              <Row className="mt-4">
                <Col className="text-end">
                  <Button variant="secondary" onClick={handleCancelar} className="me-2">
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary">
                    Guardar Cambios
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        )}
      </Container>
    </>
  );
}