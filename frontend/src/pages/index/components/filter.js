import { useState } from "react";

function Filter ({elements, setElements}) {
    const [selectedOption, setSelectedOption] = useState('name');


    const handleFilter = (value) => {
        setElements(elements.filter(element => 
            element[selectedOption].toLowerCase().includes(value.toLowerCase())));
    }

    return (
        <>
            <select className="form-control d-inline" onChange={(event) => setSelectedOption(event.target.value)}>
                <option value={'name'}>Nombre</option>
                <option value={'id'}>Cédula</option>
            </select>
            <input type="text" onChange={(event) => handleFilter(event.target.value)}
                className="form-control d-inline" placeholder="Buscar aquí..."/>
        </>
    )
}

export default Filter;