var GCS = require('../servicios/gcs');
const { v4: uuidv4 } = require('uuid');

async function create(req, res) {
    try {
        // Procesar los datos del formulario
        const { name, date, id } = req.body;
        const images = req.files;

        // Iterar sobre las imágenes recibidas
        const imageUrls = [];
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            if (image) {
                console.log(image);
                // Generar un nombre único para la imagen en GCS
                const imageName = `${uuidv4()}_${image.originalname}`;
                
                // Subir el archivo a GCS
                const imageUrl = await GCS.uploadFileBuffer(image.buffer, imageName);

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

async function uploadFile(req, res) {
    const {file, fileOutputName} = req.body;

    try {
        const file = 'file.txt';
        const fileOutputName = 'file.txt';
        const response = await GCS.uploadFile(file, fileOutputName);
        console.log('Se llego!');
        if (response && response[0]) { // Verificar si se devolvió una respuesta y si tiene datos
            res.status(200).json(response[0]); // Devolver la respuesta de la carga del archivo
        } else {
            res.status(402).json({error: 'Missed response'});
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    uploadFile,
    create
};