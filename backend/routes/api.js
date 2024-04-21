const express = require('express');
const router = express.Router();

// Rutas

// Rutas para el manejo de usuarios
const userRoutes = require('./usersRoutes');
router.use('/user', userRoutes);

// Rutas para el manejo de perfiles de productores
const producerRoutes = require('./producerRoutes');
router.use('/producer', producerRoutes);

module.exports = router;