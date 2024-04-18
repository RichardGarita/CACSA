import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Form from './form';
import Progress from './progress';
import axios from 'axios';
import BASE_URL from '../../utils/apiConfig';
import '../../styles/AddProducer.css'

const MAX_STEPS = 4;

const URL_API = `${BASE_URL}productor`; // URL de la ruta de carga del servidor

const AddProducer = () => {
    const {register, handleSubmit, formState: { errors, isValid },  } = useForm({mode: "all"});
    const [formStep, setFormStep] = useState(0);
    const [fairParticipationChecked, setFairParticipationChecked] = useState(false);
    const [droppedFiles, setDroppedFiles] = useState([]);

    const roles = ['idScreenShot', 'fairPass', 'foodHandling',
                  'profilePic', 'propertyTitle', 'products', 'inspection'];

    const prepareFormData = (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('date', data.date);
        formData.append('id', data.id);
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
          formData.append('fairLocality', data.fairLocality);
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
        await axios.post(URL_API, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
            alert('Imágenes subidas correctamente');
        });
      } catch (error) {
        if (error.response && error.response.status === 402) {
          alert('El productor ya existe');
        } else {
          console.error('Error al enviar el formulario:', error);
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
            />
        </div>
    );
  };

export default AddProducer;
