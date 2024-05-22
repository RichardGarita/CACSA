const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logs');
const jwtHelper = require('../utils/jwtHelper');

router.get('/', jwtHelper.verifyToken, logsController.getAll);

module.exports = router;