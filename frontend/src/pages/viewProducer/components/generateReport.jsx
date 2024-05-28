import { useState, useContext, useEffect } from "react";
import {jsPDF} from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from '../../../utils/authContext';
import {convertToLocaleDateTime} from '../../../utils/dateConverter';
import axios from "axios";
import BASE_URL from '../../../utils/apiConfig';

const URL_API = `${BASE_URL}producer`;

export default function GenerateReport({data, producerId}) {

    const {token} = useContext(AuthContext);
    const navigate = useNavigate();

    const [images, setImages] = useState({});

    const roles = ['idScreenShot', 'foodHandling', 'fairPass', 'propertyTitle', 'products', 'inspection',
        'profilePic', 'permits', 'memos', 'Other'
    ];

    const getImages = async () => {
        await axios.get(`${URL_API}/${producerId}/report`, {
            headers: {
                'access-token': token,
            }
        }).then((response) => {
            setImages(response.data);
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

    useEffect(() => {
        if (producerId)
            getImages();
    }, [producerId])
    

    const genDoc = async () => {

        const doc = new jsPDF();

        // Header
        doc.setFillColor(83, 116, 177); // Azul
        doc.rect(0, 0, 210, 40, 'F'); // Dibuja un rectángulo lleno
        doc.setTextColor(255, 255, 255); // Blanco
        doc.setFontSize(18);
        doc.text('Reporte de Productor', 105, 20, null, null, 'center');
        doc.setFontSize(12);
        doc.text('Centro Agrícola Cantonal de Santa Ana', 105, 30, null, null, 'center');

        // Información del productor
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text('Información Personal', 10, 50);
        doc.setFont("helvetica", "normal");
        doc.text(`Productor: ${data.name}`, 10, 60);
        doc.text(`Cédula: ${data.identification}`, 10, 70);
        doc.text(`Expiración del carnet: ${data.date}`, 10, 80);
        doc.text(`Categoría: ${data.category}`, 10, 90);
        doc.text(`Permiso de feria: ${data.fair ? 'Sí' : 'No'}`, 10, 100);
        if (data.fair) {
            doc.text(`Localidad: ${data.fairLocality}`, 10, 110);
        }

        // Registro de documentos
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text('Registro de documentos', 10, 130);
        doc.setFont("helvetica", "normal");
        const docEntries = [
            { label: 'Cédula', value: images.idScreenShot },
            { label: 'Carnet de manipulación de alimentos', value: images.foodHandling },
            { label: 'Carnet de ferias', value: images.fairPass },
            { label: 'Título de propiedad', value: images.propertyTitle },
            { label: 'Productos', value: images.products },
            { label: 'Inspección', value: images.inspection },
            { label: 'Foto de la persona', value: images.profilePic },
            { label: 'Permisos', value: images.permits },
            { label: 'Memos', value: images.memos },
            { label: 'Otros', value: images.Other }
        ];
        
        doc.setFontSize(12);
        let y = 140;
        docEntries.forEach(entry => {
            doc.text(`${entry.label}: ${entry.value ? 'Sí' : 'No'}`, 10, y);
            y += 10;
        });

        // Footer
        doc.setFillColor(83, 116, 177); // Azul
        doc.rect(0, 280, 210, 20, 'F');
        doc.setTextColor(255, 255, 255); // Blanco
        doc.setFontSize(10);
        doc.text(`${convertToLocaleDateTime(new Date())}`, 105, 290, null, null, 'center');

        doc.save(`Reporte_${data.name}.pdf`);
    };


    return (
        <>
            <FontAwesomeIcon icon={faFilePdf} className="gen-report-icon" onClick={() => genDoc()}/>
        </>
    )
}