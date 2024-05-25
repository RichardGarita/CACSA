import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../utils/authContext';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import Form from './components/form';
import Progress from './components/progress';
import axios from 'axios';
import BASE_URL from '../../utils/apiConfig';
import "react-toastify/dist/ReactToastify.css";
import '../../styles/AddProducer.css';

const MAX_STEPS = 4;

const URL_API = `${BASE_URL}producer`; // URL de la ruta de carga del servidor

const AddProducer = () => {
    const {register, handleSubmit, formState: { errors, isValid },  } = useForm({mode: "all"});
    const [formStep, setFormStep] = useState(0);
    const [fairParticipationChecked, setFairParticipationChecked] = useState(false);
    const [droppedFiles, setDroppedFiles] = useState([]);
    const [actualFairLocality, setActualFairLocality] = useState([]);

    const {token} = useContext(AuthContext);
    const navigate = useNavigate();

    const roles = ['idScreenShot', 'fairPass', 'foodHandling',
                  'profilePic', 'propertyTitle', 'products', 'inspection'];

    const prepareFormData = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('date', data.date);
        formData.append('identification', data.identification);
        formData.append('category', data.category);
        
        for (const role of roles) {
            if (data[role]) {
              formData.append('images', data[role][0]);
            }
        }

        if (fairParticipationChecked) {
          roles.push('permits', 'memos');
          formData.append('images', data.permits[0]);
          formData.append('images', data.memos[0]);
          const fairLocalityValues = actualFairLocality.map(option => option.value);
            formData.append('fairLocality', fairLocalityValues.join(', '));
        } else {
          formData.append('fairLocality', 'No participa');
        }

        formData.append('fair', fairParticipationChecked);
        formData.append('roles', JSON.stringify(roles));

        for (const file of droppedFiles) {
            formData.append('images', file);
        }

        return formData;
    }
  
    const onSubmit = async (data) => {
      const formData = prepareFormData(data);

      try {
        toast.info('Agregando. Espera por favor', {
          autoClose: 3000,
        })
        await axios.post(URL_API, formData, {
          headers: {
            'access-token': token,
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
            toast.success('Productor creado correctamente', {
              autoClose: 1500,
              onClose: () => {
                navigate('/');
              }
            });
        });
      } catch (error) {
        if (error.response && error.response.status === 402) {
          toast.warning('El productor ya existe', {
            autoClose: 1500,
          });
        } else if (error.response && error.response.status === 401) {
          toast.info('Sesión Expirada', {
            toastId: 'expiredSession',
            autoClose: 1500,
            onClose: () => {
              navigate('/');
            }
          });
        } else {
          console.error('Error al enviar el formulario:', error);
          toast.error('Error inesperado. Intente de nuevo más tarde', {
            autoClose: 1500,
          });
        }
      }
    };
  
    return (
        <div className='add-producer'>
            <Progress
                formStep={formStep}
                MAX_STEPS={MAX_STEPS}
            />
            <Form
                onSubmit={handleSubmit(onSubmit)}
                formStep={formStep}
                setFormStep={setFormStep} 
                register={register}
                errors={errors}
                fairParticipationChecked={fairParticipationChecked}
                setFairParticipationChecked={setFairParticipationChecked}
                setDroppedFiles={setDroppedFiles}
                droppedFiles={droppedFiles}
                MAX_STEPS={MAX_STEPS}
                isValid={isValid}
                actualFairLocality={actualFairLocality}
                setActualFairLocality={setActualFairLocality}
            />
        </div>
    );
  };

export default AddProducer;
