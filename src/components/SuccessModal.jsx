// SuccessModal.js
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const SuccessModal = ({ isOpen, onRequestClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Sucesso!"
        >
            <h2>Sucesso!</h2>
            <p>Os treinos foram salvos com sucesso.</p>
            <button onClick={onRequestClose}>Fechar</button>
        </Modal>
    );
};

export default SuccessModal;
