# Sistema de Gestión de Alumnos

Este proyecto es una aplicación web para la gestión académica de alumnos, desarrollada como parte del módulo de desarrollo web avanzado. Incluye funcionalidades como inicio de sesión (usuario/Google), envío de mensajes entre alumnos, búsquedas filtradas, y una interfaz amigable y segura.

---

## Tecnologías utilizadas

- **Backend**: Node.js, Express, Sequelize, JWT, bcrypt, reCAPTCHA
- **Frontend**: React.js, React Router v6, Axios, Bootstrap, Google OAuth
- **Base de datos**: MySQL

---

## Requisitos previos

- Node.js v18+
- MySQL
- Navegador moderno (Chrome, Firefox, Edge)

---

## Instalación

### Backend

```bash
git clone <https://github.com/BurciagaGovea/Alumnos>
cd Alumnos/back
npm install
```

Crea un archivo `.env` con los siguientes datos:

```env
PORT=5000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=nombre_bd
JWT_SECRET=clave_secreta
JWT_EXPIRES_IN=1d
GOOGLE_CLIENT_ID=tu_google_id
RECAPTCHA_SECRET=tu_recaptcha_secret
```

Inicia el servidor:

```bash
npm run dev
```

### Frontend

```bash
cd ../front
npm install
```

Crea un archivo `.env` en la carpeta `front/` con las siguientes variables:

```env
REACT_APP_GOOGLE_CLIENT_ID=tu_google_client_id
REACT_APP_RECAPTCHA_SITE_KEY=tu_recaptcha_site_key
```

Luego ejecuta:

```bash
npm start
```

---

## Estructura del Proyecto

```
Alumnos/
├─ back/
│  └─ src/
│     ├─ controllers/
│     ├─ middlewares/
│     ├─ models/
│     ├─ routes/
│     ├─ config/
│     ├─ services/
│     └─ app.js
├─ front/
│  └─ src/
│     ├─ screens/
│     ├─ components/
│     └─ App.tsx
```

---

## Funcionalidades principales

- Inicio de sesión con usuario o Google.
- Envío de mensajes entre alumnos (tipo buzón, no chat).
- Búsqueda y filtrado de alumnos.
- Validación de formularios en frontend y backend.
- Protección de rutas y autenticación por JWT.
- CAPTCHA en login para verificación humana.
- Diseño responsivo y accesible.
- Breadcrumbs y menú adaptativo persistente.
- Páginas personalizadas 404 y 500.

---

## README del Frontend

- **React Router v6** para gestión de rutas (Login, Panel, Alumnos, Mensajes).
- **Axios** con interceptores para autenticación.
- **React Bootstrap** para estilos rápidos.
- **Google OAuth** integrado mediante `@react-oauth/google`.

Revisa `src/screens/` para ver la estructura de pantallas.

---

## Pruebas rápidas

| Función                     | Ruta / Instrucción                       |
|----------------------------|------------------------------------------|
| Iniciar sesión              | `/login` (usuario o Google)             |
| Ver alumnos                 | `/alumnos`                              |
| Enviar mensaje              | `/mensajes`                             |
| Consultar mensajes recibidos| `/mensajes`                             |

---

## Demo en video

> https://drive.google.com/file/d/1ZrpRrkHh6hSFoe7PMnlhbtyyp7MWHCBC/view?usp=sharing

---
