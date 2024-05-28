var Producer = require('../services/producers');

async function create(req, res, next) {
    try {
        // Procesar los datos del formulario
        const { name, date, identification, roles, fair, category, fairLocality } = req.body;
        const userId = req.decoded.id;
        if (!userId || !name || !date || !identification || !roles || !category || !fair || (!fair && !fairLocality) ) {
            throw new Error('No se encontraron los campos obligatorios');
        }
        const data = { name, date, identification, roles, fair, category, fairLocality };
        const images = req.files;
        
        const result = await Producer.create(data, userId, images);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

async function getAll(req, res, next){
    try {
        const producers = await Producer.getAll();
        res.status(200).json(producers);
    } catch(error) {
        next(error);
    }
}

async function getOne(req, res, next){
    const id = req.params.id;
    try {
        const producer = await Producer.getOne(id);
        res.status(200).json(producer);
    } catch (error) {
        next(error);
    }
}

async function getOneProducerImage(req, res, next){
    const id = req.params.id;
    const role = req.query.role;
    try {
        if (!id || !role ) {
            throw new Error('No se encontraron los campos obligatorios' );
        }
        const url = await Producer.getOneImage(id, role);
        res.status(200).json({url});
    } catch (error) {
        next(error);
    }

}

async function getProducerRoleImages (req, res, next){
    try {
        const id = req.params.id;
        const role = req.query.role;
        if (!id || !role) {
            throw new Error('No se encontraron los campos obligatorios' );
        }
        const images = await Producer.getRoleImages(id, role);
        res.status(200).json(images);
    } catch (error) {
        next(error);
    }
}

async function getLastLog(req, res, next){
    try {
        const id = req.params.id;
        if (!id) {
            throw new Error('No se encontraron los campos obligatorios' );
        }

        const log = await Producer.getLastLog(id);

        if(log) { 
            res.status(200).json({log});
        } else {
            res.status(204).json({error: 'Respuesta vacía'});
        }

    } catch (error) {
        next(error);
    }
}

async function editOne(req, res,next){
    try {
        const id = req.params.id;
        const {name, date, category, fair, fairLocality} = req.body;
        const userId = req.decoded.id;
        if (!userId || !id || !name || !date || !category || !(fair === true ? fairLocality : true)){
            throw new Error('No se encontraron los campos obligatorios' );
        }

        const data = {name, date, category, fair, fairLocality};

        const response = await Producer.editOne(data, id, userId);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

async function addImages(req, res, next){
    try {
        const {id, role} = req.body;
        const images = req.files;
        const userId = req.decoded.id;
        if (!userId || !id || !role || !images) {
            throw new Error('No se encontraron los campos obligatorios' );
        }
        
        const response = await Producer.addImages(id, role, images, userId);
        res.status(200).json(response);

    } catch (error) {
        next(error);
    }
}

async function deleteImage(req, res, next) {
    try {
        const id = req.params.id;
        const userId = req.decoded.id;
        if (!userId || !id) {
            throw new Error('No se encontraron los campos obligatorios' );
        }

        const response = await Producer.deleteImage(id, userId);
        
        res.status(200).json(response);

    } catch (error) {
        next(error);
    }
}

async function deleteOne(req, res, next) {
    try {
        const id = req.params.id;
        const admin = req.decoded.admin;
        const userId = req.decoded.id;

        if (!id) {
            throw new Error('No se encontraron los campos obligatorios' );
        }

        if (!admin || !userId) {
            throw new Error('No está autorizado');
        }

        const response = await Producer.deleteOne(id, userId);

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

async function getImagesReport(req, res, next){
    try {
        const id = req.params.id;
        if (!id)
            throw new Error('No se encontraron los campos obligatorios' );

        const response = await Producer.getImagesReport(id);
        res.status(200).json(response);
    } catch(error) {
        next(error);
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
    getImagesReport,
}