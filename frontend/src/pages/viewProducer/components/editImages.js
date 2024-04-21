import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import {AuthContext} from '../../../utils/authContext';
import {ToastContainer, toast} from 'react-toastify';
import Modal from "../../../utils/modal";
import BASE_URL from "../../../utils/apiConfig";
import "react-toastify/dist/ReactToastify.css";

const URL_API = `${BASE_URL}producer`;

function EditImages ({id, role}) {
    const [images, setImages] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(<></>);
    const [modalSize, setModalSize] = useState('xl');
    const {token} = useContext(AuthContext);
    const ROLE_URL = `${URL_API}/images/all/${id}?role=${role}`;
    const DELETE_URL = `${URL_API}/images`;

    useEffect(() => {
        axios.get(ROLE_URL, {
            headers: {
                'access-token': token,
            }
        }).then((response) => {
            setImages(response.data);
        }).catch((error) => {
            console.error(error);
            toast.error('Error al obtener las imágenes del productor', {
                autoClose: 2000,
            });
        })
    }, [ROLE_URL, token]);

    const deleteImage = async (id) => {
        try {
            axios.delete(`${DELETE_URL}/${id}`, {
                headers: {
                    'access-token': token
                }
            }).then(() => {
                toast.success('Imágen borrada efectivamente', {
                    autoClose: 2000,
                    onClose: () => {
                        setImages(prevImages => prevImages.filter(image => image.id !== id));
                        setShowModal(false);
                    }
                });
            }).catch ((error) => {
                console.error(error);
                toast.error('Error al borrar la imágen. Intente de nuevo', {
                    autoClose: 2000, 
                });
            }) 
        } catch (error) {
            console.error(error);
            toast.error('Error al borrar la imágen. Intente de nuevo', {
                autoClose: 2000, 
            });
        }
    }

    return (
        <div className="row dropped-images p-1" >
            <ToastContainer/>
            <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                content={modalContent}
                size={modalSize}
            />
            {images.map((image, index) => (
                <div key={index} className="col-3">
                    <div className="card added-image">
                        <img src={image.url[0]} alt=''
                            onLoad={() => {URL.revokeObjectURL(image.url[0])}} className="card-img"
                            onClick={() => {
                                setShowModal(true);
                                setModalSize('xl')
                                setModalContent(
                                    <img src={image.url[0]} alt='' onLoad={() => {URL.revokeObjectURL(image.url[0])}} className="card-img"/>
                                )
                            }}/>
                        <FontAwesomeIcon icon={faCircleXmark} aria-hidden="true"
                            className="position-absolute top-0 end-0 remove-icon" 
                            onClick={() => {
                                setShowModal(true);
                                setModalSize('md')
                                setModalContent(<>
                                    <p>¿Está seguro de querer eliminar esta imágen? <br/><strong>Esta acción es irreversible</strong></p>
                                    <button className="btn delete-button" onClick={() => deleteImage(image.id)}>Borrar</button>
                                </>)
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default EditImages;