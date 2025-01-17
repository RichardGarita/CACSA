import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPen, faFileCirclePlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import {toast} from 'react-toastify';
import EditProfile from './components/editProfile';
import AddFile from './components/addFile';
import EditImages from './components/editImages';
import GenerateReport from './components/generateReport';
import { AuthContext } from '../../utils/authContext';
import { convertToLocaleDateTime } from '../../utils/dateConverter';
import Modal from '../../utils/modal';
import BASE_URL from '../../utils/apiConfig';
import "react-toastify/dist/ReactToastify.css";
import '../../styles/ViewProducer.css';

const URL_API = `${BASE_URL}producer`;
const URL_IMAGES = `${URL_API}/images/latest`;

function ViewProducer () {

    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState({});
    const [images, setImages] = useState({});
    const [actualImage, setActualImage] = useState('');
    const [editProps, setEditProps] = useState({});
    const [actualComponent, setActualComponent] = useState('Image');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(<></>);
    const [lastLog, setLastLog] = useState("");

    const {token} = useContext(AuthContext);

    const handleComponentChange = (component) => {
        if (actualComponent === component)
            setActualComponent('Image');
        else
            setActualComponent(component);
    }

    useEffect(() => {
        axios.get(`${URL_API}/${id}`, {
            headers: {
                'access-token': token
            }
        }).then((response) => {
            setData(response.data);
            setEditProps({name: response.data.name, date: response.data.date, 
                id, fair: response.data.fair, category: response.data.category, 
                fairLocality: response.data.fairLocality ? response.data.fairLocality.split(', ') : []});
        }).catch((error) => {
            if(error.response && error.response.status === 401) {
                toast.info('Sesión Expirada', {
                    toastId: 'expiredSession',
                    autoClose: 1500,
                    onClose: () => {
                        localStorage.removeItem('token');
                        navigate('/');
                    }
                });
            } else if(error.response && error.response.status === 404) {
                navigate('/404');
            } else {
                console.error(error);
                toast.error('Algo salió mal. Intente de nuevo', {
                    autoClose: 1500,
                });
            }
        })
    }, [id, navigate, token]);

    useEffect(() => {
        if (data.identification) {
            axios.get(`${URL_API}/${id}/log`, {
                headers: {
                    'access-token': token
                }
            }).then((response) => {
                setLastLog(convertToLocaleDateTime(response.data.log.updatedAt));
            }).catch((error) => {
                console.error(error);
                toast.error(
                    'Algo salió mal. Por favor, intente de nuevo', {
                        autoClose: 1000
                    }
                )
            })
        }
    }, [data, token])

    const getImage = async (role) => {
        if (!images[role]) {
            await axios.get(`${URL_IMAGES}/${id}?role=${role}`, {
                headers: {
                    'access-token': token,
                }
            }).then(response => {
                setImages(prevImages => {
                    return {...prevImages, [role]: response.data.url};
                })
            }).catch(error => {
                console.error(error);
            })
        }
        setActualImage(role);
        setActualComponent('Image');
    }

    return (
        <div className='view-producer'>
            <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                content={modalContent}
                titulo={"Actualizar Productor"}
            />
            <div className='left-menu'>
                <small className='last-log'><em>Última edición: {lastLog}</em></small>
                <div className='edit-profile'>
                    <h4>Productor</h4>
                    <FontAwesomeIcon className='edit-icon' icon={faUserPen}
                        onClick={() => {
                            setShowModal(true);
                            setModalContent(<EditProfile props={editProps}/>);
                        }}
                    />
                    <GenerateReport data={data ? data : {}} producerId={id}/>
                </div>
                <div className='profile-data'>
                    <p>Nombre:</p>
                    <p>{data.name}</p>
                </div>
                <div className='profile-data'>
                    <p>Cédula:</p>
                    <p>{data.identification}</p>
                </div>
                <div className='profile-data'>
                    <p>Expiración del carnet:</p>
                    <p>{data.date}</p>
                </div>
                <div className='profile-data'>
                    <p>Categoría:</p>
                    <p>{data.category}</p>
                </div>
                <div className='profile-data'>
                    <p>Permiso de feria:</p>
                    <p>{data.fair ? 'Sí' : 'No'}</p>
                </div>
                {data.fair && (
                    <div className='profile-data'>
                        <p>Localidad:</p>
                        <p>{data.fairLocality}</p>
                    </div>
                )}
                <h4>Imágenes Generales</h4>
                <p className='image-link' onClick={() => getImage('idScreenShot')}>Cédula</p>
                <p className='image-link' onClick={() => getImage('foodHandling')}>Carnet de manipulación de alimentos</p>
                <p className='image-link' onClick={() => getImage('fairPass')}>Carnet de ferias</p>
                <h4>Carnet de Ferias</h4>
                <p className='image-link' onClick={() => getImage('propertyTitle')}>Contrato de arrendamiento/titulo de propiedad</p>
                <p className='image-link' onClick={() => getImage('products')}>Foto de los productos</p>
                <p className='image-link' onClick={() => getImage('inspection')}>Foto de la inspección</p>
                <p className='image-link' onClick={() => getImage('profilePic')}>Foto de la persona</p>
                {data.fair && (
                    <>
                        <h4>Participación en Ferias</h4>
                        <p className='image-link' onClick={() => getImage('permits')}>Foto de los permisos</p>
                        <p className='image-link' onClick={() => getImage('memos')}>Foto de los memos</p>
                    </>
                )}
                <p className='image-link' onClick={() => getImage('Other')}>Otros</p>
            </div>
            <div className='container'>
                {actualImage && (
                    <>
                        <div className="edit-header">
                            <FontAwesomeIcon className='edit-icon' icon={faPenToSquare} onClick={() => handleComponentChange('EditImages')}/>
                            <FontAwesomeIcon className='add-icon' icon={faFileCirclePlus} onClick={() => handleComponentChange('AddImage')}/>
                        </div>
                        <div className='image-container'>
                            {actualComponent === 'Image' && (
                                    <img className='img-fluid' src={images[actualImage] ? images[actualImage] : '/noImage.png' } alt='No se encontró imagen para esta categoría. Recargue la página por favor.'></img>
                            )}
                            {actualComponent === 'AddImage' && (
                                <AddFile id={id} role={actualImage}/>
                            )}
                            {actualComponent === 'EditImages' && (
                                <EditImages id={id} role={actualImage}/>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ViewProducer;