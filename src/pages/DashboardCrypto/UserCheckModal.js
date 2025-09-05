import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';

const UserCheckModal = ({message}) => {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);


    useEffect(() => {
        // Check if 'user' exists in local storage
        const user = localStorage.getItem('user');
        if (!user) {
            setIsModalOpen(true); // Open the modal if 'user' is not found
        }
    }, []);

    const handleClose = () => {
        setIsModalOpen(false); // Close the modal
        setTimeout(() => {
            navigate('/trading-accounts');
        }, 800);
    };

    return (
        <div>
            {/* Warning Modal */}
            <Modal isOpen={isModalOpen} toggle={handleClose}>
                <ModalHeader className='text-warning' toggle={handleClose} color='warning'>Warning</ModalHeader>
                <ModalBody>
                    {message}
                </ModalBody>
                <div className="d-flex justify-content-end p-3">
                    <Button color="primary" onClick={handleClose}>
                        Close
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default UserCheckModal;
