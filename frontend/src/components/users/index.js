import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import EditUser from "./editUser";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/authContext";
import BASE_URL from "../../utils/apiConfig";
import '../../styles/Users.css'

const URL_API = `${BASE_URL}user`;

export default function ViewUsers () {
    const [users, setUsers] = useState([]);

    const {token} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(URL_API, {
            headers: {
                'access-token': token,
            }
        }).then((response) => {
            setUsers(response.data);
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                alert('Sesión expirada');
                localStorage.removeItem('token');
                navigate('/');
            }
            alert('Error al obtener los usuarios');
            console.error(error);
        })
    }, [])

    return (
        <>
            <table className="table table-striped table-hover w-75 mx-auto">
                <thead>
                    <tr>
                        <td>Nombre</td>
                        <td>Nombre de usuario</td>
                        <td>Contraseña</td>
                        <td>Administrador</td>
                        <td>Acciones</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.userName}</td>
                            <td>{user.password}</td>
                            <td>{user.admin ? 'Sí': 'No'}</td>
                            <td><EditUser user={user}/></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}