import React, { useState } from 'react';
import axios from 'axios';

const createURL = (path) => {return `http://localhost:4223/api/productor/getOne?path=${path}`;}

function ViewProducer(){
    const [imageURL, setImageURL] = useState('');

    const showImage = (path) => {
        if (!imageURL) {
            axios.get(createURL(path)).then((response) => {
                console.log(`Here is the response: ${response.data.url}`);
                setImageURL(response.data.url);
            }).catch((error) => {
                console.error('Error: ', error);
            })
        }
    }

    return (
        <div>
            <div>
                <h3>Name</h3>
                <h3>Id</h3>
                <h3>Date</h3>
            </div>

            <h2 onClick={()=>showImage('30540/pass/3c0ac242-2df0-4039-8d1d-b1d6d799f389_omnilifeTitulo.webp')}>Image</h2>
            {imageURL && <img src={imageURL} alt='No hay imagen' />}
        </div>
    )
}

export default ViewProducer;