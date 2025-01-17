import React, {useState, useContext, useEffect} from "react";
import Select from 'react-select';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {useForm} from 'react-hook-form';
import {AuthContext} from '../../../utils/authContext';
import {toast} from 'react-toastify';
import { options } from "../../../utils/localities";
import BASE_URL from "../../../utils/apiConfig";
import "react-toastify/dist/ReactToastify.css";

const URL_API = `${BASE_URL}producer`;

function EditProfile ({props}) {
    const {name, date, fair, id, category, fairLocality} = props;
    const [fairParticipationChecked, setFairParticipationChecked] = useState(fair);
    const [actualFairLocality, setActualFairLocality] = useState([]);
    const {register, handleSubmit, formState: { errors, isValid },  } = useForm({mode: "all"});
    const {token} = useContext(AuthContext);

    const navigate = useNavigate();

    const localities = fairLocality.map(locality => ({
        value: locality,
        label: locality
    }));

    useEffect(() => {
        setActualFairLocality(localities);
    }, [])

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('date', data.date);
        formData.append('category', data.category);
        formData.append('fair', fairParticipationChecked);
        if (fairParticipationChecked){
            const fairLocalityValues = actualFairLocality.map(option => option.value);
            formData.append('fairLocality', fairLocalityValues.join(', '));
        } else {
            formData.append('fairLocality', 'No participa');
        }
        try{
            axios.put(`${URL_API}/${id}`, formData, {
                headers: {
                    'access-token': token,
                    'Content-Type': 'application/json'
                }}).then(() => {
                toast.success('Productor actualizado', {
                    autoClose: 1500,
                    onClose: () => window.location.reload()
                });
            });
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            if (error.response && error.response.status === 401) {
                toast.info('Sesión Expirada', {
                  toastId: 'expiredSession',
                  autoClose: 1500,
                  onClose: () => {
                    localStorage.removeItem('token');
                    navigate('/');
                  }
                })
            } else {
                toast.error('Error inesperado. Intente de nuevo', {autoClose: 1500})
            }
            
        }
    }

    return (
        <>
            <form className="edit-form" onSubmit={handleSubmit(onSubmit)}>
                <div className='form-group'>
                    <label htmlFor="name">Nombre de la persona<small className="text-danger">*</small></label>
                    <input type="text" placeholder="Nombre de la persona" id='name' className='form-control' autoComplete="name"
                        defaultValue={name} {...register('name', {required: {value: true, message: 'Por favor escriba el nombre'}})} />
                    {errors.name && <p className='error-text'>{errors.name.message}</p>}
                </div>
                <div className='form-group'>
                    <label htmlFor="date">Fecha de expiración del carnet<small className="text-danger">*</small></label>
                    <input type="date" className='form-control' id="date"
                        defaultValue={date} {...register('date', {required: {value: true, message: 'Por favor seleccione una fecha'}})} />
                    {errors.date && <p className='error-text'>{errors.date.message}</p>}
                </div>
                <div className='form-group'>
                    <label htmlFor="category">Categoría<small className="text-danger">*</small></label>
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
                        <label htmlFor="fairLocality">Localidad de la feria<small className="text-danger">*</small></label>
                        <Select options={options} closeMenuOnSelect={false} id="fairLocality"
                            isMulti defaultValue={localities}
                            onChange={(selected) => setActualFairLocality(selected)}/>
                    </div>
                }
                <button disabled={!isValid || !(fairParticipationChecked ? (actualFairLocality.length > 0) : true)} type="submit" className='btn'>Enviar</button>
            </form>
        </>
    )
} 

export default EditProfile;