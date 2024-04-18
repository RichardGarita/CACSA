var GCS = require('../servicios/gcs');
var Producer = require('../modelos/producers');
var Image = require('../modelos/images');
const { v4: uuidv4 } = require('uuid');

async function create(req, res) {
    try {
        // Procesar los datos del formulario
        const { name, date, id, roles, fair, category, fairLocality } = req.body;
        if (!name || !date || !id || !roles || !category || !fair || (!fair && !fairLocality) ) {
            res.status(400).json({ error: 'Todos los campos son necesarios' });
            return;
        }
        const images = req.files;
        const rolesArray = JSON.parse(roles);

        const existed = await Producer.findOne({where: {id}})
        if (existed) {
            res.status(402).json({ error: 'Ya existe el productor' });
            return;
        }

        const producer = await Producer.create({name, date, id, fair, category, fairLocality});
        if (!producer){
            res.status(501).json({ error: 'Falló al crear el productor' });
            return;
        }

        // Iterar sobre las imágenes recibidas
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            if (image) {
                // Generar un nombre único para la imagen en GCS
                const imageName = `${id}/${uuidv4()}_${image.originalname}`;

                const role = i < rolesArray.length ? rolesArray[i] : 'Other';
                
                // Subir el archivo a GCS
                await GCS.uploadFile(image.buffer, imageName);

                // Save the images information on the database
                await Image.create({producerId: id, path: imageName, role});
            }
        }
        // Responder al frontend con la URL de las imágenes o un mensaje de confirmación
        res.status(200).json({ message: 'Imágenes subidas correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
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

async function editOne(req, res){
    try {
        const id = req.params.id;
        const {name, date, fair} = req.body;
        if (!id || !name || !date || !fair){
            res.status(400).json({ error: 'No se encontraron los campos' });
            return;
        }
        await Producer.update({name, date, fair}, {where: {id: id}});
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

async function getOneImage(req, res){
    const path = req.query.path;
    try {
        const url = await GCS.getFile(path);
        res.status(200).json({url})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

module.exports = {
    create,
    getOneProducerImage,
    getOne,
    getProducerRoleImages,
    editOne,
    addImages,
    deleteImage,
}