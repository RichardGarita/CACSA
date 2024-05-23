var GCS = require('../services/gcs');
var Producer = require('../models/producers');
var Log = require('../services/logs');
const { v4: uuidv4 } = require('uuid');

async function create(data, userId, images) {
    try {
        // Procesar los datos del formulario
        const { name, date, identification, roles, fair, category, fairLocality } = data;
        if (!userId || !name || !date || !identification || !roles || !category || !fair || (!fair && !fairLocality) ) {
            throw new Error('Todos los campos son necesarios');
        }
        const rolesArray = JSON.parse(roles);

        const existed = await Producer.findOne({where: {identification}})
        if (existed) {
            throw new Error('Ya existe el productor');
        }

        const producer = await Producer.create({name, date, identification, fair, category, fairLocality});
        if (!producer){
            throw new Error('Falló al crear el productor');
        }

        // Iterar sobre las imágenes recibidas
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            if (image) {
                // Generar un nombre único para la imagen en GCS
                const imageName = `${producer.id}/${uuidv4()}_${image.originalname}`;

                const role = i < rolesArray.length ? rolesArray[i] : 'Other';
                
                // Subir el archivo a GCS
                await GCS.uploadFile(image.buffer, imageName);

                // Save the images information on the database
                await Image.create({producerId: producer.id, path: imageName, role});
            }
        }

        await Log.createLog(userId, producer.id, 'Creación del productor');
        // Responder al frontend con la URL de las imágenes o un mensaje de confirmación
        return { message: 'Imágenes subidas correctamente' };
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getLastLog(id){
    try {
        if (!id)
            throw new Error('Todos los campos son necesarios');

        const log = await Log.getLastLog(id)
        return log;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    create,
    getLastLog,
}