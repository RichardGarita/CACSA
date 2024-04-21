import React, {useState, useContext} from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import {AuthContext} from '../../../utils/authContext';
import {ToastContainer, toast} from 'react-toastify';
import DropZone from "../../../utils/dropZone";
import Modal from "../../../utils/modal";
import BASE_URL from "../../../utils/apiConfig";
import "react-toastify/dist/ReactToastify.css";

const URL_API = `${BASE_URL}producer/images`;

function AddFile ({id, role}) {
    const [droppedFiles, setDroppedFiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(<></>)

    const {token} = useContext(AuthContext);

    const removeFile = (index) => {
        setDroppedFiles(files => files.filter((_, fileIndex) => fileIndex !== index));
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
                'access-token': token,
                'Content-Type': 'multipart/form-data'
              }
            }).then(() => {
                toast.success('Imágenes subidas correctamente', {
                    autoClose: 2000,
                    onClose: () => {
                        window.location.reload();
                    }   
                });
            });
          } catch (error) {
            if (error.response && error.response.status === 400) {
              toast.warning('Todos los campos son obligatorios', {
                autoClose: 2000,
              });
            } else if (error.response && error.response.status === 404) {
                toast.error('No se encontró el productor', {
                    autoClose: 2000,
                });
            } else {
              toast.error('Error inesperado. Intente de nuevo', {
                autoClose: 2000,
              })
              console.error('Error al enviar el formulario:', error);
            }
          }
    }

    return (
        <>
            <ToastContainer/>
            <div className="add-image">
                <DropZone setDroppedFiles={setDroppedFiles} />

                {<button className="btn add-button" disabled={droppedFiles.length <= 0} onClick={() => onSubmit()}>Agregar</button>}

            </div>
            {droppedFiles.length >0 && (
                <div className="row dropped-images" >
                    <Modal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        content={modalContent}
                        size={"xl"}
                    />
                    {droppedFiles.map((file, index) => (
                        <div key={index} className="col-3">
                            <div className="card added-image">
                                <img src={file.preview} alt='' className="card-img"
                                    onClick={() => {
                                        setShowModal(true);
                                        setModalContent(<img src={file.preview} alt='' className="card-img"/>)
                                    }
                                }/>
                                <FontAwesomeIcon icon={faCircleXmark} aria-hidden="true" className="position-absolute top-0 end-0 remove-icon" onClick={() => removeFile(index)}/>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default AddFile;