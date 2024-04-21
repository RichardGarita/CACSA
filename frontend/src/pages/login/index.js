import React, {useContext, useState} from "react";
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { AuthContext } from "../../utils/authContext";
import BASE_URL from "../../utils/apiConfig";
import '../../styles/Login.css';

const URL_API = `${BASE_URL}user/login`

function Login () {
    const {register, handleSubmit, formState: { errors, isValid },  } = useForm({mode: "all"});
    const [showPassword, setShowPassword] = useState(false);
    const { signIn } = useContext(AuthContext);

    const onSubmit = async (data) => {
        try {
            await axios.post(URL_API, data, {headers: {
                'Content-Type': 'application/json'
            }}).then((response) => {
                localStorage.setItem('token', response.data.token);
                signIn();
                alert('Se ha inciado sesión correctamente');
            })
        } catch (error) {
            if (error.response && error.response.status === 402) {
                alert('Usuario o contraseña incorrectas');
              } else {
                console.error('Error al enviar el formulario:', error);
                alert('Algo salió mal, intenta de nuevo');
              }
        }
    }

    return (
        <div className="login">
            <figure className="login-logo">
                <img src="cacsa-logo.png"></img>
            </figure>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='form-group'>
                    <label htmlFor="userName">Nombre de usuario: </label>
                    <input type="text" className='form-control' autoComplete="username" id="userName" placeholder="Nombre de Usuario"
                    {...register('userName', {required: {value: true, message: 'Por favor escriba el nombre'}})} />
                    {errors.userName && <p className='error-text'>{errors.userName.message}</p>}
                </div>

                <div className='form-group'>
                    <label htmlFor="password">Contraseña:</label>
                    <div className="input-group">
                        <input type={showPassword ? 'text' : 'password'} className='form-control' id="password" placeholder="Contraseña"
                            {...register('password', {required: {value: true, message: 'Por favor ingrese una contraseña'}})}/>
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
                <button disabled={!isValid} type="submit" className='btn continue'>Iniciar Sesión</button>
            </form>
        </div>
    )
}

export default Login;