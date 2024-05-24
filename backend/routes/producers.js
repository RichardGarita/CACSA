const express = require('express');
const multer = require('multer'); // Importa Multer
const router = express.Router();
const producerController = require('../controllers/producers');
const jwtHelper = require('../utils/jwtHelper');

// Configuración de Multer
const upload = multer(); // Utiliza la configuración predeterminada de Multer para almacenar los archivos en memoria

router.post('/', jwtHelper.verifyToken, upload.array('images'), producerController.create)
router.post('/images', jwtHelper.verifyToken, upload.array('images'), producerController.addImages);

/**
* @swagger
* /api/productor:
*   get:
*     summary: Obtener productores
*     description: Brinda los datos de todos los productores
*     responses:
*       200:
*         description: Operación exitosa.
*       401:
*         description: Token inválido.
*       500:
*         description: Error del servidor.
*/
router.get('/', jwtHelper.verifyToken, producerController.getAll);
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
*       400:
*         description: Debe llenar los campos obligatorios.
*       402:
*         description: No se encontró el recurso.
*       500:
*         description: Error del servidor.
*/
router.get('/:id', jwtHelper.verifyToken, producerController.getOne);
router.get('/images/latest/:id', jwtHelper.verifyToken, producerController.getOneProducerImage);

router.get('/:id/log', jwtHelper.verifyToken, producerController.getLastLog);

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
*       400:
*         description: Debe llenar los campos obligatorios.
*       402:
*         description: No se encontró el recurso.
*       500:
*         description: Error del servidor.
*/
router.get('/images/all/:id', jwtHelper.verifyToken, producerController.getProducerRoleImages);

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
router.put('/:id', jwtHelper.verifyToken, producerController.editOne);

router.delete('/:id', jwtHelper.verifyToken, producerController.deleteOne);
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
*       400:
*         description: Debe llenar los campos obligatorios.
*       402:
*         description: No se encontró el recurso.
*       500:
*         description: Error del servidor.
*/
router.delete('/images/:id', jwtHelper.verifyToken, producerController.deleteImage);


module.exports = router;