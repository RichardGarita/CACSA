import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const URL_API = 'http://localhost:4223/api/productor/create'; // URL de la ruta de carga del servidor

const AddProducer = () => {
    const { register, handleSubmit } = useForm();
  
    const onSubmit = async (data) => {
      try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('date', data.date);
        formData.append('id', data.id);
        formData.append('images', data.idScreenShot[0]);
        formData.append('images', data.fairPass[0]);
  
        const response = await axios.post(URL_API, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        console.log('Respuesta del backend:', response.data);
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
      }
    };
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Nombre de la persona </label>
        <input type="text" placeholder="Nombre" name='name' {...register('name')} />
        <input type="date" placeholder="Fecha" {...register('date')} />
        <input type="text" required placeholder="ID" {...register('id')} />
        <label htmlFor="idScreenShot">Foto de la persona: </label>
        <input type='file' required name="idScreenShot" {...register('idScreenShot')}/>
        <label htmlFor="fairPass">Foto del carné: </label>
        <input type="file" required name="fairPass" {...register('fairPass')} />
        <button type="submit">Enviar</button>
      </form>
    );
  };

export default AddProducer;
