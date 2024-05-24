const multer = require('multer'); // Importa Multer

// Configuración de Multer
const storage = multer.memoryStorage(); // Almacenar los archivos en memoria
const fileFilter = (req, file, cb) => {
    // Aceptar solo archivos de imagen
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Extensión de archivo no soportada'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;