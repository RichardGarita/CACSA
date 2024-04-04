require('dotenv').config();
const {Storage} = require('@google-cloud/storage');
const { sign } = require('crypto');
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
        throw error;
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
        throw error;
    }
}

module.exports = {
    uploadFile,
    getFile,
}