const express = require('express');
const multer = require('multer'); // Importa Multer
const router = express.Router();
const controladorProducto = require('../controladores/controladorProductor');

// Configuración de Multer
const upload = multer(); // Utiliza la configuración predeterminada de Multer para almacenar los archivos en memoria

router.post('/create', upload.array('images'), controladorProducto.create)

/**
* @swagger
* /api/productor/getOne:
*   get:
*     summary: Obtener signed URL
*     description: Brinda un URL para obtener una imagen
*     parameters:
*       - in: query
*         name: path
*         schema:
*           type: string
*         required: true
*     responses:
*       200:
*         description: Operación exitosa.
*       401:
*         description: Debe llenar los campos obligatorios.
*       402:
*         description: No se encontró el recurso.
*       500:
*         description: Error del servidor.
*/
router.get('/getOne', controladorProducto.getOne);


module.exports = router;