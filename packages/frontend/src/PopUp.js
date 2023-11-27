import React, {useEffect, useState} from 'react';
import Modal from 'react-modal';
import "./CSS Files/PopUp.css";


const PopupButton = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const popupData = props.popupData;

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        Modal.setAppElement('#root');
    }, []);

    return (
        <div className="modalContainer">
            <button onClick={openModal} className='calculate'>
                Submit
            </button>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Popup Modal"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    content: {
                        maxWidth: '400px',
                        margin: 'auto',
                        padding: '20px',
                        backgroundColor: '#fff',
                        borderRadius: '5px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                    },
                }}
            >
                <div>
                    {popupData}
                    <button onClick={closeModal} className='closeButton'>
                        X
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default PopupButton;
