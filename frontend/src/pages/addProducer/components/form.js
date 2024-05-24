import React, {useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import DropZone from "../../../utils/dropZone";
import ButtonsSection from "./buttonsSection";
import Modal from "../../../utils/modal";
import { options } from "../../../utils/localities";

function Form({ onSubmit, formStep, setFormStep, register, errors, fairParticipationChecked, 
            setFairParticipationChecked, setDroppedFiles, droppedFiles, MAX_STEPS, isValid, actualFairLocality, setActualFairLocality }) {
    
    const removeFile = (index) => {
        setDroppedFiles(files => files.filter((_, fileIndex) => fileIndex !== index));
    }

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(<></>);

    return (
        <form onSubmit={onSubmit}>
                {formStep === 0 && (
                    <section>
                        <h3>Información General</h3>
                        <div className='form-group'>
                            <label htmlFor="name">Nombre de la persona: </label>
                            <input type="text" placeholder="Nombre de la persona" id='name' className='form-control' autoComplete="name"
                                {...register('name', {required: {value: true, message: 'Por favor escriba el nombre'}})} />
                            {errors.name && <p className='error-text'>{errors.name.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="date">Fecha de expiración del carnet: </label>
                            <input type="date" className='form-control' id="date"
                                {...register('date', {required: {value: true, message: 'Por favor seleccione una fecha'}})} />
                            {errors.date && <p className='error-text'>{errors.date.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="identification">Número de cédula: </label>
                            <input type="text" placeholder="X-XXXX-XXXX" className='form-control' id="identification"
                                {...register('identification', {required: {value: true, message: 'Por favor escriba cédula'},
                                pattern: {
                                    value: /^\d-\d{4}-\d{4}$/,
                                    message: "La cédula debe poseer 9 dígitos, incluya guiones y ceros"
                                }})} />
                            {errors.identification && <p className='error-text'>{errors.identification.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="idScreenShot" className='form-label'>Foto de la cédula: </label>
                            <input type='file' id="idScreenShot" className='form-control'
                                accept="image/*" {...register('idScreenShot', {required: {value: true, message: 'Por favor seleccione un archivo'}})} />
                            {errors.idScreenShot && <p className='error-text'>{errors.idScreenShot.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="fairPass">Foto del carnet de ferias: </label>
                            <input type="file" id="fairPass" className='form-control'
                                accept="image/*" {...register('fairPass', {required: {value: true, message: 'Por favor seleccione un archivo'}})} />
                            {errors.fairPass && <p className='error-text'>{errors.fairPass.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="foodHandling">Foto del carnet de manipulación de alimentos: </label>
                            <input type="file" id="foodHandling" className='form-control'
                                accept="image/*" {...register('foodHandling', {required: {value: true, message: 'Por favor seleccione un archivo'}})} />
                            {errors.foodHandling && <p className='error-text'>{errors.foodHandling.message}</p>}
                        </div>
                    </section>
                )}

                {formStep === 1 && (
                    <section>
                        <h3>Expedición de Carnets</h3>
                        <div className='form-group'>
                            <label htmlFor="category">Categoría </label>
                            <select type="select" id='category' className='form-control'
                                {...register('category', {required: {value: true, message: 'Por favor seleccione una opción'}})}>
                                <option value={"Agricultura"}>Agricultura</option>
                                <option value={"Pequeña Industria"}>Pequeña Industria</option>
                                <option value={"AgroIndustria"}>AgroIndustria</option>
                            </select>
                            {errors.category && <p className='error-text'>{errors.category.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="profilePic">Foto de la persona: </label>
                            <input type="file" id="profilePic" className='form-control'
                                accept="image/*" {...register('profilePic', {required: {value: true, message: 'Por favor seleccione un archivo'}})} />
                            {errors.profilePic && <p className='error-text'>{errors.profilePic.message}</p>}
                        </div>
                        <div className='form-group'>
                            <label htmlFor="propertyTitle">Foto del título de propiedad, contrato de arrendamiento o plano: </label>
                            <input type="file" id="propertyTitle" className='form-control'
                                accept="image/*" {...register('propertyTitle')} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="products">Foto de los productos: </label>
                            <input type="file" id="products" className='form-control'
                                accept="image/*" {...register('products')} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="inspection">Foto de la inspección: </label>
                            <input type="file" id="inspection" className='form-control'
                                accept="image/*" {...register('inspection')} />
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
                            <Select options={options} closeMenuOnSelect={false} id="fairLocality"
                                isMulti onChange={(selected) => setActualFairLocality(selected)}/>
                        </div>
                        <div className='form-group'>
                            <label htmlFor="permits">Foto de los permisos: </label>
                            <input type="file" id="permits" className='form-control'
                                accept="image/*" {...register('permits')} />
                        </div>
                        <div className='form-group'>
                            <label htmlFor="memos">Foto de los memos: </label>
                            <input type="file" id="memos" className='form-control'
                                accept="image/*" {...register('memos')} />
                        </div>
                        </div>
                    }
                    </section>
                )}

                {formStep === 3 && (
                    <section>
                        <h3>Otros Archivos</h3>
                        <DropZone setDroppedFiles={setDroppedFiles}/>
                    </section>
                )}

                <ButtonsSection
                    MAX_STEPS={MAX_STEPS}
                    formStep={formStep} 
                    setFormStep={setFormStep} 
                    setDroppedFiles={setDroppedFiles} 
                    isValid={isValid}
                    fairParticipationChecked={fairParticipationChecked}
                    actualFairLocality={actualFairLocality}
                    setActualFairLocality={setActualFairLocality}
                />

                {formStep === 3 && droppedFiles.length >0 && (
                    <div className="row dropped-images" >
                        <Modal
                            showModal={showModal}
                            setShowModal={setShowModal}
                            content={modalContent}
                            size={"xl"}
                        />
                        <h4>Imagenes para enviar</h4>
                            {droppedFiles.map((file, index) => (
                                <div key={index} className="col-4">
                                    <div className="card added-image">
                                        <img src={file.preview} alt='' className="card-img"
                                        onClick={() => {
                                            setShowModal(true)
                                            setModalContent(<img src={file.preview} alt='' className="card-img"/>)
                                        }}/>
                                        <FontAwesomeIcon icon={faCircleXmark} aria-hidden="true" className="position-absolute top-0 end-0 remove-icon" onClick={() => removeFile(index)}/>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </form>
    )
}

export default Form;