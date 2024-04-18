import React, {useState, useEffect} from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Modal from "../../utils/modal";
import BASE_URL from "../../utils/apiConfig";

const URL_API = `${BASE_URL}productor`;

function EditImages ({id, role}) {
    const [images, setImages] = useState([]);
    const ROLE_URL = `${URL_API}/images/all/${id}?role=${role}`;
    const DELETE_URL = `${URL_API}/images`;

    useEffect(() => {
        axios.get(ROLE_URL).then((response) => {
            setImages(response.data);
        }).catch((error) => {
            console.error(error);
            alert('Error al obtener las imágenes del productor');
        })
    }, []);

    const deleteImage = async (id) => {
        try {
            axios.delete(`${DELETE_URL}/${id}`).then(() => {
                alert('Imágen borrada efectivamente');
                setImages(prevImages => prevImages.filter(image => image.id !== id));
            }).catch ((error) => {
                console.error(error);
                alert('Error al borrar la imágen');
            }) 
        } catch (error) {
            console.error(error);
            alert('Error al eliminar la imágen');
        }
    }

    return (
        <div className="row dropped-images p-1" >
                {images.map((image, index) => (
                    <div key={index} className="col-2">
                        <div className="card added-image">
                            <Modal launchModal={
                                <img src={image.url[0]} alt='' onLoad={() => {URL.revokeObjectURL(image.url[0])}} className="card-img"/>
                            } content={
                                <img src={image.url[0]} alt='' onLoad={() => {URL.revokeObjectURL(image.url[0])}} className="card-img"/>
                            }/>
                            <Modal launchModal={
                                <FontAwesomeIcon icon={faCircleXmark} aria-hidden="true"
                                className="position-absolute top-0 end-0 remove-icon" 
                                />
                            } content={
                                <p>¿Está seguro de querer eliminar esta imágen? <br/><strong>Esta acción es irreversible</strong></p>
                            } continueButton={
                                <button className="btn delete-button" onClick={() => deleteImage(image.id)}>Borrar</button>
                            } titulo={
                                "Borrar Imagen"
                            }/>
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default EditImages;