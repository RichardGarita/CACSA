import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faFilter } from "@fortawesome/free-solid-svg-icons";
import {toast} from 'react-toastify';
import ClipLoader from "react-spinners/ClipLoader";
import { AuthContext } from "../../utils/authContext";
import { useNavigate } from "react-router-dom";
import Search from "./components/search";
import Filter from "./components/filter";
import DeleteProducer from "./components/delete";
import BASE_URL from "../../utils/apiConfig";
import "react-toastify/dist/ReactToastify.css";
import '../../styles/Index.css';

const URL_API = `${BASE_URL}producer`;

function Index () {
    const {token, admin} = useContext(AuthContext);
    const [producers, setProducers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentProducers, setCurrentProducers] = useState([]);
    const [filteredProducers, setFilteredProducers] = useState([]);
    const [searchedProducers, setSearchedProducers] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const [loading, setLoading] = useState(true);

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
                setSearchedProducers(response.data);
                setTotalPages(Math.ceil(response.data.length / producersPerPage));
                setLoading(false);
            }).catch((error) => {
                console.log(error.response.status);
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('token');
                    toast.info('Sesión expirada', {
                        toastId: 'expiredSession',
                        autoClose: 1500,
                        onClose: () => {
                            window.location.reload();
                        }
                    });
                } else {
                    console.error(error);
                    toast.error('Hubo un error al tratar de obtener los productores. Intente de nuevo', {
                        autoClose: 1500,
                    });
                }
            })
    }, [token])

    useEffect(() => {
        const startIndex = (currentPage - 1) * producersPerPage;
        const endIndex = startIndex + producersPerPage;
        setCurrentProducers(searchedProducers.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(searchedProducers.length / producersPerPage));
    }, [currentPage, searchedProducers, producersPerPage]);

    const goToPage = (page) => {
        setCurrentPage(page);
    }

    return (
        <>
            <h2>Emisión de Carnet</h2>
            <div className="search-section">
                <FontAwesomeIcon className="filter-icon" onClick={() => setShowFilters(!showFilters)} icon={faFilter}/>
                <Search elements={filteredProducers} setElements={setSearchedProducers}/>
                <FontAwesomeIcon className="add-icon" onClick={() => navigate('/newProducer')} icon={faUserPlus}/>
            </div>
            <div className={`col-9 mx-auto d-flex ${showFilters ? '' : 'd-none'}`}>
                <Filter
                    elements={producers}
                    setElements={setFilteredProducers}
                    option={'fairLocality'}
                />
            </div>
            {!loading ? (
                <table className="table table-striped table-hover w-75 mx-auto">
                    <thead>
                        <tr>
                            <th>Cédula</th>
                            <th>Nombre</th>
                            <th>Fecha de expiración del carnet</th>
                            <th>Categoría</th>
                            <th>Participa en ferias</th>
                            {admin && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducers.map((producer) => (
                            <tr key={producer.id}>
                                <td onClick={() => navigate(`/producer/${producer.id}`)}>
                                    {producer.identification}
                                </td>
                                <td onClick={() => navigate(`/producer/${producer.id}`)}>
                                    {producer.name}
                                </td>
                                <td onClick={() => navigate(`/producer/${producer.id}`)}>
                                    {producer.date}
                                </td>
                                <td onClick={() => navigate(`/producer/${producer.id}`)}>
                                    {producer.category}
                                </td>
                                <td onClick={() => navigate(`/producer/${producer.id}`)}>
                                    {producer.fair ? producer.fairLocality : 'No participa'}
                                </td>
                                {admin && <td><DeleteProducer id={producer.id}/></td>}
                            </tr>
                        ))}
                    </tbody>
                </table>) : 
            (
                <div><ClipLoader loading={loading} size={300} color="blue" /></div>
            )}
            <nav className="">
                <ul className="pagination justify-content-center">
                    <li key={'prev'} className="page-item">
                        <span onClick={() => goToPage(Math.max(currentPage-1, 1))} className="page-link">&laquo;</span>
                    </li>
                    {Array.from({length: totalPages}, (_, i) => i + 1).map((i) => (
                        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                            <span onClick={() => goToPage(i)} className="page-link z-0">{i}</span>
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