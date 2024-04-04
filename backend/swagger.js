const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'CACSA Backend',
        version: '1.0.0',
        description: 'Servicio de backend para CACSA',
    },
};

const options = {
swaggerDefinition,
apis: [path.join(__dirname, './rutas/*.js')], // Path to the API routes in your Node.js application
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;