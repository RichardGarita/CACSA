import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPen } from '@fortawesome/free-solid-svg-icons'
import EditProfile from './editProfile';
import AddFile from './addFile';
import '../../styles/ViewProducer.css';

const URL_API = 'http://localhost:4223/api/productor/getOne';
const URL_IMAGES = 'http://localhost:4223/api/productor/getOneProducerImage';

const id = '12345';

function ViewProducer () {

    const [data, setData] = useState({});
    const [images, setImages] = useState({});
    const [actualImage, setActualImage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editProps, setEditProps] = useState({});
    const [actualComponent, setActualComponent] = useState('Image');

    const handleComponentChange = (component) => {
        if (actualComponent === component)
            setActualComponent('Image');
        else
            setActualComponent(component);
    }

    useEffect(() => {
        axios.get(`${URL_API}?id=${id}`).then((response) => {
            setData(response.data);
            setEditProps({name: response.data.name, date: response.data.date, 
                id, fair: response.data.fair, category: response.data.category, fairLocality: response.data.fairLocality});
        }).catch((error) => {
            console.error(error);
        })
    }, []);

    const getImage = async (role) => {
        if (!images[role]) {
            await axios.get(`${URL_IMAGES}?id=${id}&role=${role}`).then(response => {
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
                            <button>Editar</button>
                            <button onClick={() => handleComponentChange('AddImage')}>Agregar</button>
                        </div>
                        <div className='image-container'>
                            {actualComponent === 'Image' && (
                                    <img className='img-fluid' src={images[actualImage]} alt='No se encontró imagen'></img>
                            )}
                            {actualComponent === 'AddImage' && (
                                <AddFile id={id} role={actualImage}/>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default ViewProducer;