import { useState } from "react";

function Filter ({elements, setElements}) {
    const [selectedOption, setSelectedOption] = useState('name');


    const handleFilter = (value) => {
        setElements(elements.filter(element => 
            element[selectedOption].toLowerCase().includes(value.toLowerCase())));
    }

    return (
        <div className="w-75 mx-auto">
            <select className="form-control w-25 d-inline" onChange={(event) => setSelectedOption(event.target.value)}>
                <option value={'name'}>Nombre</option>
                <option value={'id'}>Cédula</option>
            </select>
            <input type="text" onChange={(event) => handleFilter(event.target.value)} className="form-control w-75 d-inline"/>
        </div>
    )
}

export default Filter;