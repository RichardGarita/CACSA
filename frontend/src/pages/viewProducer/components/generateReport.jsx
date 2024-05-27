import { useState, useContext, useEffect } from "react";
import {jsPDF} from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from '../../../utils/authContext';
import axios from "axios";
import BASE_URL from '../../../utils/apiConfig';
const URL_API = `${BASE_URL}producer`;
const URL_IMAGES = `${URL_API}/images/latest`;

export default function GenerateReport({data, producerId}) {

    const {token} = useContext(AuthContext);
    const navigate = useNavigate();

    const [images, setImages] = useState({});

    const roles = ['idScreenShot', 'foodHandling', 'fairPass', 'propertyTitle', 'products', 'inspection',
        'profilePic', 'permits', 'memos', 'Other'
    ];

    const getImages = async () => {
        if (producerId) {
            for (let role of roles) {
                await axios.get(`${URL_IMAGES}/${producerId}?role=${role}`, {
                    headers: {
                        'access-token': token,
                    }
                }).then(() => {
                    setImages(prevImages => {
                        return {...prevImages, [role]: true};
                    })
                }).catch(error => {
                    console.error(error);
                    if(error.response && error.response.status === 401) {
                        toast.info('Sesión Expirada', {
                            toastId: 'expiredSession',
                            autoClose: 1500,
                            onClose: () => {
                                localStorage.removeItem('token');
                                navigate('/');
                            }
                        });
                    } else {
                        toast.error('Algo salió mal. Por favor intente de nuevo', {
                            autoClose: 1500,
                        })
                    }
                })
            }
        }
    }

    useEffect(() => {
        getImages();
    }, [producerId])
    

    const genDoc = async () => {


        const doc = new jsPDF();
        doc.text(`Productor: ${data.name}`, 10, 10);
        doc.text(`Cédula: ${data.identification}`, 10, 20);
        doc.text(`Expiración del carnet: ${data.date}`, 10, 30);
        doc.text(`Categoría: ${data.category}`, 10, 40);
        doc.text(`Permiso de feria: ${data.fair ? 'Sí' : 'No'}`, 10, 50);
        if (data.fair) {
            doc.text(`Localidad: ${data.fairLocality}`, 10, 60);
        }

        doc.text(`Registro de documentos`, 10, 70);
        doc.text(`Cédula: ${images.idScreenShot ? 'Sí' : 'No'}`, 10, 80);
        doc.text(`Carnet de manipulación de alimentos: ${images.foodHandling ? 'Sí' : 'No'}`, 10, 90);
        doc.text(`Carnet de ferias: ${images.fairPass ? 'Sí' : 'No'}`, 10, 100);
        doc.text(`Título de propiedad: ${images.propertyTitle ? 'Sí' : 'No'}`, 10, 110);
        doc.text(`Productos: ${images.products ? 'Sí' : 'No'}`, 10, 120);
        doc.text(`Inspección: ${images.inspection ? 'Sí' : 'No'}`, 10, 130);
        doc.text(`Foto de la persona: ${images.profilePic ? 'Sí' : 'No'}`, 10, 140);
        doc.text(`Permisos: ${images.permits ? 'Sí' : 'No'}`, 10, 150);
        doc.text(`Memos: ${images.memos ? 'Sí' : 'No'}`, 10, 160);
        doc.text(`Otros: ${images.Other ? 'Sí' : 'No'}`, 10, 170);

        doc.save(`Reporte_${data.name}.pdf`);
    }


    return (
        <>
            <FontAwesomeIcon icon={faFilePdf} className="gen-report-icon" onClick={() => genDoc()}/>
        </>
    )
}