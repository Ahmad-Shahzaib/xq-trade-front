import React, { useState } from 'react';
import { Button, Card, CardHeader, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, FormText } from 'reactstrap';

const ApplyForPamManager = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [showError, setShowError] = useState(false);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
        setShowError(false); // Reset error state when modal is closed
    };

    const handleApply = () => {
        if (isChecked) {
            // Handle apply logic here
     
            toggleModal(); // Close modal after applying
        } else {
            setShowError(true);
        }
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="d-flex justify-content-between align-items-center">
                        <h3 className='fs-5 mb-0 lh-base text-secondary'>Pam Manager</h3>
                        <Button color='primary' className='text-uppercase btn-soft-primary' onClick={toggleModal}>apply for manager</Button>
                    </div>
                </CardHeader>
            </Card>

            <Modal isOpen={modalOpen} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Apply for PAM Manager</ModalHeader>
                <ModalBody>
                    <div>
                        <Label check>
                            <Input
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => {
                                    setIsChecked(e.target.checked);
                                    setShowError(false); // Hide error when checkbox is selected
                                }}
                            />
                            I agree to the terms and conditions
                        </Label>
                    </div>

                    {showError && (
                        <FormText color="danger">
                            Please agree to the terms and conditions to proceed.
                        </FormText>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                    <Button color="primary" onClick={handleApply}>Apply</Button>
                </ModalFooter>
            </Modal>
        </>
    );
}

export default ApplyForPamManager;
