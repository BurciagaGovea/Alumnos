// src/screens/AlumnosConsultar.tsx
import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
  Table,
  Modal,
  Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type Alumno = {
  matricula: string;
  nombre: string;
  aPaterno: string;
  aMaterno?: string;
  sexo: number; // 1 = M, 2 = F
  aTelefono?: string;
  aCorreo: string;
  aFacebook?: string;
  aInstagram?: string;
  tiposangre?: string;
  dCalle?: string;
  dNumero?: number;
  dColonia?: string;
  dCodigoPostal?: number;
  nombreContacto?: string;
  telefonoContacto?: string;
};

export default function AlumnosConsultar() {
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [cargando, setCargando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null);
  const [buscar, setBuscar] = useState('');
  const [sexoFilter, setSexoFilter] = useState('');

  // Fetch con search y filter
  const fetchAlumnos = async () => {
    try {
      setCargando(true);
      const params: any = {};
      if (buscar.trim()) params.search = buscar.trim();
      if (sexoFilter) params.sexo = sexoFilter;
      const { data } = await axios.get('http://localhost:5000/alumnos', { params });
      setAlumnos(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchAlumnos();
  }, [buscar, sexoFilter]);

  const openModal = (al: Alumno) => {
    setAlumnoSeleccionado(al);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAlumnoSeleccionado(null);
  };

  return (
    <>
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item onClick={() => navigate('/alumnos')} style={{ cursor: 'pointer' }}>
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Consultar Alumno</Breadcrumb.Item>
      </Breadcrumb>

      <Container fluid>
        <Row className="align-items-center mb-3">
          <Col md={4}>
            <InputGroup>
              <FormControl
                placeholder="Buscar por matrícula o nombre"
                value={buscar}
                onChange={e => setBuscar(e.target.value)}
              />
              <Button variant="outline-secondary" onClick={fetchAlumnos}>
                🔍
              </Button>
            </InputGroup>
          </Col>
          <Col md={3}>
            <FormControl
              as="select"
              value={sexoFilter}
              onChange={e => setSexoFilter(e.target.value)}
            >
              <option value="">Todos los sexos</option>
              <option value="1">Masculino</option>
              <option value="2">Femenino</option>
            </FormControl>
          </Col>
        </Row>

        {cargando ? (
          <Spinner animation="border" />
        ) : (
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nombre Completo</th>
                <th>Sexo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map(al => (
                <tr key={al.matricula}>
                  <td>{al.matricula}</td>
                  <td>{`${al.nombre} ${al.aPaterno} ${al.aMaterno || ''}`}</td>
                  <td>{al.sexo === 1 ? 'M' : 'F'}</td>
                  <td>
                    <Button size="sm" onClick={() => openModal(al)}>
                      Ver Detalles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Detalles de Alumno</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {alumnoSeleccionado && (
              <div>
                <p><strong>Matrícula:</strong> {alumnoSeleccionado.matricula}</p>
                <p>
                  <strong>Nombre:</strong> {alumnoSeleccionado.nombre}{' '}
                  {alumnoSeleccionado.aPaterno}{' '}
                  {alumnoSeleccionado.aMaterno || ''}
                </p>
                <p><strong>Sexo:</strong> {alumnoSeleccionado.sexo === 1 ? 'M' : 'F'}</p>
                <p><strong>Teléfono:</strong> {alumnoSeleccionado.aTelefono || 'N/A'}</p>
                <p><strong>Correo:</strong> {alumnoSeleccionado.aCorreo}</p>
                <p><strong>Facebook:</strong> {alumnoSeleccionado.aFacebook || 'N/A'}</p>
                <p><strong>Instagram:</strong> {alumnoSeleccionado.aInstagram || 'N/A'}</p>
                <p><strong>Tipo de Sangre:</strong> {alumnoSeleccionado.tiposangre || 'N/A'}</p>
                <p>
                  <strong>Dirección:</strong>{' '}
                  {alumnoSeleccionado.dCalle || ''} # {alumnoSeleccionado.dNumero || ''},
                  {alumnoSeleccionado.dColonia || ''}, CP {alumnoSeleccionado.dCodigoPostal || ''}
                </p>
                <p>
                  <strong>Contacto Emergencia:</strong>{' '}
                  {alumnoSeleccionado.nombreContacto || ''} (
                  {alumnoSeleccionado.telefonoContacto || ''})
                </p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
