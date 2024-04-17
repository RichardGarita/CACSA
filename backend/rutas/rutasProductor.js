const express = require('express');
const multer = require('multer'); // Importa Multer
const router = express.Router();
const controladorProductor = require('../controladores/controladorProductor');

// Configuración de Multer
const upload = multer(); // Utiliza la configuración predeterminada de Multer para almacenar los archivos en memoria

router.post('/create', upload.array('images'), controladorProductor.create)
router.post('/addImages', upload.array('images'), controladorProductor.addImages);

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
router.get('/getOne', controladorProductor.getOne);
router.get('/getOneProducerImage', controladorProductor.getOneProducerImage);

/**
* @swagger
* /api/productor/editOne:
*   put:
*     summary: Editar la información de un productor.
*     description: Edita los datos de un productor, pero no edita las imágenes.
*     parameters:
*       - in: query
*         name: id
*         schema:
*           type: string
*         required: true
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               name:
*                 type: string
*               date:
*                 type: string
*                 format: date
*/
router.put('/editOne', controladorProductor.editOne);


module.exports = router;