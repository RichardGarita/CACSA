const express = require('express');
const router = express.Router();
const controladorUsuario = require('../controladores/controladorUsuarios');

router.get('/', controladorUsuario.getAllUsers);

/**
* @swagger
* /api/user/login:
*   post:
*     summary: Inicia sesión
*     description: Valida el nombre y la contraseña de un usuario.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               userName:
*                 type: string
*               password:
*                 type: string
*     responses:
*       200:
*         description: Inicio de sesión exitoso.
*       400:
*         description: Debe llenar los campos obligatorios.
*       402:
*         description: No se encontró el usuario.
*       500:
*         description: Error del servidor.
*/
router.post('/login', controladorUsuario.loginUsuario);

module.exports = router;