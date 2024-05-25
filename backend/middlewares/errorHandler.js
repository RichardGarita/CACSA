// middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
    console.error(err);
    let statusCode = 500;
    let message = err.message;

    switch (err.message) {
        case 'Respuesta vacía':
            statusCode = 204;
            break;
        case 'No se encontraron los campos obligatorios':
            statusCode = 400;
            break;
        case 'No está autorizado':
            statusCode = 401;
            break;
        case 'No se encontró el recurso':
            statusCode = 404;
            break;
        case 'Ya existe el recurso':
            statusCode = 402;
            break;
        case 'Extensión de archivo no soportada':
            statusCode = 422;
            break;
        case 'Falló al crear el recurso':
            statusCode = 501;
            break;
        default:
            statusCode = 500;
            break;
    }

    res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
