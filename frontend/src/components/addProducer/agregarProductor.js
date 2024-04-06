import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Form from './form';
import Progress from './progress';
import axios from 'axios';
import '../../styles/AddProducer.css'

const MAX_STEPS = 4;

const URL_API = 'http://localhost:4223/api/productor/create'; // URL de la ruta de carga del servidor

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
        
        for (const role of roles) {
            if (data[role]) {
              formData.append('images', data[role][0]);
            }
        }

        if (fairParticipationChecked) {
          roles.push('permits', 'memos');
          formData.append('fair', true);
          formData.append('images', data.permits[0]);
          formData.append('images', data.memos[0]);
        }

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
        }).then((response) => {
          console.log('Respuesta del servidor: ', response.data.imageUrls);
        });
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
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
