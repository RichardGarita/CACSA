import React, {useState} from "react";
import DropZone from "../../utils/dropZone";

function AddFile () {
    const [droppedFiles, setDroppedFiles] = useState([]);

    const removeFile = (fileName) => {
        setDroppedFiles(files => files.filter(file => file.name !== fileName));
    }

    const onSubmit = () => {
        if (droppedFiles.length > 0) {
            console.log(`Images: ${droppedFiles}`);
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