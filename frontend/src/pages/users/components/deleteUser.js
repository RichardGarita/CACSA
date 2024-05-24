import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../utils/authContext";
import { useNavigate } from "react-router-dom";
import { toast} from 'react-toastify';
import axios from "axios";
import Modal from "../../../utils/modal";
import BASE_URL from "../../../utils/apiConfig";
import "react-toastify/dist/ReactToastify.css";

const URL_API = `${BASE_URL}user/`;

export default function DeleteUser ({id}) {
    const [showModal, setShowModal] = useState(false);

    const {token} = useContext(AuthContext);
    const navigate = useNavigate();

    const deleteUser = () => {
        axios.delete(`${URL_API}${id}`, {
            headers: {
                'access-token': token,
            }
        }).then(() => {
            toast.success('Usuario eliminado', {
                autoClose: 1500,
                onClose: () => {
                    window.location.reload();
                }
            });
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                toast.info('Sesión expirada', {
                    toastId: 'expiredSession',
                    autoClose: 1500,
                    onClose: () => {
                        navigate('/');
                    }
                });
            } else {
                toast.error('Error Inesperado', {
                    autoClose: 1500
                });
                console.error(error);
            }
        })
    }

    return (
        <>
            <Modal
                showModal={showModal}
                setShowModal={setShowModal}
                titulo={"Borrar Usuario"}
                content={
                    <>
                        <p>¿Está seguro de querer borrar este usuario?</p><br></br>
                        <p><strong>Esta acción es irreversible</strong></p>
                        <button onClick={() => deleteUser()} className="btn delete-button">Borrar</button>
                    </>
                }
            />
            <FontAwesomeIcon onClick={() => setShowModal(true)} className="delete-icon" icon={faTrash}/>
        </>
    )
}