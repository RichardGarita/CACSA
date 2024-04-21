import React, {useContext} from "react";
import { useForm } from 'react-hook-form';
import axios from "axios";
import { AuthContext } from "../../utils/authContext";
import BASE_URL from "../../utils/apiConfig";
import '../../styles/Login.css';

const URL_API = `${BASE_URL}user/login`

function Login () {
    const {register, handleSubmit, formState: { errors, isValid },  } = useForm({mode: "all"});
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
                    <label>Nombre de usuario: </label>
                    <input type="text" className='form-control' autoComplete="username"
                    {...register('userName', {required: {value: true, message: 'Por favor escriba el nombre'}})} />
                    {errors.userName && <p className='error-text'>{errors.userName.message}</p>}
                </div>

                <div className='form-group'>
                    <label>Contraseña</label>
                    <input type="text" className='form-control' autoComplete="password"
                    {...register('password', {required: {value: true, message: 'Por favor escriba la contraseña'}})} />
                    {errors.password && <p className='error-text'>{errors.password.message}</p>}
                </div>

                <button disabled={!isValid} type="submit" className='btn continue'>Iniciar Sesión</button>
            </form>
        </div>
    )
}

export default Login;