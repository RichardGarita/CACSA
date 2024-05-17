import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import { options } from "../../../utils/localities";

function Filter ({elements, setElements, option, range}) {
    const [selectedArrayOptions, setSelectedArrayOptions] = useState([]);
    const [startRange, setStartRange] = useState('');
    const [endRange, setEndRange] = useState('');

    useEffect(() => {
        handleFilterArray();
    }, [selectedArrayOptions, startRange, endRange])

    const arrayOptions = [{value: 'No participa', label: 'No participa'}, ...options]

    const handleFilterArray = () => {
        let filteredElements = elements;
        if (selectedArrayOptions.length > 0) {
            filteredElements = elements.filter(element => {
                const elementArray = element[option].split(', ');
                return selectedArrayOptions.every(item => elementArray.includes(item.value));
            });
        }

        if (startRange) {
            filteredElements = filteredElements.filter(element => new Date(element.date) >= new Date(startRange));
        }
    
        if (endRange) {
            filteredElements = filteredElements.filter(element => new Date(element.date) <= new Date(endRange));
        }

        setElements(filteredElements);
    }

    const handleRevertRange = () => {
        setStartRange('');
        setEndRange('');
    }

    return (
        <>
            <div className="col-5 text-start">
                <p className="mb-0"><strong>Ferias en las que participa:</strong></p>
                <Select options={arrayOptions} closeMenuOnSelect={false} className="field"
                isMulti onChange={(selected) => setSelectedArrayOptions(selected)}/>
            </div>
            <div className="col-5 text-start ms-3">
                <p className="mb-0 d-inline"><strong>Fecha de expiración del carnet:</strong></p>
                <FontAwesomeIcon className="ms-1 revert-icon" icon={faRotateLeft} onClick={() => handleRevertRange()}/>
                <div className="d-flex align-items-center">
                    <div className="me-3 d-flex align-items-center">
                        <label className="me-2 mb-0">Desde:</label>
                        <input type="date" className="form-control w-auto" value={startRange}
                            onChange={(e) => setStartRange(e.target.value)}/>
                    </div>
                    <div className="d-flex align-items-center">
                        <label className="me-2 mb-0">Hasta:</label>
                        <input type="date" className="form-control w-auto" value={endRange}
                            onChange={(e) => setEndRange(e.target.value)}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Filter;