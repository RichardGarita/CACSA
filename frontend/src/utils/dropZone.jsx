import React, {useCallback} from "react";
import {useDropzone} from 'react-dropzone'
import { toast } from "react-toastify";

function DropZone({setDroppedFiles}) {
    const onDrop = useCallback(acceptedFiles => {
        if(acceptedFiles?.length) {
            const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));

            if (acceptedFiles.length !== imageFiles?.length)
                toast.info('Sólo se permiten imágenes', {autoClose:1500});

            if (imageFiles?.length) {
                setDroppedFiles(previousDroppedFiles => [
                    ...previousDroppedFiles,
                    ...imageFiles.map(file => 
                        Object.assign(file, {preview: URL.createObjectURL(file)})
                    )
                ])
            }
        }
    }, [setDroppedFiles])
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