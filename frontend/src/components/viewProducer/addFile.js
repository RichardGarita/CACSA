import React, {useState} from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import DropZone from "../../utils/dropZone";
import BASE_URL from "../../utils/apiConfig";

const URL_API = `${BASE_URL}productor/images`;

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
            if (error.response && error.response.status === 400) {
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

            {<button className="btn add-button" disabled={droppedFiles.length <= 0} onClick={() => onSubmit()}>Agregar</button>}

            {droppedFiles.length >0 && (
                <div className="files-dropped">
                    <h4>Imagenes para enviar</h4>
                    <ul className="list-unstyled row">
                        {droppedFiles.map(file => (
                            <li key={file.name} className="position-relative drop-images" width={25}>
                                <img src={file.preview} alt='' onLoad={() => {URL.revokeObjectURL(file.preview)}}/>
                                <FontAwesomeIcon icon={faCircleXmark} aria-hidden="true" className="position-absolute top-0 end-0 remove-icon" onClick={() => removeFile(file.name)}/>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    )
}

export default AddFile;