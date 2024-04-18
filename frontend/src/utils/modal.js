import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function Modal({launchModal, titulo, content}) {

    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <div onClick={() => openModal()}>
                {launchModal}
            </div>

            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                {titulo && <h1 className="modal-title fs-5">Titulo</h1>}
                                <FontAwesomeIcon aria-label="Close" onClick={closeModal} className='ms-auto close-modal' icon={faCircleXmark} />
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
