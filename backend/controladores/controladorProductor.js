var GCS = require('../servicios/gcs');
var Producer = require('../modelos/producers');
const { v4: uuidv4 } = require('uuid');

async function create(req, res) {
    try {
        // Procesar los datos del formulario
        const { name, date, id } = req.body;
        if (!name || !date || !id) {
            res.status(401).json({ error: 'All fields must be fullfiled' });
            return;
        }
        const images = req.files;

        const directory = `${id}/pass/`;


        // Iterar sobre las imágenes recibidas
        const imageUrls = [];
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            if (image) {
                console.log(image);
                // Generar un nombre único para la imagen en GCS
                const imageName = `${directory}${uuidv4()}_${image.originalname}`;
                
                // Subir el archivo a GCS
                const imageUrl = await GCS.uploadFile(image.buffer, imageName);

                // Guardar la URL de la imagen en un array
                imageUrls.push(imageUrl);
            }
        }

        // Guardar los datos y las URLs de las imágenes en la base de datos

        // Responder al frontend con la URL de las imágenes o un mensaje de confirmación
        res.status(200).json({ message: 'Imágenes subidas correctamente', imageUrls });
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