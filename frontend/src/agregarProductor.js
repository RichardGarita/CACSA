import React, { useState, useCallback } from 'react';
import {useDropzone} from 'react-dropzone'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './styles/AddProducer.css'

const MAX_STEPS = 4;

const URL_API = 'http://localhost:4223/api/productor/create'; // URL de la ruta de carga del servidor

const AddProducer = () => {
    const {register, handleSubmit, formState: { errors, isValid },  } = useForm({mode: "all"});
    const [fairParticipationChecked, setFairParticipationChecked] = useState(false);
    const [formStep, setFormStep] = useState(0);
    const [droppedFiles, setDroppedFiles] = useState([]);

    const progress = (formStep + 1) / MAX_STEPS * 100; // Calculate progress percentage

    const onDrop = useCallback(acceptedFiles => {
        if(acceptedFiles?.length) {
            setDroppedFiles(previousDroppedFiles => [
                ...previousDroppedFiles,
                ...acceptedFiles.map(file => 
                    Object.assign(file, {preview: URL.createObjectURL(file)})
                )
            ])
        }
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    const completeFormStep = () => {
        setFormStep(cur => cur + 1);
    }

    const returnFormStep = () => {
        setFormStep(cur => cur - 1);
    }

    const removeFile = (fileName) => {
        setDroppedFiles(files => files.filter(file => file.name !== fileName));
    }

    const renderPrevButton = () => {
        if (formStep === 0) {
            return (
                <button type="button" className='btn cancel'>Cancelar</button>
            )
        } else {
            return (
                <button type="button" className='btn cancel' onClick={returnFormStep}>Anterior</button>
            )
        }
    }

    const renderNextButton = () => {
        if (formStep === MAX_STEPS-1) {
            return (
                <button disabled={!isValid} type="submit" className='btn continue'>Finalizar</button>
            )
        } else {
            return (
                <button disabled={!isValid} type="button" className='btn continue' onClick={completeFormStep}>Continuar</button>
            )
        }
    }


    const roles = ['idScreenShot', 'fairPass', 'foodHandling',
                  'profilePic', 'propertyTitle', 'products', 'inspection'];
  
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

    const renderProgressIndicator = () => {
        const progressIndicator = [];
        for (let i = 0; i < MAX_STEPS; i++) {
            progressIndicator.push(
                <div key={i} className={`step ${formStep === i ? 'active' : ''}`}>
                    {i + 1}
                </div>
            );
        }

        return (
            <div className='progress-indicator'>
                {progressIndicator}
            </div>
        );
    };
  
    return (
        <div className='add-producer'>
            {renderProgressIndicator()}
            <div className="progress">
                <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {formStep === 0 && (
                    <section>
                        <h3>Información General</h3>
                        <div className='form-group'>
                            <label htmlFor="name">Nombre de la persona: </label>
                            <input type="text" placeholder="Nombre de la persona" id='name' className='form-control'
                                {...register('name', {required: {value: true, message: 'Por favor escriba el nombre'}})} />
                            {errors.name && <p className='error-text'>{errors.name.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="name">Fecha de expiración del carnet: </label>
                            <input required type="date" className='form-control'
                                {...register('date', {required: {value: true, message: 'Por favor seleccione una fecha'}})} />
                            {errors.date && <p className='error-text'>{errors.date.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="name">Número de cédula: </label>
                            <input type="text" required placeholder="X-XXXX-XXXX" className='form-control'
                                {...register('id', {required: {value: true, message: 'Por favor escriba cédula'}})} />
                            {errors.id && <p className='error-text'>{errors.id.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="idScreenShot" className='form-label'>Foto de la cédula: </label>
                            <input type='file' required name="idScreenShot" className='form-control'
                                {...register('idScreenShot', {required: {value: true, message: 'Por favor seleccione un archivo'}})} />
                            {errors.idScreenShot && <p className='error-text'>{errors.idScreenShot.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="fairPass">Foto del carnet de ferias: </label>
                            <input type="file" required name="fairPass" className='form-control'
                                {...register('fairPass', {required: {value: true, message: 'Por favor seleccione un archivo'}})} />
                            {errors.fairPass && <p className='error-text'>{errors.fairPass.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="foodHandling">Foto del carnet de manipulación de alimentos: </label>
                            <input type="file" required name="foodHandling" className='form-control'
                                {...register('foodHandling', {required: {value: true, message: 'Por favor seleccione un archivo'}})} />
                            {errors.foodHandling && <p className='error-text'>{errors.foodHandling.message}</p>}
                        </div>
                    </section>
                )}

                {formStep === 1 && (
                    <section>
                        <h3>Expedición de Carnets</h3>
                        <div className='form-group'>
                            <label htmlFor="category">Categoría </label>
                            <select required type="select" name='category' className='form-control' {...register('category')}>
                            <option value={"agriculture"}>Agricultura</option>
                            <option value={"smallIndustry"}>Pequeña Industria</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <label htmlFor="profilePic">Foto de la persona: </label>
                            <input type="file" required name="profilePic" className='form-control'
                                {...register('profilePic', {required: {value: true, message: 'Por favor seleccione un archivo'}})} />
                            {errors.profilePic && <p className='error-text'>{errors.profilePic.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="propertyTitle">Foto del título de propiedad, contrato de arrendamiento o plano: </label>
                            <input type="file" required name="propertyTitle" className='form-control'
                                {...register('propertyTitle', {required: {value: true, message: 'Por favor seleccione un archivo'}})} />
                            {errors.propertyTitle && <p className='error-text'>{errors.propertyTitle.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="products">Foto de los productos: </label>
                            <input type="file" required name="products" className='form-control'
                                {...register('products', {required: {value: true, message: 'Por favor seleccione un archivo'}})} />
                            {errors.products && <p className='error-text'>{errors.products.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="inspection">Foto de la inspección: </label>
                            <input type="file" required name="inspection" className='form-control'
                                {...register('inspection', {required: {value: true, message: 'Por favor seleccione un archivo'}})} />
                            {errors.inspection && <p className='error-text'>{errors.inspection.message}</p>}
                        </div>
                    </section>
                )}
                
                {formStep === 2 && (
                    <section>
                        <h3>Participación en ferias</h3>
                    <div className='form-group form-check form-switch'>
                        <label htmlFor='fairParticipation' className='form-check-label'>Participa en ferias</label>
                        <input
                            id='fairParticipation'
                            name='fairParticipation'
                            className='form-check-input'
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
                            <select required type="select" name='fairLocality' className='form-control' {...register('fairLocality')}>
                            <option value={"Santa Ana"}>Santa Ana </option>
                            <option value={"Hatillo"}>Hatillo</option>
                            </select>
                        </div>
                        <div className='form-group'>
                            <label htmlFor="permits">Foto de los permisos: </label>
                            <input type="file" required name="permits" className='form-control'
                                {...register('permits', {required: {value: true, message: 'Por favor seleccione un archivo'}})} />
                            {errors.permits && <p className='error-text'>{errors.permits.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="memos">Foto de los memos: </label>
                            <input type="file" required name="memos" className='form-control'
                                {...register('memos', {required: {value: true, message: 'Por favor seleccione un archivo'}})} />
                            {errors.memos && <p className='error-text'>{errors.memos.message}</p>}
                        </div>
                        </div>
                    }
                    </section>
                )}

                {formStep === 3 && (
                    <section>
                        <h3>Otros Archivos</h3>
                        <div {...getRootProps({className: 'drop-zone'})}>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                            <p>Drop the files here ...</p> :
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        }
                        </div>
                    </section>
                )}

                <div className='button-section'>
                    {renderPrevButton()}
                    {renderNextButton()}
                </div>

                {formStep === 3 && droppedFiles.length >0 && (
                    <div>
                        <h4>Imagenes para enviar</h4>
                        <ul className="list-unstyled row">
                            {droppedFiles.map(file => (
                                <div className="position-relative drop-images" width={25}>
                                    <img src={file.preview} alt='' onLoad={() => {URL.revokeObjectURL(file.preview)}}/>
                                    <span aria-hidden="true" className="position-absolute top-0 end-0" onClick={() => removeFile(file.name)}>&times;</span>
                                </div>
                            ))}
                        </ul>
                    </div>
                )}
            </form>
        </div>
    );
  };

export default AddProducer;
