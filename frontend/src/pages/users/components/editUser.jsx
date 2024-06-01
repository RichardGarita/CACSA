import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPen } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../utils/authContext";
import {toast} from 'react-toastify';
import axios from "axios";
import Modal from "../../../utils/modal";
import BASE_URL from "../../../utils/apiConfig";
import "react-toastify/dist/ReactToastify.css";

const URL_API = `${BASE_URL}user`;

export default function EditUser({user}) {
    const [showModal, setShowModal] = useState(false);

    const {token} = useContext(AuthContext);
    const navigate = useNavigate();

    const {register, handleSubmit, formState: { errors, isValid },  } = useForm({mode: "all"});

    const onSubmit = (data) => {
        const formData = {
            ...data,
            id: user.id,
        }
        axios.put(URL_API, formData, {
            headers: {
                'access-token': token
            }
        }).then(() => {
            toast.success('Usuario actualizado', {
                autoClose: 1500,
                onClose: () => {
                    setShowModal(false);
                    window.location.reload();
                }
            });
        }).catch (error => {
            if (error.response && error.response.status === 401) {
                toast.info('Sesión Expirada', {
                    toastId: 'expiredSession',
                    autoClose: 1500,
                    onClose: () => {
                        localStorage.removeItem('token');
                        navigate('/');
                    }
                });
            } else {
                toast.error('Error al actualizar el usuario. Intente de nuevo');
                console.error(error);
            }
        })
    }


    return (
        <>
            <FontAwesomeIcon className="edit-icon" icon={faUserPen} onClick={() => setShowModal(true)}/>

            <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                titulo={"Editar Usuario"}
                content={
                    <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='form-group'>
                                <label htmlFor="name">Nombre<small className="text-danger">*</small></label>
                                <input type="text" className='form-control' id="name"
                                    {...register('name', {required: {value: true, message: 'Por favor ingrese un nombre'}})}
                                    defaultValue={user.name} />
                                {errors.name && <p className='error-text'>{errors.name.message}</p>}
                            </div>

                            <div className='form-group'>
                                <label htmlFor="email">Correo electrónico<small className="text-danger">*</small></label>
                                <input type="text" className='form-control' id="email" placeholder="correo@ejemplo.com"
                                    {...register('email', {required: {value: true, message: 'Por favor ingrese un correo'}})}
                                    defaultValue={user.email} />
                                {errors.email && <p className='error-text'>{errors.email.message}</p>}
                            </div>
                            <button disabled={!isValid} type="submit" className="btn edit-button">Confirmar</button>
                        </form>
                    </>
                }
            />
        </>
    )
}