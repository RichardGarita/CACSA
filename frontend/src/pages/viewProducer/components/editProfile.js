import React, {useState, useContext} from "react";
import axios from "axios";
import {useForm} from 'react-hook-form';
import {AuthContext} from '../../../utils/authContext';
import BASE_URL from "../../../utils/apiConfig";

const URL_API = `${BASE_URL}producer`;

function EditProfile ({props}) {
    const {name, date, fair, id, category, fairLocality} = props;
    const [fairParticipationChecked, setFairParticipationChecked] = useState(fair);
    const {register, handleSubmit, formState: { errors },  } = useForm({mode: "all"});
    const {token} = useContext(AuthContext);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('date', data.date);
        formData.append('fair', fairParticipationChecked);
        try{
            axios.put(`${URL_API}/${id}`, formData, {
                headers: {
                    'access-token': token,
                    'Content-Type': 'application/json'
                }}).then(() => {
                alert('Formulario actualizado');
            });
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
    }

    return (
        <>
            <form className="edit-form" onSubmit={handleSubmit(onSubmit)}>
                <div className='form-group'>
                    <label htmlFor="name">Nombre de la persona: </label>
                    <input type="text" placeholder="Nombre de la persona" id='name' className='form-control' autoComplete="name"
                        defaultValue={name} {...register('name', {required: {value: true, message: 'Por favor escriba el nombre'}})} />
                    {errors.name && <p className='error-text'>{errors.name.message}</p>}
                </div>
                <div className='form-group'>
                    <label htmlFor="date">Fecha de expiración del carnet: </label>
                    <input type="date" className='form-control' id="date"
                        defaultValue={date} {...register('date', {required: {value: true, message: 'Por favor seleccione una fecha'}})} />
                    {errors.date && <p className='error-text'>{errors.date.message}</p>}
                </div>
                <div className='form-group'>
                    <label htmlFor="category">Categoría </label>
                    <select type="select" id='category' className='form-control'
                        defaultValue={category === "agriculture" ? "agriculture" : category === "smallIndustry" ?
                        "smallIndustry" : "Nulo"}
                        {...register('category', {required: {value: true, message: 'Por favor seleccione una opción'}})}>
                        <option value={"agriculture"}>Agricultura</option>
                        <option value={"smallIndustry"}>Pequeña Industria</option>
                    </select>
                    {errors.category && <p className='error-text'>{errors.category.message}</p>}
                </div>
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
                    <div className='form-group'>
                        <label htmlFor="fairLocality">Localidad de la feria </label>
                        <select required defaultValue={fairLocality === "Hatillo" ?
                            "Hatillo" : fairLocality === "Santa Ana" ?
                            "Santa Ana" : "Nulo"} type="select" id='fairLocality' 
                            className='form-control' {...register('fairLocality')}>
                            <option value={"Santa Ana"}>Santa Ana </option>
                            <option value={"Hatillo"}>Hatillo</option>
                        </select>
                    </div>
                }
                <button type="submit" className='btn'>Enviar</button>
            </form>
        </>
    )
} 

export default EditProfile;