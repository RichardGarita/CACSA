const express = require('express');
const router = express.Router();

// Rutas

// Rutas para el manejo de usuarios
const rutasUsuarios = require('./rutasUsuarios');
router.use('/usuario', rutasUsuarios);

// Rutas para el manejo de perfiles de productores
const rutasProductor = require('./rutasProductor');
router.use('/productor', rutasProductor);

// Rutas para el manejo de archivos en Google Cloud Storage
const rutasGcs = require('./rutasGcs');
router.use('/gcs', rutasGcs);

module.exports = router;