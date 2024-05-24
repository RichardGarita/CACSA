const express = require('express');
const router = express.Router();

// Rutas

// Rutas para el manejo de usuarios
const userRoutes = require('./users');
router.use('/user', userRoutes);

// Rutas para el manejo de perfiles de productores
const producerRoutes = require('./producers');
router.use('/producer', producerRoutes);

const logsRoutes = require('./logs');
router.use('/log', logsRoutes);

module.exports = router;