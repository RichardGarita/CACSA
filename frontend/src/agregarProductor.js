import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const URL_API = 'http://localhost:4223/api/productor/create'; // URL de la ruta de carga del servidor

const AddProducer = () => {
    const { register, handleSubmit } = useForm();
    const [fairParticipationChecked, setFairParticipationChecked] = useState(false);


    const roles = ['idScreenShot', 'fairPass', 'foodHandling',
                  'profilePic', 'propertyTitle', 'products', 'inspection'];

    const handleCheckboxChange = () => {
        setFairParticipationChecked(!fairParticipationChecked);
    };
  
    const onSubmit = async (data) => {
      try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('date', data.date);
        formData.append('id', data.id);
        formData.append('images', data.idScreenShot[0]);
        formData.append('images', data.fairPass[0]);
        formData.append('images', data.foodHandling[0]);

        formData.append('images', data.profilePic[0]);
        formData.append('images', data.propertyTitle[0]);
        formData.append('images', data.products[0]);
        formData.append('images', data.inspection[0]);

        if (fairParticipationChecked) {
          roles.push('permits', 'memos');
          formData.append('images', data.permits[0]);
          formData.append('images', data.memos[0]);
        }

        formData.append('roles', JSON.stringify(roles));
  
        const response = await axios.post(URL_API, formData, {
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <h3>Información General</h3>
          <div className='form-group'>
            <label htmlFor="name">Nombre de la persona </label>
            <input required type="text" placeholder="Nombre" name='name' {...register('name')} />
          </div>
          <div className='form-group'>
            <input required type="date" placeholder="Fecha" {...register('date')} />
          </div>
          <div className='form-group'>
            <input type="text" required placeholder="ID" {...register('id')} />
          </div>
          <div className='form-group'>
            <label htmlFor="idScreenShot">Foto de la cédula: </label>
            <input type='file' required name="idScreenShot" {...register('idScreenShot')}/>
          </div>
          <div className='form-group'>
            <label htmlFor="fairPass">Foto del carnet de ferias: </label>
            <input type="file" required name="fairPass" {...register('fairPass')} />
          </div>
          <div className='form-group'>
            <label htmlFor="foodHandling">Foto del carnet de manipulación de alimentos: </label>
            <input type="file" required name="foodHandling" {...register('foodHandling')} />
          </div>
        </div>

        <div>
        <h3>Expedición de Carnets</h3>
          <div className='form-group'>
            <label htmlFor="category">Categoría </label>
            <select required type="select" name='category' {...register('category')}>
              <option value={"agriculture"}>Agricultura</option>
              <option value={"smallIndustry"}>Pequeña Industria</option>
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor="profilePic">Foto de la persona: </label>
            <input type="file" required name="profilePic" {...register('profilePic')} />
          </div>
          <div className='form-group'>
            <label htmlFor="propertyTitle">Foto del título de propiedad, contrato de arrendamiento o plano: </label>
            <input type="file" required name="propertyTitle" {...register('propertyTitle')} />
          </div>
          <div className='form-group'>
            <label htmlFor="products">Foto de los productos: </label>
            <input type="file" required name="products" {...register('products')} />
          </div>
          <div className='form-group'>
            <label htmlFor="inspection">Foto de la inspección: </label>
            <input type="file" required name="inspection" {...register('inspection')} />
          </div>
        </div>
        
        <div>
        <h3>Participación en ferias</h3>
          <div className='form-group'>
              <label htmlFor='fairParticipation'>Participa en ferias</label>
              <input
                  id='fairParticipation'
                  name='fairParticipation'
                  type="checkbox"
                  checked={fairParticipationChecked}
                  onClick={(e) => {setFairParticipationChecked(e.target.checked);}}
                  {...register('fairParticipation')}
              />
          </div>
          {fairParticipationChecked &&
            <div>
              <div className='form-group'>
                <label htmlFor="fairLocality">Localidad de la feria </label>
                <select required type="select" name='fairLocality' {...register('fairLocality')}>
                  <option value={"Santa Ana"}>Santa Ana </option>
                  <option value={"Hatillo"}>Hatillo</option>
                </select>
              </div>
              <div className='form-group'>
                <label htmlFor="permits">Foto de los permisos: </label>
                <input type="file" required name="permits" {...register('permits')} />
              </div>
              <div className='form-group'>
                <label htmlFor="memos">Foto de los memos: </label>
                <input type="file" required name="memos" {...register('memos')} />
              </div>
            </div>
          }
          
        </div>
        
        <button type="submit">Enviar</button>
      </form>
    );
  };

export default AddProducer;
