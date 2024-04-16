import React, {useCallback} from "react";
import {useDropzone} from 'react-dropzone'

function DropZone({setDroppedFiles}) {
    const onDrop = useCallback(acceptedFiles => {
        if(acceptedFiles?.length) {
            setDroppedFiles(previousDroppedFiles => [
                ...previousDroppedFiles,
                ...acceptedFiles.map(file => 
                    Object.assign(file, {preview: URL.createObjectURL(file)})
                )
            ])
        }
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})


    return (
        <div {...getRootProps({className: 'drop-zone'})}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                <p>Suelta la imagen aquí...</p> :
                <p>Arrastra imagenes aquí, o clickea para seleccionarlas</p>
            }
        </div>
    )
}

export default DropZone;