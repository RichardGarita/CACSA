import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../utils/authContext";
import axios from 'axios';
import BASE_URL from "../../utils/apiConfig";

const URL_API = `${BASE_URL}user/temp`;

export default function ChangeTemporaryPassword () {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {register, handleSubmit, getValues, formState: { errors, isValid },  } = useForm({mode: "all"});

    const { token } = useContext(AuthContext);

    const onSubmit = async (data) => {
        axios.put(URL_API, {password: data.password}, {
            headers: {
                'access-token': token
            }
        }).then(() => {
            toast.success('Se cambió la contraseña. Inicie sesión de nuevo, por favor', {
                autoClose: 1500,
                onClose: () => {
                    localStorage.removeItem('token');
                    window.location.reload();
                }
            })
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                toast.info('Sesión expirada', {
                    toastId: 'expiredSession',
                    autoClose: 1500,
                    onClose: () => {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }
                });
            } else {
                toast.error('Error inesperado, intente de nuevo más tarde', {
                    autoClose: 1500
                })
            }
        })
    }

    return (
        <>
            <div className="login">
                <figure className="login-logo">
                    <img src="cacsa-logo.png" alt="Logo de CACSA"></img>
                </figure>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <h4>Para continuar, debe cambiar su contraseña temporal</h4>

                    <div className="form-group">
                        <label htmlFor='password' >Nueva contraseña<small className="text-danger">*</small></label>
                        <div className="input-group">
                            <input type={showPassword ? 'text' : 'password'} className='form-control' id="password" placeholder="Contraseña"
                                {...register('password', {required: {value: true, message: 'Por favor ingrese una contraseña'},
                                pattern: {
                                    value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
                                    message: "La contraseña debe contener minúsculas, mayúsculas, números y signos especiales"
                                },
                                minLength: { value: 8, message: 'La contraseña debe tener al menos 8 caracteres' },})}/>
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

                    <div className="form-group">
                        <label htmlFor='confirmPassword'>Confirmar contraseña<small className="text-danger">*</small></label>
                        <div className="input-group">
                            <input type={showConfirmPassword ? 'text' : 'password'} className='form-control' id="confirmPassword" placeholder="Confirmar contraseña"
                                {...register('confirmPassword', {required: {value: true, message: 'Por favor ingrese una contraseña'},
                                validate: value => value === getValues('password') || 'Las contraseñas no coinciden',})}/>
                            <div className="input-group-addon">
                                { showConfirmPassword ?
                                    <FontAwesomeIcon className="show-icon" icon={faEye} onClick={() => setShowConfirmPassword(false)}/>
                                    :
                                    <FontAwesomeIcon className="show-icon" icon={faEyeSlash} onClick={() => setShowConfirmPassword(true)}/>
                                }
                            </div>
                        </div>
                        {errors.confirmPassword && <p className='error-text'>{errors.confirmPassword.message}</p>}
                    </div>

                    <div className='text-end mt-2'>
                        <button type="submit" disabled={!isValid} className="btn edit-button">Confirmar</button>
                    </div>
                </form>
            </div>
        </>
    )
}