const express = require('express');
const app = express();
const cors = require('cors'); // Importa el middleware cors
// Middleware para usar Swagger
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./utils/swagger');
const apiRouter = require('./routes/api'); // Importa el archivo de rutas principal desde la carpeta rutas
const errHandler = require('./middlewares/errorHandler');

// Middleware para el manejo de solicitudes JSON
app.use(express.json());

// Sirve documentacion de Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(cors());

// Configura Express para usar las rutas principales en apiRouter
app.use('/api', apiRouter);

app.use(errHandler);

app.get('/', (req, res) => {
  res.send('¡Bienvenido a mi API!');
});

// Inicia el servidor
const port = process.env.PORT || 4223;
app.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
}); 


module.exports = app;