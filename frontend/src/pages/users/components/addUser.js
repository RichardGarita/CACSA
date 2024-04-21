import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../utils/authContext";
import axios from "axios";
import Modal from "../../../utils/modal";
import BASE_URL from "../../../utils/apiConfig";

const URL_API = `${BASE_URL}user`;

export default function AddUser () {
    const {register, handleSubmit, formState: { errors, isValid },  } = useForm({mode: "all"});
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const {token} = useContext(AuthContext);

    const onSubmit = (data) => {
        axios.post(URL_API, data, {
            headers: {
                'access-token': token,
            }
        }).then(() => {
            alert('Usuario agregado');
            setShowModal(false);
            window.location.reload();
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                alert('Sesión Expirada');
                navigate('/');
            } else if (error.response && error.response.status === 402) {
                alert('Ya existe el usuario');
            } else {
                alert('Error Inesperado');
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
                            <label htmlFor="name">Nombre:</label>
                            <input type="text" className='form-control' id="name" placeholder="Nombre"
                                {...register('name', {required: {value: true, message: 'Por favor ingrese un nombre'}})}/>
                            {errors.name && <p className='error-text'>{errors.name.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="name">Nombre de usuario:</label>
                            <input type="text" className='form-control' id="userName" placeholder="Nombre de Usuario"
                                {...register('userName', {required: {value: true, message: 'Por favor ingrese un nombre de usuario'}})}/>
                            {errors.userName && <p className='error-text'>{errors.userName.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="password">Contraseña:</label>
                            <div className="input-group">
                                <input type={showPassword ? 'text' : 'password'} className='form-control' id="password" placeholder="Contraseña"
                                    {...register('password', {required: {value: true, message: 'Por favor ingrese una contraseña'},
                                    pattern: {
                                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
                                        message: "La contraseña contener minúsculas, mayúsculas, números y signos especiales"
                                    },
                                    minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres' }})}/>
                                <div className="input-group-addon">
                                    { showPassword ?
                                        <FontAwesomeIcon className="show-icon" icon={faEye} onClick={() => setShowPassword(false)}/>
                                        :
                                        <FontAwesomeIcon className="show-icon" icon={faEyeSlash} onClick={() => setShowPassword(true)}/>
                                    }
                                </div>
                            </div>
                            {errors.password && <p className='error-text'>{errors.password.message}</p>}
                        </div>
                        <button type="submit" disabled={!isValid} className="btn edit-button">Confirmar</button>
                    </form>
                }
            />
        </>
    )
}