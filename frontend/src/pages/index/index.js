import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import {ToastContainer, toast} from 'react-toastify';
import { AuthContext } from "../../utils/authContext";
import { useNavigate } from "react-router-dom";
import Filter from "./components/filter";
import BASE_URL from "../../utils/apiConfig";
import "react-toastify/dist/ReactToastify.css";
import '../../styles/Index.css';

const URL_API = `${BASE_URL}producer`;

function Index () {
    const {token} = useContext(AuthContext);
    const [producers, setProducers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentProducers, setCurrentProducers] = useState([]);
    const [filteredProducers, setFilteredProducers] = useState([]);

    const navigate = useNavigate();

    const producersPerPage = 5;

    useEffect(() => {
            axios.get(URL_API, {
                headers: {
                    'access-token': token
                }
            }).then((response) => {
                setProducers(response.data);
                setFilteredProducers(response.data);
                setTotalPages(Math.ceil(response.data.length / producersPerPage));
            }).catch((error) => {
                console.log(error.response.status);
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    toast.info('Sesión expirada', {
                        autoClose: 2000,
                        onClose: () => {
                            window.location.reload();
                        }
                    });
                } else {
                    console.error(error);
                    toast.error('Hubo un error al tratar de obtener los productores. Intente de nuevo', {
                        autoClose: 2000,
                    });
                }
            })
    }, [token])

    useEffect(() => {
        const startIndex = (currentPage - 1) * producersPerPage;
        const endIndex = startIndex + producersPerPage;
        setCurrentProducers(filteredProducers.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(filteredProducers.length / producersPerPage));
    }, [currentPage, filteredProducers, producersPerPage]);

    const goToPage = (page) => {
        setCurrentPage(page);
    }

    return (
        <>
            <ToastContainer/>
            <div className="search-section">
                <Filter elements={producers} setElements={setFilteredProducers}/>
                <FontAwesomeIcon className="add-icon" onClick={() => navigate('/newProducer')} icon={faUserPlus}/>
            </div>
            <table className="table table-striped table-hover w-75 mx-auto">
                <thead>
                    <tr>
                        <th>Cédula</th>
                        <th>Nombre</th>
                        <th>Fecha de expiración del carnet</th>
                        <th>Participa en ferias</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducers.map((producer) => (
                        <tr key={producer.id} onClick={() => navigate(`/producer/${producer.id}`)}>
                            <td>{producer.identification}</td>
                            <td>{producer.name}</td>
                            <td>{producer.date}</td>
                            <td>{producer.fair ? 'Sí' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <nav>
                <ul className="pagination justify-content-center">
                    <li key={'prev'} className="page-item">
                        <span onClick={() => goToPage(Math.max(currentPage-1, 1))} className="page-link">&laquo;</span>
                    </li>
                    {Array.from({length: totalPages}, (_, i) => i + 1).map((i) => (
                        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                            <span onClick={() => goToPage(i)} className="page-link">{i}</span>
                        </li>
                    ))}
                    <li key={'next'} className="page-item">
                        <span onClick={() => goToPage(Math.min(currentPage+1, totalPages))} className="page-link">&raquo;</span>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Index;