import { useState } from "react";

function FilterLog ({elements, setElements}) {
    const [selectedOption, setSelectedOption] = useState('editorName');


    const handleFilter = (value) => {
        setElements(elements.filter(element => 
            element[selectedOption].toLowerCase().includes(value.toLowerCase())));
    }

    return (
        <>
            <select className="form-control d-inline" onChange={(event) => setSelectedOption(event.target.value)}>
                <option value={'editorName'}>Editor</option>
                <option value={'producerName'}>Productor</option>
            </select>
            <input type="text" onChange={(event) => handleFilter(event.target.value)}
                className="form-control d-inline" placeholder="Buscar aquí..."/>
        </>
    )
}

export default FilterLog;