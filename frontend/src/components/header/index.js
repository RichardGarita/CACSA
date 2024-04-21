import React, {useState, useEffect, useContext} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowRightFromBracket, faUserPen } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { AuthContext } from '../../utils/authContext';
import Modal from '../../utils/modal';
import BASE_URL from '../../utils/apiConfig';
import "react-toastify/dist/ReactToastify.css";
import '../../styles/Header.css';

const URL_API = `${BASE_URL}user/`

function Header () {
    const [data, setData] = useState('');
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    const {id, setToken, token} = useContext(AuthContext);

    useEffect(() => {
        axios.get(`${URL_API}${id}`, {
            headers: {
                'access-token': token,
            }
        }).then(response => {
            setData(response.data);
        }).catch(error => {
            if (error.response && error.response.status !== 401)
            toast.error('Error inesperado. Intente de nuevo', {
                autoClose: 2000,
            });
            console.error(error);
        })
    }, [id, token])

    const signOut = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/');
    }

    return (
        <nav className='header'>
            <ToastContainer/>
            <Link to={'/'} className='logo'>
                <img src='/cacsa-logo.png' alt='Logo de CACSA. Volver al Inicio'></img>
            </Link>
            <section className='profile' onClick={() => setShowModal(true)}>
                <p>{data.name}</p>
                <FontAwesomeIcon icon={faUser}/>
            </section>
            <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                size={'sm'}
                titulo={<>
                    <FontAwesomeIcon icon={faUser}/>
                    {data.name}
                </>}
                content={
                    <>
                        <section className='d-inline'>
                            <p className='d-inline'><strong>Nombre de usuario: </strong></p>
                            <p className='d-inline'>{data.userName}</p>
                        </section>
                        <section className='link'>
                            <FontAwesomeIcon className='me-2' icon={faArrowRightFromBracket} />
                            <p onClick={() => signOut()}>Cerrar Sesión</p>
                        </section>
                        {data.admin === true && (
                            <section className='link'>
                                <FontAwesomeIcon className='me-2' icon={faUserPen} />
                                <a href={'/users'}>Ver usuarios</a>
                            </section>
                        )}
                    </>
                }
            />
        </nav>
    )
}

export default Header;