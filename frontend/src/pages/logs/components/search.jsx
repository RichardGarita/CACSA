import { useState, useEffect } from "react";

function Search ({elements, setElements}) {
    const [selectedOption, setSelectedOption] = useState('editorName');
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        if(elements.length > 0) {
            setElements(elements.filter(element => 
                element[selectedOption].toLowerCase().includes(searchValue.toLowerCase())));
        } else {
            setElements([]);
        }
    }, [elements, searchValue, selectedOption, setElements])

    return (
        <>
            <select className="form-control d-inline p-0" onChange={(event) => {
                setSelectedOption(event.target.value);
                setElements(elements);
            }}>
                <option value={'editorName'}>Editor</option>
                <option value={'producerName'}>Productor</option>
                <option value={'producerIdentification'}>Cédula</option>
            </select>
            <input type="text" onChange={(event) => setSearchValue(event.target.value)}
            className="form-control d-inline field" placeholder="Buscar aquí..."/>
        </>
    )
}

export default Search;