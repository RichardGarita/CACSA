import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";

function FilterLogs ({elements, setElements}) {
    const [startRange, setStartRange] = useState('');
    const [endRange, setEndRange] = useState('');

    useEffect(() => {
        handleFilterArray();
    }, [startRange, endRange])


    const handleFilterArray = () => {
        let filteredElements = elements;

        if (startRange) {
            filteredElements = filteredElements.filter(element => new Date(element.updatedAt) >= new Date(startRange));
        }
    
        if (endRange) {
            filteredElements = filteredElements.filter(element => new Date(element.updatedAt) <= new Date(endRange));
        }

        setElements(filteredElements);
    }

    const handleRevertRange = () => {
        setStartRange('');
        setEndRange('');
    }

    return (
        <>
            <div className="col-5 text-start ms-3">
                <p className="mb-0 d-inline"><strong>Fecha:</strong></p>
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

export default FilterLogs;