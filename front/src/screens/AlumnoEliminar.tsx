// src/screens/AlumnoEliminar.tsx
import React, { useState } from 'react';
import {
  Breadcrumb,
  Container,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
  Card
} from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

type Alumno = {
  matricula: string;
  nombre: string;
  aPaterno: string;
  aMaterno?: string;
};

export default function AlumnoEliminar() {
  const [buscarMatricula, setBuscarMatricula] = useState('');
  const [alumno, setAlumno] = useState<Alumno | null>(null);
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
      const resultados: Alumno[] = data.results || [];
      if (resultados.length > 0) {
        setAlumno(resultados[0]);
      } else {
        Swal.fire('No encontrado', 'No existe alumno con esa matrícula', 'error');
        setAlumno(null);
      }
    } catch (err) {
      console.error(err);
      Swal.fire('Error', 'Error al buscar alumno', 'error');
      setAlumno(null);
    }
  };

  const eliminarAlumno = async () => {
    if (!alumno) return;
    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el alumno ${alumno.nombre} ${alumno.aPaterno}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (confirm.isConfirmed) {
      try {
        const { data } = await axios.delete(
          `http://localhost:5000/alumnos/${alumno.matricula}`
        );
        if (data.status === 200) {
          Swal.fire('Eliminado', 'Alumno eliminado correctamente', 'success');
          setAlumno(null);
          setBuscarMatricula('');
          navigate('/alumnos');
        } else {
          Swal.fire('Error', 'No se pudo eliminar el alumno', 'error');
        }
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'No se pudo eliminar el alumno', 'error');
      }
    }
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
        <Breadcrumb.Item active>Eliminar Alumno</Breadcrumb.Item>
      </Breadcrumb>

      <Container fluid>
        <Row className="mb-4">
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

        {alumno && (
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Eliminar el siguiente alumno:</Card.Title>
                  <p>
                    <strong>Matrícula:</strong> {alumno.matricula}
                  </p>
                  <p>
                    <strong>Nombre completo:</strong>{' '}
                    {alumno.nombre} {alumno.aPaterno}{' '}
                    {alumno.aMaterno || ''}
                  </p>
                </Card.Body>
                <Card.Footer className="text-end">
                  <Button variant="danger" onClick={eliminarAlumno}>
                    Eliminar
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
}
