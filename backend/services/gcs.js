require('dotenv').config();
const {Storage} = require('@google-cloud/storage');
const path = require('path');

async function uploadFile(fileBuffer, fileName) {
    const projectId = process.env.PROJECT_ID;
    const keyFilename = path.join(__dirname, process.env.KEY_FILE_NAME);
    const storage = new Storage({projectId, keyFilename, autoRetry: false});
    const bucket = storage.bucket(process.env.BUCKET_NAME);

    try {
        const file = bucket.file(fileName);

        // Subir el archivo desde el buffer
        await file.save(fileBuffer);

        // Obtener la ruta del archivo dentro de GCS
        const filePath = fileName;
        
        return filePath;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getFile(fileName){
    const projectId = process.env.PROJECT_ID;
    const keyFilename = path.join(__dirname, process.env.KEY_FILE_NAME);
    const storage = new Storage({projectId, keyFilename, autoRetry: false});
    const bucket = storage.bucket(process.env.BUCKET_NAME);

    try {
        const file = bucket.file(fileName);

        const signedUrl = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000, // Expira en 15 minutos
        });

        return signedUrl;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function deleteFile (fileName) {
    const projectId = process.env.PROJECT_ID;
    const keyFilename = path.join(__dirname, process.env.KEY_FILE_NAME);
    const storage = new Storage({projectId, keyFilename, autoRetry: false});
    const bucket = storage.bucket(process.env.BUCKET_NAME);

    try {
        await bucket.file(fileName).delete();
    } catch (error) {
        throw new Error(error.message);
    }
}

async function deleteFolder (folderPath) {
    const projectId = process.env.PROJECT_ID;
    const keyFilename = path.join(__dirname, process.env.KEY_FILE_NAME);
    const storage = new Storage({projectId, keyFilename, autoRetry: false});
    const bucket = storage.bucket(process.env.BUCKET_NAME);

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
    deleteFolder,
}