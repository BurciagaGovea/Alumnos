// src/screens/ContenidoA.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  InputGroup,
  FormControl,
  Button,
  Card,
  Table,
  Spinner,
  Form
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type Alumno = {
  matricula: string;
  nombre: string;
  aPaterno: string;
  aMaterno?: string;
  sexo: number; // 1 = M, 2 = F
};

export default function ContenidoA() {
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sexoFilter, setSexoFilter] = useState('');

  // Fetch alumnos with optional server‐side search & filter
  const fetchAlumnos = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (sexoFilter) params.sexo = sexoFilter;
      const res = await axios.get('http://localhost:5000/alumnos', { params });
      setAlumnos(res.data.data || []);
    } catch (err) {
      console.error(err);
      setAlumnos([]);
    } finally {
      setLoading(false);
    }
  };

  // trigger fetch on mount and when searchTerm or sexoFilter changes
  useEffect(() => {
    fetchAlumnos();
  }, [searchTerm, sexoFilter]);

  // últ. 5 registros para mostrar en dashboard cuando no hay filtro
  const recientes = [...alumnos].slice(-5).reverse();

  // decidir qué mostrar
  const toDisplay =
    searchTerm.trim() || sexoFilter
      ? alumnos
      : recientes;

  return (
    <Container fluid>
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item onClick={() => navigate('/alumnos')} style={{ cursor: 'pointer' }}>
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
      </Breadcrumb>

      {/* Buscador, filtro y CTA */}
      <Row className="align-items-center mb-4">
        <Col md={4}>
          <InputGroup>
            <FormControl
              placeholder="Buscar por matrícula o nombre"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Button onClick={fetchAlumnos} variant="outline-secondary">🔍</Button>
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select
            value={sexoFilter}
            onChange={e => setSexoFilter(e.target.value)}
          >
            <option value="">Todos los sexos</option>
            <option value="1">Masculino</option>
            <option value="2">Femenino</option>
          </Form.Select>
        </Col>
        <Col md={5} className="text-end">
          <Button variant="primary" onClick={() => navigate('/alumnos/agregar')}>
            + Agregar alumno
          </Button>
        </Col>
      </Row>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <>
          {/* Métricas sólo si no hay filtros */}
          {!searchTerm.trim() && !sexoFilter && (
            <Row xs={1} md={3} className="g-3 mb-4">
              <Col>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Total Alumnos</Card.Title>
                    <h2>{alumnos.length}</h2>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Hombres</Card.Title>
                    <h2>{alumnos.filter(a => a.sexo === 1).length}</h2>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <Card className="text-center">
                  <Card.Body>
                    <Card.Title>Mujeres</Card.Title>
                    <h2>{alumnos.filter(a => a.sexo === 2).length}</h2>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Encabezado tabla */}
          <h5 className="mb-3">
            {searchTerm.trim() || sexoFilter
              ? `Resultados${searchTerm.trim() ? ` de "${searchTerm.trim()}"` : ''}`
              : 'Últimos registrados'}
          </h5>

          {/* Tabla de alumnos */}
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nombre completo</th>
                <th>Sexo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {toDisplay.map(a => (
                <tr key={a.matricula}>
                  <td>{a.matricula}</td>
                  <td>{`${a.nombre} ${a.aPaterno} ${a.aMaterno || ''}`}</td>
                  <td>{a.sexo === 1 ? 'M' : 'F'}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      className="me-1"
                      onClick={() =>
                        navigate('/alumnos/consultar', { state: { matricula: a.matricula } })
                      }
                    >
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="warning"
                      onClick={() =>
                        navigate('/alumnos/modificar', { state: { matricula: a.matricula } })
                      }
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
}
