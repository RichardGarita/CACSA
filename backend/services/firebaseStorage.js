const { Storage } = require('@google-cloud/storage');
const { Buffer } = require('buffer');
require('dotenv').config();

// Decodifica el contenido base64 de la variable de entorno
const keyFileContentBase64 = process.env.KEY_FILE_CONTENT;
const keyFileContent = Buffer.from(keyFileContentBase64, 'base64').toString('utf-8');

// Inicializar Google Cloud Storage
const storage = new Storage({
    credentials: JSON.parse(keyFileContent)
  });
const bucket = storage.bucket('gs://cacsa-testing-18355.appspot.com');

async function uploadFile(fileBuffer, fileName) {
    try {
        const file = bucket.file(fileName);

        // Subir el archivo desde el buffer
        await file.save(fileBuffer);

        // Obtener la ruta del archivo dentro de Firebase Storage
        const filePath = fileName;
        return filePath;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getFile(fileName) {
    try {
        const file = bucket.file(fileName);

        // Obtener la URL del archivo
        const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000, // Expira en 15 minutos
        });

        return signedUrl;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function deleteFile(fileName) {
    try {
        await bucket.file(fileName).delete();
    } catch (error) {
        throw new Error(error.message);
    }
}

async function deleteFolder (folderPath) {
    try {
        // Obtener la lista de archivos dentro de la carpeta
        const [files] = await bucket.getFiles({ prefix: folderPath });

        // Borrar cada archivo
        const deleteFilePromises = files.map(file => file.delete());

        // Esperar a que todas las promesas de eliminación se completen
        await Promise.all(deleteFilePromises);

        return true; // Éxito
    } catch (error) {
        throw new Error(error.message);
    }
}


module.exports = {
    uploadFile,
    getFile,
    deleteFile,
    deleteFolder
}