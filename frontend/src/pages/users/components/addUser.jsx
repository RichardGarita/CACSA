import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import {toast} from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../utils/authContext";
import axios from "axios";
import Modal from "../../../utils/modal";
import BASE_URL from "../../../utils/apiConfig";
import "react-toastify/dist/ReactToastify.css";

const URL_API = `${BASE_URL}user`;

export default function AddUser () {
    const {register, handleSubmit, formState: { errors, isValid },  } = useForm({mode: "all"});
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const {token} = useContext(AuthContext);

    const onSubmit = (data) => {
        axios.post(URL_API, data, {
            headers: {
                'access-token': token,
            }
        }).then(() => {
            toast.success('Usuario agregado', {
                autoClose: 1500,
                onClose: () => {
                    setShowModal(false);
                    window.location.reload();
                }
            });
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                toast.info('Sesión Expirada', {
                    toastId: 'expiredSession',
                    autoClose: 1500,
                    onClose: () => {
                        localStorage.removeItem('token');
                        navigate('/');
                    }
                });
            } else if (error.response && error.response.status === 402) {
                toast.warning('Ya existe el usuario', {
                    autoClose: 1500,
                });
            } else {
                toast.error('Error Inesperado', {
                    autoClose: 1500,
                });
                console.error(error);
            }
        })
    }

    return (
        <>
            <FontAwesomeIcon className="add-icon" onClick={() => setShowModal(true)} icon={faUserPlus}/>
            <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                titulo={"Agregar Usuario"}
                content={
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='form-group'>
                            <label htmlFor="name">Nombre<small className="text-danger">*</small></label>
                            <input type="text" className='form-control' id="name" placeholder="Nombre"
                                {...register('name', {required: {value: true, message: 'Por favor ingrese un nombre'}})}/>
                            {errors.name && <p className='error-text'>{errors.name.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="name">Correo electrónico<small className="text-danger">*</small></label>
                            <input type="email" className='form-control' id="email" placeholder="correo@ejemplo.com"
                                {...register('email', {required: {value: true, message: 'Por favor ingrese un correo electrónico'},
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: 'El correo debe tener un formato válido'
                                    }
                                })}/>
                            {errors.email && <p className='error-text'>{errors.email.message}</p>}
                        </div>
                        <button type="submit" disabled={!isValid} className="btn edit-button">Confirmar</button>
                    </form>
                }
            />
        </>
    )
}