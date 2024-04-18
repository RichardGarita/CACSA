import React, {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPen, faFileCirclePlus, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import EditProfile from './editProfile';
import AddFile from './addFile';
import EditImages from './editImages';
import { AuthContext } from '../../utils/authContext';
import BASE_URL from '../../utils/apiConfig';
import '../../styles/ViewProducer.css';

const URL_API = `${BASE_URL}productor`;
const URL_IMAGES = `${BASE_URL}productor/images/latest`;

function ViewProducer () {

    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState({});
    const [images, setImages] = useState({});
    const [actualImage, setActualImage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editProps, setEditProps] = useState({});
    const [actualComponent, setActualComponent] = useState('Image');

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
                id, fair: response.data.fair, category: response.data.category, fairLocality: response.data.fairLocality});
        }).catch((error) => {
            if(error.response && error.response.status === 401) {
                alert('Token Invalido');
                localStorage.removeItem('token');
                navigate('/')
            } else {
                console.error(error);
                alert('Algo salió mal. Intente de nuevo');
            }
        })
    }, []);

    const getImage = async (role) => {
        if (!images[role]) {
            await axios.get(`${URL_IMAGES}/${id}?role=${role}`).then(response => {
                setImages(prevImages => {
                    return {...prevImages, [role]: response.data.url};
                })
            }).catch(error => {
                console.error(error);
            })
        }
        setActualImage(role);
    }

    return (
        <div className='view-producer'>
            <div className='left-menu'>
                <div className='edit-profile'>
                    <h2>Productor</h2>
                    <FontAwesomeIcon className='edit-icon' icon={faUserPen} onClick={() => setIsEditing(!isEditing)}/>
                </div>
                {!isEditing ? (
                    <>
                        <div className='profile-data'>
                            <p>Nombre de la persona:</p>
                            <p>{data.name}</p>
                        </div>
                        <div className='profile-data'>
                            <p>Cédula:</p>
                            <p>{data.id}</p>
                        </div>
                        <div className='profile-data'>
                            <p>Fecha de expiración del carnet:</p>
                            <p>{data.date}</p>
                        </div>
                        <div className='profile-data'>
                            <p>Categoría:</p>
                            <p>{data.category === 'smallIndustry' ? 'Pequeña Industria' : data.category === 'agriculture' ? 'Agricultura' : ''}</p>
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
                    </>
                ) : (
                    <EditProfile props={editProps}/>
                )}
                <h2>Imágenes Generales</h2>
                <p className='image-link' onClick={() => getImage('idScreenShot')}>Cédula</p>
                <p className='image-link' onClick={() => getImage('foodHandling')}>Carnet de manipulación de alimentos</p>
                <p className='image-link' onClick={() => getImage('fairPass')}>Carnet de ferias</p>
                <h2>Carnet de Ferias</h2>
                <p className='image-link' onClick={() => getImage('propertyTitle')}>Contrato de arrendamiento/titulo de propiedad</p>
                <p className='image-link' onClick={() => getImage('products')}>Foto de los productos</p>
                <p className='image-link' onClick={() => getImage('inspection')}>Foto de la inspección</p>
                <p className='image-link' onClick={() => getImage('profilePic')}>Foto de la persona</p>
                {data.fair && (
                    <>
                        <h2>Participación en Ferias</h2>
                        <p className='image-link' onClick={() => getImage('permits')}>Foto de los permisos</p>
                        <p className='image-link' onClick={() => getImage('memos')}>Foto de los memos</p>
                    </>
                )}
            </div>
            <div className='container'>
                {images[actualImage] && (
                    <>
                        <div className="edit-header">
                            <FontAwesomeIcon className='edit-icon' icon={faPenToSquare} onClick={() => handleComponentChange('EditImages')}/>
                            <FontAwesomeIcon className='add-icon' icon={faFileCirclePlus} onClick={() => handleComponentChange('AddImage')}/>
                        </div>
                        <div className='image-container'>
                            {actualComponent === 'Image' && (
                                    <img className='img-fluid' src={images[actualImage]} alt='No se encontró imagen'></img>
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