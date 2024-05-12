import { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import {AuthContext} from '../../../utils/authContext';
import axios from 'axios';
import Modal from '../../../utils/modal';
import BASE_URL from "../../../utils/apiConfig";
import "react-toastify/dist/ReactToastify.css";

const DELETE_URL = `${BASE_URL}/producer/`;

function DeleteProducer ({id}) {
    const {token} = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    const handleDelete = () => {
        axios.delete(`${DELETE_URL}${id}`, {
            headers: {
                'access-token': token
            }
        } ).then(() => {
            setShowModal(false);
            toast.success('Productor borrado efectivamente', {
                autoClose: 1000,
                onClose: () => {
                    window.location.reload();
                }
            });
        }).catch(error => {
            if (error.response && error.response.status === 400) {
                toast.warning('Todos los campos son obligatorios', {
                  autoClose: 1500,
                });
            } else if (error.response && error.response.status === 401) {
                if (error.error === "No está autorizado") {
                    toast.warning('Usted no está autorizado', {
                        autoClose: 1500,
                        onClose: () => {
                            navigate('/');
                        }
                    });
                } else {
                    toast.info('Sesión expirada', {
                        autoClose: 1500,
                        onClose: () => {
                            localStorage.removeItem('token');
                            navigate('/');
                        }
                    });
                }
            } else {
                console.error(error);
                toast.error('Error al eliminar el productor', {
                    autoClose: 1500,
                });
            }
        })
    }
    return (
        <>
            <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                content={<>
                    <p>¿Está seguro de querer eliminar este productor? <br/><strong>Esta acción es irreversible</strong></p>
                    <button className="btn delete-button" onClick={() => handleDelete()}>Borrar</button>
                </>}
                size={'md'}
            />
            <FontAwesomeIcon icon={faTrash} aria-hidden="true"
                onClick={() => setShowModal(true)} className='delete-icon'/>
        </>
    )
}

export default DeleteProducer;