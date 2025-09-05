import React, { useEffect, useState } from 'react';
import {
    Modal, ModalHeader, ModalBody, ModalFooter,
    Button, Form, FormGroup, Label, Input, Spinner, Alert
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    renameTradeAccount,
    resetRenameState
} from '../../../rtk/slices/account-detail/renameTradeAccountSlice';

const RenameAccountModal = ({ isOpen, toggle, account,tradeAccounts }) => {
    const dispatch = useDispatch();
    const [name, setName] = useState(account?.name || '');
    const [localError, setLocalError] = useState('');
    const { renameStatus, renameError } = useSelector((state) => state.renameTradeAccount);

    useEffect(() => {
        if (account) setName(account.name);
        setLocalError('');
    }, [account]);

    useEffect(() => {
        if (renameStatus === 'succeeded') {
            dispatch(resetRenameState());
            toggle(); // close modal on success
        }
    }, [renameStatus]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setLocalError('Name cannot be empty');
            return;
        }
    
        dispatch(renameTradeAccount({ id: account.id, name }));
    };

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Rename Account</ModalHeader>
            <Form onSubmit={handleSubmit}>
                <ModalBody>
                    {localError && <Alert color="danger">{localError}</Alert>}
                    {renameError && <Alert color="danger">{renameError}</Alert>}
                    <FormGroup>
                        <Label for="accountName">Account Name</Label>
                        <Input
                            type="text"
                            id="accountName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={renameStatus === 'loading'}
                            required
                        />
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" color="primary" disabled={renameStatus === 'loading'}>
                        {renameStatus === 'loading' ? <Spinner size="sm" /> : 'Save'}
                    </Button>
                    <Button color="secondary" onClick={toggle} disabled={renameStatus === 'loading'}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Form>
        </Modal>
    );
};

export default RenameAccountModal;
