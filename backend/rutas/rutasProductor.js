const express = require('express');
const multer = require('multer'); // Importa Multer
const router = express.Router();
const controladorProductor = require('../controladores/controladorProductor');

// Configuración de Multer
const upload = multer(); // Utiliza la configuración predeterminada de Multer para almacenar los archivos en memoria

router.post('/', upload.array('images'), controladorProductor.create)
router.post('/images', upload.array('images'), controladorProductor.addImages);

/**
* @swagger
* /api/productor/{id}:
*   get:
*     summary: Obtener productor
*     description: Brinda los datos de un productor
*     parameters:
*       - in: path
*         name: id
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
router.get('/:id', controladorProductor.getOne);
router.get('/images/latest/:id', controladorProductor.getOneProducerImage);

/**
* @swagger
* /api/productor/images/all/{id}:
*   get:
*     summary: Obtener todas las imágenes de un rol
*     description: Brinda un URL para obtener cada imagen del rol
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*       - in: query
*         name: role
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
router.get('/images/all/:id', controladorProductor.getProducerRoleImages);

/**
* @swagger
* /api/productor/{id}:
*   put:
*     summary: Editar la información de un productor.
*     description: Edita los datos de un productor, pero no edita las imágenes.
*     parameters:
*       - in: path
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
router.put('/:id', controladorProductor.editOne);

/**
* @swagger
* /api/productor/images/{id}:
*   delete:
*     summary: Eliminar una imagen.
*     description: Eliminar la imagen seleccionada del productor.
*     parameters:
*       - in: path
*         name: id
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
router.delete('/images/:id', controladorProductor.deleteImage);


module.exports = router;