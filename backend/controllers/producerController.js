var GCS = require('../services/gcs');
var Producer = require('../models/producers');
var ProducerService = require('../services/producers');
var Image = require('../models/images');
var Log = require('../models/logs');
var User = require('../models/users');
const { v4: uuidv4 } = require('uuid');

async function create(req, res) {
    try {
        // Procesar los datos del formulario
        const { name, date, identification, roles, fair, category, fairLocality } = req.body;
        const userId = req.decoded.id;
        if (!userId || !name || !date || !identification || !roles || !category || !fair || (!fair && !fairLocality) ) {
            res.status(400).json({ error: 'Todos los campos son necesarios' });
            return;
        }
        const images = req.files;
        const rolesArray = JSON.parse(roles);

        const user = await User.findByPk(userId);
        if (!user) {
            res.status(401).json({ error: 'No se encontró el usuario' });
            return;
        }

        const existed = await Producer.findOne({where: {identification}})
        if (existed) {
            res.status(402).json({ error: 'Ya existe el productor' });
            return;
        }

        const producer = await Producer.create({name, date, identification, fair, category, fairLocality});
        if (!producer){
            res.status(501).json({ error: 'Falló al crear el productor' });
            return;
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

        await Log.create({
            editorName: user.userName, 
            producerIdentification: producer.identification,
            producerName: producer.name,
            process: 'Creación del productor'
        })
        // Responder al frontend con la URL de las imágenes o un mensaje de confirmación
        res.status(200).json({ message: 'Imágenes subidas correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAll(req, res){
    try {
        const producers = await Producer.findAll();
        res.status(200).json(producers);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}

async function getOne(req, res){
    const id = req.params.id;
    try {
        const producer = await Producer.findByPk(id);
        if (producer) {
            res.status(200).json(producer);
            return;
        }
        res.status(404).json({error: 'No se encontró el elemento'});
    } catch (error) {
        res.status(501).json({error: error.message});
    }
}

async function getOneProducerImage(req, res){
    const id = req.params.id;
    const role = req.query.role;
    try {
        const producer = await Producer.findByPk(id);
        if (!producer) {
            res.status(404).json({error: 'No se encontró el recurso'});
            return;
        }
        const newest = await Image.max('updatedAt', {where: {producerId: id, role: role}})
        const image = await Image.findOne({where: {producerId: id, updatedAt: newest}});

        if(image) {
            const url = await GCS.getFile(image.path);
            res.status(200).json({url});
        } else {
            res.status(204).json({error: 'No hay imagenes con ese rol'});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

async function getProducerRoleImages (req, res){
    try {
        const id = req.params.id;
        const role = req.query.role;
        if (!id || !role) {
            res.status(400).json({ error: 'Todos los campos son necesarios' });
            return;
        }
        const images = await Image.findAll({where: {producerId: id, role}});
        var response = [];
        if (images) {
            for (let image of images) {
                const url = await GCS.getFile(image.path);
                response = [...response, {url, id: image.id}];
            }
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getLastLog(req, res){
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ error: 'Todos los campos son necesarios' });
            return;
        }

        const log = await ProducerService.getLastLog(id);

        if(log) { 
            res.status(200).json({log});
        } else {
            res.status(204).json({error: 'No hay bitácoras para el productor'});
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function editOne(req, res){
    try {
        const id = req.params.id;
        const {name, date, category, fair, fairLocality} = req.body;
        if (!id || !name || !date || !category || !(fair === true ? fairLocality : true)){
            res.status(400).json({ error: 'No se encontraron los campos' });
            return;
        }
        const updateValues = {name, date, category, fair};
        if (fair) {
            updateValues.fairLocality = fairLocality;
        }
        await Producer.update(updateValues, {where: {id: id}});
        res.status(200).json({message: 'Productor actualizado'});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
}

async function addImages(req, res){
    try {
        const {id, role} = req.body;
        const images = req.files;
        if (!id || !role || !images) {
            res.status(400).json({error: "No se encontraron los campos necesarios"});
            return;
        }
        const producer = await Producer.findByPk(id);
        if (!producer) {
            res.status(404).json({error: 'No se encontró el recurso'});
            return;
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
        res.status(200).json({ message: 'Imágenes subidas correctamente' });

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

async function deleteImage(req, res) {
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({error: "No se encontraron los campos necesarios"});
            return;
        }

        const image = await Image.findByPk(id);
        if (!image) {
            res.status(402).json({error: 'No se encontró el recurso'});
            return;
        }

        await GCS.deleteFile(image.path);

        await image.destroy();

        res.status(200).json({ message: 'Imágen eliminada correctamente' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteOne(req, res) {
    try {
        const id = req.params.id;
        const admin = req.decoded.admin;

        if (!id) {
            res.status(400).json({error: "No se encontraron los campos necesarios"});
            return;
        }

        if (!admin) {
            res.status(401).json({error: "No está autorizado"});
            return;
        }

        const producer = await Producer.findByPk(id);
        if (producer) {
            await producer.destroy();
            await GCS.deleteFolder(`${id}/`);
            res.status(200).json({ message: 'Productor eliminado correctamente' });
        } else {
            res.status(404).json({error: 'No se encontró el recurso'});
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    create,
    getAll,
    getOneProducerImage,
    getOne,
    getProducerRoleImages,
    editOne,
    addImages,
    deleteImage,
    deleteOne,
    getLastLog,
}