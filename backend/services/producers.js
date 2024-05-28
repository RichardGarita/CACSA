var GCS = require('../services/gcs');
var Producer = require('../models/producers');
var Image = require('../models/images');
var Log = require('../services/logs');
const { v4: uuidv4 } = require('uuid');

const DEFAULT_ROLES = ['idScreenShot', 'foodHandling', 'fairPass', 'propertyTitle', 'products', 'inspection',
    'profilePic', 'permits', 'memos', 'Other'
];

async function create(data, userId, images) {
    try {
        // Procesar los datos del formulario
        const { name, date, identification, roles, fair, category, fairLocality } = data;
        const rolesArray = JSON.parse(roles);

        const existed = await Producer.findOne({where: {identification}})
        if (existed) {
            throw new Error('Ya existe el recurso');
        }

        const producer = await Producer.create({name, date, identification, fair, category, fairLocality});
        if (!producer){
            throw new Error('Falló al crear el recurso');
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

async function getAll(){
    try {
        const producers = await Producer.findAll();
        return producers;
    } catch(error) {
        throw new Error(error.message);
    }
}

async function getOne(id){
    try {
        const producer = await Producer.findByPk(id);
        if (producer) {
            return producer;
        } else
            throw new Error ('No se encontró el recurso');
    } catch (error) {
        throw new Error(error.message);
    }
}

async function getOneImage(id, role){
    try {
        const producer = await Producer.findByPk(id);
        if (!producer) {
            throw new Error('No se encontró el recurso');
        }
        const newest = await Image.max('updatedAt', {where: {producerId: id, role: role}})
        const image = await Image.findOne({where: {producerId: id, updatedAt: newest}});

        if(image) {
            const url = await GCS.getFile(image.path);
            return url;
        } else {
            throw new Error('Respuesta vacía');
        }
    } catch (error) {
        throw new Error( error.message);
    }

}

async function getRoleImages (id, role){
    try {
        const images = await Image.findAll({where: {producerId: id, role}});
        var response = [];
        if (images) {
            for (let image of images) {
                const url = await GCS.getFile(image.path);
                response = [...response, {url, id: image.id}];
            }
        }
        return response;
    } catch (error) {
        throw new Error( error.message);
    }
}

async function getLastLog(id){
    try {
        const log = await Log.getLastLog(id)
        return log;
    } catch (error) {
        throw new Error(error.message);
    }
}

async function editOne(data, id, userId){
    try {
        const {name, date, category, fair, fairLocality} = data;

        const updateValues = {name, date, category, fair};
        if (fair) {
            updateValues.fairLocality = fairLocality;
        }
        await Producer.update(updateValues, {where: {id: id}});

        await Log.createLog(userId, id, 'Edición del perfil');
        return {message: 'Recurso actualizado'};
    } catch (error) {
        throw new Error(error.message);
    }
    
}

async function addImages(id, role, images, userId){
    try {
        const producer = await Producer.findByPk(id);
        if (!producer) {
            throw new Error('No se encontró el recurso');
        }

        // Iterar sobre las imágenes recibidas
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            if (image) {
                // Generar un nombre único para la imagen en GCS
                const imageName = `${id}/${uuidv4()}_${image.originalname}`;
                
                // Subir el archivo a GCS
                await GCS.uploadFile(image.buffer, imageName);

                // Save the images information on the database
                await Image.create({producerId: id, path: imageName, role});
            }
        }
        // Responder al frontend con la URL de las imágenes o un mensaje de confirmación
        await Log.createLog(userId, id, 'Se agregaron imágenes');
        return { message: 'Imágenes subidas correctamente' };

    } catch (error) {
        throw new Error(error.message);
    }
}

async function deleteImage(id, userId) {
    try {

        const image = await Image.findByPk(id);
        const producerId = image.producerId;
        if (!image) {
            throw new Error('No se encontró el recurso');
        }

        await GCS.deleteFile(image.path);

        await image.destroy();

        await Log.createLog(userId, producerId, 'Se eliminaron imágenes');
        return { message: 'Imágen eliminada correctamente' };
    } catch (error) {
        throw new Error(error.message);
    }
}

async function deleteOne(id, userId) {
    try {
        const producer = await Producer.findByPk(id);
        if (producer) {
            await Log.createLog(userId, id, 'Eliminación de productor');
            await producer.destroy();
            await GCS.deleteFolder(`${id}/`);
            return { message: 'Recurso eliminado correctamente' };
        } else {
            throw new Error('No se encontró el recurso');
        }

    } catch (error) {
        throw new Error(error.message);
    }
}

async function getImagesReport(producerId){
    try {
        const response = {};
        for (let role of DEFAULT_ROLES) {
            const image = await Image.findOne({where: {producerId, role}});
            if (image)
                response[role] = true;
        }
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    create,
    getAll,
    getOne,
    getOneImage,
    getRoleImages,
    getLastLog,
    editOne,
    addImages,
    deleteImage,
    deleteOne,
    getImagesReport,
}