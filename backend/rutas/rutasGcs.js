const express = require('express');
const multer = require('multer'); // Importa Multer
const router = express.Router();
const controladorGcs = require('../controladores/controladorGcs');

// Configuración de Multer
const upload = multer(); // Utiliza la configuración predeterminada de Multer para almacenar los archivos en memoria

/**
* @swagger
* /api/gcs/upload:
*   post:
*     summary: Subir archivo
*     description: Valida el nombre y la contraseña de un usuario.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               file:
*                 type: string
*               fileOutputName:
*                 type: string
*     responses:
*       200:
*         description: Inicio de sesión exitoso.
*       401:
*         description: Debe llenar los campos obligatorios.
*       402:
*         description: No se encontró el usuario.
*       500:
*         description: Error del servidor.
*/
router.post('/upload', controladorGcs.uploadFile);
router.post('/create', upload.array('images'), controladorGcs.create)

module.exports = router;