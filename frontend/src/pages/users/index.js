import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import EditUser from "./components/editUser";
import DeleteUser from "./components/deleteUser";
import FilterUser from "./components/filter";
import AddUser from "./components/addUser";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/authContext";
import BASE_URL from "../../utils/apiConfig";
import '../../styles/Users.css'

const URL_API = `${BASE_URL}user`;

export default function ViewUsers () {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentUsers, setCurrentUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const usersPerPage = 5;

    const {token} = useContext(AuthContext);
    const navigate = useNavigate();

    const goToPage = (page) => {
        setCurrentPage(page);
    }

    useEffect(() => {
        axios.get(URL_API, {
            headers: {
                'access-token': token,
            }
        }).then((response) => {
            setUsers(response.data);
            setFilteredUsers(response.data);
            setTotalPages(Math.ceil(response.data.length / usersPerPage));
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

    useEffect(() => {
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        setCurrentUsers(filteredUsers.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(filteredUsers.length / usersPerPage));
    }, [currentPage, filteredUsers, usersPerPage]);

    return (
        <>
            <div className="search-section">
                <FilterUser elements={users} setElements={setFilteredUsers}/>     
                <AddUser/>           
            </div>
            <table className="table table-striped table-hover w-75 mx-auto">
                <thead>
                    <tr>
                        <td>Nombre</td>
                        <td>Nombre de usuario</td>
                        <td>Administrador</td>
                        <td>Acciones</td>
                    </tr>
                </thead>
                <tbody className="users-table">
                    {currentUsers.map((user, index) => (
                        <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.userName}</td>
                            <td>{user.admin ? 'Sí': 'No'}</td>
                            <td>
                                <EditUser user={user}/>
                                {!user.admin && (
                                    <DeleteUser id={user.id}/>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <nav>
                <ul className="pagination justify-content-center">
                    <li key={'prev'} className="page-item">
                        <span onClick={() => goToPage(Math.max(currentPage-1, 1))} className="page-link">&laquo;</span>
                    </li>
                    {Array.from({length: totalPages}, (_, i) => i + 1).map((i) => (
                        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                            <span onClick={() => goToPage(i)} className="page-link">{i}</span>
                        </li>
                    ))}
                    <li key={'next'} className="page-item">
                        <span onClick={() => goToPage(Math.min(currentPage+1, totalPages))} className="page-link">&raquo;</span>
                    </li>
                </ul>
            </nav>
        </>
    )
}