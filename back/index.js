import dotenv from 'dotenv';
dotenv.config();
import './src/models/Usuario.js';
import './src/models/Mensaje.js';

import app from './src/app.js';
import { sequelize } from './src/config/database.js';

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('DB conectada');
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server en puerto ${PORT}`);
    });
  } catch (err) {
    console.error('Error al iniciar:', err);
    process.exit(1);
  }
}

start();
