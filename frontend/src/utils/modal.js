import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function Modal({showModal, setShowModal, titulo, content}) {

    return (
        <>
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                {titulo && <h1 className="modal-title fs-5">{titulo}</h1>}
                                <FontAwesomeIcon aria-label="Close" onClick={() => setShowModal(false)} className='ms-auto close-modal' icon={faCircleXmark} />
                            </div>
                            <div className="modal-body">{content}</div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && <div className="modal-backdrop fade show"></div>}
        </>
    );
}
