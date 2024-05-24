var Producer = require('../services/producers');

async function create(req, res) {
    try {
        // Procesar los datos del formulario
        const { name, date, identification, roles, fair, category, fairLocality } = req.body;
        const userId = req.decoded.id;
        if (!userId || !name || !date || !identification || !roles || !category || !fair || (!fair && !fairLocality) ) {
            res.status(400).json({ error: 'No se encontraron los campos obligatorios' });
            return;
        }
        const data = { name, date, identification, roles, fair, category, fairLocality };
        const images = req.files;
        
        const result = await Producer.create(data, userId, images);
        res.status(200).json(result);
    } catch (error) {
        switch (error.message) {
            default:
                res.status(500).json({ error: error.message });
                break;
            case 'Ya existe el recurso':
                res.status(402).json({ error: error.message });
                break;
            case 'Falló al crear el recurso':
                res.status(501).json({error: error.message});
                break;
        }
    }
}

async function getAll(req, res){
    try {
        const producers = await Producer.getAll();
        res.status(200).json(producers);
    } catch(error) {
        res.status(500).json({error: error.message});
    }
}

async function getOne(req, res){
    const id = req.params.id;
    try {
        const producer = await Producer.getOne(id);
        res.status(200).json(producer);
    } catch (error) {
        if (error.message === 'No se encontró el recurso')
            res.status(404).json({error: error.message});
        else
            res.status(501).json({error: error.message});
    }
}

async function getOneProducerImage(req, res){
    const id = req.params.id;
    const role = req.query.role;
    try {
        if (!id || !role ) {
            res.status(400).json({ error: 'No se encontraron los campos obligatorios' });
            return;
        }
        const url = await Producer.getOneImage(id, role);
        res.status(200).json({url});
    } catch (error) {
        switch (error.message) {
            default:
                res.status(500).json({ error: error.message });
                break;
            case 'No se encontró el recurso':
                res.status(404).json({ error: error.message });
                break;
            case 'Respuesta vacía':
                res.status(204).json({ error: error.message });
                break;
        }
    }

}

async function getProducerRoleImages (req, res){
    try {
        const id = req.params.id;
        const role = req.query.role;
        if (!id || !role) {
            res.status(400).json({ error: 'No se encontraron los campos obligatorios' });
            return;
        }
        const images = await Producer.getRoleImages(id, role);
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getLastLog(req, res){
    try {
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ error: 'No se encontraron los campos obligatorios' });
            return;
        }

        const log = await Producer.getLastLog(id);

        if(log) { 
            res.status(200).json({log});
        } else {
            res.status(204).json({error: 'Respuesta vacía'});
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function editOne(req, res){
    try {
        const id = req.params.id;
        const {name, date, category, fair, fairLocality} = req.body;
        const userId = req.decoded.id;
        if (!userId || !id || !name || !date || !category || !(fair === true ? fairLocality : true)){
            res.status(400).json({ error: 'No se encontraron los campos obligatorios' });
            return;
        }

        const data = {name, date, category, fair, fairLocality};

        const response = await Producer.editOne(data, id, userId);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function addImages(req, res){
    try {
        const {id, role} = req.body;
        const images = req.files;
        const userId = req.decoded.id;
        if (!userId || !id || !role || !images) {
            res.status(400).json({error: "No se encontraron los campos obligatorios"});
            return;
        }
        
        const response = await Producer.addImages(id, role, images, userId);
        res.status(200).json(response);

    } catch (error) {
        if (error.message === 'No se encontró el recurso')
            res.status(404).json({error: error.message});
        else
            res.status(500).json({error: error.message});
    }
}

async function deleteImage(req, res) {
    try {
        const id = req.params.id;
        const userId = req.decoded.id;
        if (!userId || !id) {
            res.status(400).json({error: "No se encontraron los campos obligatorios"});
            return;
        }

        const response = await Producer.deleteImage(id, userId);
        
        res.status(200).json(response);

    } catch (error) {
        if (error.message === 'No se encontró el recurso')
            res.status(404).json({ error: error.message });
        else
            res.status(500).json({ error: error.message });
    }
}

async function deleteOne(req, res) {
    try {
        const id = req.params.id;
        const admin = req.decoded.admin;
        const userId = req.decoded.id;

        if (!id) {
            res.status(400).json({error: "No se encontraron los campos obligatorios"});
            return;
        }

        if (!admin || !userId) {
            res.status(401).json({error: "No está autorizado"});
            return;
        }

        const response = await Producer.deleteOne(id, userId);

        res.status(200).json(response);
    } catch (error) {
        if (error.message === 'No se encontró el recurso')
            res.status(404).json({ error: error.message });
        else
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