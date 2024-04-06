var GCS = require('../servicios/gcs');
var Producer = require('../modelos/producers');
var Image = require('../modelos/images');
const { v4: uuidv4 } = require('uuid');

async function create(req, res) {
    try {
        // Procesar los datos del formulario
        const { name, date, id, roles, fair } = req.body;
        if (!name || !date || !id || !roles || !fair ) {
            res.status(401).json({ error: 'All fields must be fullfiled' });
            return;
        }
        const images = req.files;
        const rolesArray = JSON.parse(roles);

        const producer = await Producer.create({name, date, id, fair});
        if (!producer){
            res.status(500).json({ error: 'Failed to create producer' });
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
    getOne,
}