// src/screens/Menu.tsx
import React from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';

export default function Menu() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/');
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <nav
        className="bg-light border-end d-flex flex-column p-3"
        style={{ width: 240, minWidth: 240 }}
      >
        <h4 className="mb-4 text-center">5A BIS</h4>
        <ListGroup variant="flush" className="flex-grow-0">
          <ListGroup.Item as={NavLink} to="/alumnos" end>
            Inicio
          </ListGroup.Item>
          <ListGroup.Item as={NavLink} to="/alumnos/perfil">
            Mi Perfil
          </ListGroup.Item>
          <ListGroup.Item as={NavLink} to="/alumnos/agregar">
            Agregar
          </ListGroup.Item>
          <ListGroup.Item as={NavLink} to="/alumnos/consultar">
            Consultar
          </ListGroup.Item>
          <ListGroup.Item as={NavLink} to="/alumnos/modificar">
            Modificar
          </ListGroup.Item>
          <ListGroup.Item as={NavLink} to="/alumnos/eliminar">
            Eliminar
          </ListGroup.Item>
          <ListGroup.Item as={NavLink} to="/alumnos/mensajes">
            Mensajes
          </ListGroup.Item>
        </ListGroup>
        <div className="mt-auto pt-3">
          <Button variant="outline-danger" onClick={handleLogout} className="w-100">
            Cerrar sesión
          </Button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="flex-fill p-4">
        <Outlet />
      </main>
    </div>
  );
}
