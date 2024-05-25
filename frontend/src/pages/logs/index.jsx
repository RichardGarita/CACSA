import React, {useState, useEffect, useContext} from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import SearchLog from "./components/search";
import FilterLogs from "./components/filter";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../utils/authContext";
import { convertToLocaleDateTime } from "../../utils/dateConverter";
import {toast} from 'react-toastify';
import ClipLoader from "react-spinners/ClipLoader";
import BASE_URL from "../../utils/apiConfig";
import "react-toastify/dist/ReactToastify.css";

const URL_API = `${BASE_URL}log`;

export default function ViewLogs () {
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [currentLogs, setCurrentLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [searchedLogs, setSearchedLogs] = useState([]);

    const [showFilters, setShowFilters] = useState(false);

    const [loading, setLoading] = useState(true);

    const logsPerPage = 10;

    const {token} = useContext(AuthContext);
    const navigate = useNavigate();

    const goToPage = (page) => {
        setCurrentPage(page);
    }

    useEffect(() => {
        axios.get(URL_API, {
            headers: {
                'access-token': token,
            }
        }).then((response) => {
            setLogs(response.data.logs);
            setFilteredLogs(response.data.logs);
            setSearchedLogs(response.data.logs);
            setTotalPages(Math.ceil(response.data.logs.length / logsPerPage));
            setLoading(false);
        }).catch(error => {
            if (error.response && error.response.status === 401) {
                toast.info('Sesión expirada', {
                    toastId: 'expiredSession',
                    autoClose: 1500,
                    onClose: () => {
                        localStorage.removeItem('token');
                        navigate('/');
                    }
                });
            }
            toast.error('Error al obtener los usuarios', {
                autoClose: 1500,
            });
            console.error(error);
        })
    }, [navigate, token])

    useEffect(() => {
        const startIndex = (currentPage - 1) * logsPerPage;
        const endIndex = startIndex + logsPerPage;
        setCurrentLogs(searchedLogs.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(searchedLogs.length / logsPerPage));
    }, [currentPage, searchedLogs, logsPerPage]);

    return (
        <>
            <h2>Bitácora</h2>
            <div className="search-section">
                <FontAwesomeIcon className="filter-icon" onClick={() => setShowFilters(!showFilters)} icon={faFilter}/>
                <SearchLog elements={filteredLogs} setElements={setSearchedLogs}/>  
            </div>
            <div className={`col-9 mx-auto d-flex mb-2 ${showFilters ? '' : 'd-none'}`}>
                <FilterLogs elements={logs} setElements={setFilteredLogs}/>
            </div>
            {!loading ? (
                <table className="table table-striped table-hover w-75 mx-auto">
                    <thead>
                        <tr>
                            <td>Editor</td>
                            <td>Productor editado</td>
                            <td>Cédula</td>
                            <td>Fecha</td>
                            <td>Realizado</td>
                        </tr>
                    </thead>
                    <tbody className="users-table">
                        {currentLogs.map((log, index) => (
                            <tr key={index}>
                                <td>{log.editorName}</td>
                                <td>{log.producerName}</td>
                                <td>{log.producerIdentification}</td>
                                <td>{convertToLocaleDateTime(log.updatedAt)}</td>
                                <td>{log.process}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>) :
            (
                <div><ClipLoader loading={loading} size={300} color="blue" /></div>
            )}
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