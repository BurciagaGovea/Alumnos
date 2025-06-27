// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

import ErrorBoundary from "./components/ErrorBoundary.tsx";

import NotFound         from "./screens/NotFound.tsx";

import Login            from "./screens/Login.tsx";
import Register         from "./screens/Register.tsx";
import Menu             from "./screens/Menu.tsx";
import ContenidoA       from "./screens/ContenidoA.tsx";
import AlumnosAgregar   from "./screens/AlumnosAgregar.tsx";
import AlumnosConultar  from "./screens/AlumnosConultar.tsx";
import AlumnosModificar from "./screens/AlumnoModificar.tsx";
import AlumnoEliminar   from "./screens/AlumnoEliminar.tsx";
import PrivateRoute     from "./components/PrivateRoute.tsx";
import Mensajes          from './screens/Mensajes.tsx';
import Perfil from "./screens/Perfil.tsx";

function AppWrapper() {
  const navigate = useNavigate();

  // 1) cerrsas sesión en todas las tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token' && e.newValue === null) {
        navigate('/', { replace: true });
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [navigate]);

  // 2) Global 401 interceptor
  useEffect(() => {
    const id = axios.interceptors.response.use(
      resp => resp,
      err => {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          navigate('/', { replace: true });
        }
        return Promise.reject(err);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, [navigate]);

  return (
    <ErrorBoundary>
      <Routes>
        {/* PÚBLICAS */}
        <Route path="/"         element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTEGIDAS */}
        <Route element={<PrivateRoute />}>
          <Route path="/alumnos" element={<Menu />}>
            <Route index       element={<ContenidoA />} />
            <Route path="agregar"   element={<AlumnosAgregar />} />
            <Route path="consultar" element={<AlumnosConultar />} />
            <Route path="modificar" element={<AlumnosModificar />} />
            <Route path="eliminar"  element={<AlumnoEliminar />} />
            <Route path="mensajes"  element={<Mensajes />} />
            <Route path="perfil" element={<Perfil />} />

          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
