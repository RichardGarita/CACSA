import { useState, useEffect } from "react";

function Search ({elements, setElements}) {
    const [selectedOption, setSelectedOption] = useState('name');
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        if(elements.length > 0) {
            setElements(elements.filter(element => 
                element[selectedOption].toLowerCase().includes(searchValue.toLowerCase())));
        }
    }, [elements, searchValue, selectedOption, setElements])

    return (
        <>
            <select className="form-control d-inline p-0" onChange={(event) => {
                setSelectedOption(event.target.value);
                setElements(elements);
            }}>
                <option value={'name'}>Nombre</option>
                <option value={'identification'}>Cédula</option>
            </select>
            <input type="text" onChange={(event) => setSearchValue(event.target.value)}
            className="form-control d-inline field" placeholder="Buscar aquí..."/>
        </>
    )
}

export default Search;