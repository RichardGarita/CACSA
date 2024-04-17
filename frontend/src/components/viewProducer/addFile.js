import React, {useState} from "react";
import axios from "axios";
import DropZone from "../../utils/dropZone";

const URL_API = 'http://localhost:4223/api/productor/addImages';

function AddFile ({id, role}) {
    const [droppedFiles, setDroppedFiles] = useState([]);

    const removeFile = (fileName) => {
        setDroppedFiles(files => files.filter(file => file.name !== fileName));
    }

    const onSubmit = async () => {
        const formData = new FormData();

        for (const file of droppedFiles) {
            formData.append('images', file);
        }

        formData.append('id', id);
        formData.append('role', role);

        try {
            await axios.post(URL_API, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then(() => {
                alert('Imágenes subidas correctamente');
            });
          } catch (error) {
            if (error.response && error.response.status === 401) {
              alert('Todos los campos son obligatorios');
            } else if (error.response && error.response.status === 404) {
                alert('No se encontró el recurso');
            } else {
              console.error('Error al enviar el formulario:', error);
            }
          }
    }

    return (
        <div className="add-image">
            <DropZone setDroppedFiles={setDroppedFiles} />

            {droppedFiles.length >0 && (
                <div className="files-dropped">
                    <h4>Imagenes para enviar</h4>
                    <ul className="list-unstyled row">
                        {droppedFiles.map(file => (
                            <li key={file.name} className="position-relative drop-images" width={25}>
                                <img src={file.preview} alt='' onLoad={() => {URL.revokeObjectURL(file.preview)}}/>
                                <span aria-hidden="true" className="position-absolute top-0 end-0" onClick={() => removeFile(file.name)}>&times;</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {<button disabled={droppedFiles.length <= 0} onClick={() => onSubmit()}>Agregar</button>}

        </div>
    )
}

export default AddFile;