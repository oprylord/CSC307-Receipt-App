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

    console.log(popupData);

    return (
        <div>
            <button onClick={openModal}>
                Open Popup
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
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        maxWidth: '400px',
                        margin: 'auto',
                        padding: '20px',
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
                    },
                }}
            >
                <div>
                    {popupData.map((item, index) => (
                        <div key={index} className='modalText'>{item}</div>
                    ))}
                    <button onClick={closeModal} className='closeButton'>
                        X
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default PopupButton;