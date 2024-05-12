import React, {useState, useContext, useEffect} from "react";
import Select from 'react-select';
import axios from "axios";
import {useForm} from 'react-hook-form';
import {AuthContext} from '../../../utils/authContext';
import {ToastContainer, toast} from 'react-toastify';
import BASE_URL from "../../../utils/apiConfig";
import "react-toastify/dist/ReactToastify.css";

const URL_API = `${BASE_URL}producer`;

function EditProfile ({props}) {
    const {name, date, fair, id, category, fairLocality} = props;
    const [fairParticipationChecked, setFairParticipationChecked] = useState(fair);
    const [actualFairLocality, setActualFairLocality] = useState([]);
    const {register, handleSubmit, formState: { errors, isValid },  } = useForm({mode: "all"});
    const {token} = useContext(AuthContext);

    const localities = fairLocality.map(locality => ({
        value: locality,
        label: locality
    }));

    useEffect(() => {
        setActualFairLocality(localities);
    }, [])

    const selectOptions = [
        {value: 'Santa Ana', label: 'Santa Ana'},
        {value: 'Hatillo', label: 'Hatillo'},
        {value: 'Zarcero', label: 'Zarcero'},
    ]

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('date', data.date);
        formData.append('category', data.category);
        formData.append('fair', fairParticipationChecked);
        if (fairParticipationChecked){
            const fairLocalityValues = actualFairLocality.map(option => option.value);
            formData.append('fairLocality', fairLocalityValues.join(' - '));
        }
        try{
            axios.put(`${URL_API}/${id}`, formData, {
                headers: {
                    'access-token': token,
                    'Content-Type': 'application/json'
                }}).then(() => {
                toast.success('Productor actualizado', {
                    autoClose: 2000,
                    onClose: () => window.location.reload()
                });
            });
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        }
    }

    return (
        <>
            <ToastContainer/>
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
                        defaultValue={category ? category : ""}
                        {...register('category', {required: {value: true, message: 'Por favor seleccione una opción'}})}>
                        <option value={"Agricultura"}>Agricultura</option>
                        <option value={"Pequeña Industria"}>Pequeña Industria</option>
                        <option value={"AgroIndustria"}>AgroIndustria</option>
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
                        onClick={(e) => {setFairParticipationChecked(!fairParticipationChecked);}}
                        {...register('fairParticipation')}
                    />
                </div>
                {fairParticipationChecked &&
                    <div className='form-group'>
                        <label htmlFor="fairLocality">Localidad de la feria </label>
                        <Select options={selectOptions} closeMenuOnSelect={false} 
                            isMulti defaultValue={localities}
                            onChange={(selected) => setActualFairLocality(selected)}/>
                    </div>
                }
                <button disabled={!isValid || !(actualFairLocality.length > 0)} type="submit" className='btn'>Enviar</button>
            </form>
        </>
    )
} 

export default EditProfile;