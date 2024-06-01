import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import {toast} from 'react-toastify';
import { AuthContext } from "../../../utils/authContext";
import axios from "axios";
import BASE_URL from "../../../utils/apiConfig";
import Modal from "../../../utils/modal";

const URL_API = `${BASE_URL}user/recover`;

export default function RecoverPassword({user}){
    const [showModal, setShowModal] = useState(false);

    const {token} = useContext(AuthContext);

    const setRecoverRequest = async () => {
        await axios.put(URL_API, {id: user.id}, {
            headers: {
                'access-token': token,
            }
        }).then(() => {
            toast.success('Contraseña reestablecida', {
                autoClose: 1500
            })
        }).catch((error) => {
            if (error.response && error.response.status === 401) {
                toast.info('Sesión Expirada', {
                    toastId: 'expiredSession',
                    autoClose: 1500,
                    onClose: () => {
                        localStorage.removeItem('token');
                        window.location.reload();
                    }
                });
            } else {
                toast.error('Error inesperado, intente de nuevo más tarde', {
                    autoClose: 1500
                })
                console.error(error);
            }
        })
    }

    return (
        <>
            <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                titulo={'Recuperar contraseña'}
                content={<>
                    <div>
                        <p>Si selecciona confirmar, la contraseña del usuario asociado al correo <strong>{user.email}</strong> será reestablecida a una contraseña temporal</p>
                        <strong>¿Está seguro de continuar?</strong>
                    </div>
                    <div>
                        <button onClick={() => setRecoverRequest()} className="btn edit-button">Confirmar</button>
                    </div>
                </>}
            />
            <FontAwesomeIcon onClick={() => setShowModal(!showModal)} className="edit-icon ms-1" icon={faUnlockKeyhole}/>
        </>
    )
}