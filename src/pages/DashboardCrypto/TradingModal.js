import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTradingModal } from '../../rtk/slices/tradingSlice/tradingSlice';
import Trading from './Trading/Trading';

const TradingModal = () => {
    const dispatch = useDispatch();

    const isOpen = useSelector((state) => state.trading.isModalOpen);
    const toggle = () => dispatch(toggleTradingModal());
    
    return (
        <>
            <div id="myTradingModal" className="tradingModal">
                    <Modal
                        isOpen={isOpen}
                        toggle={toggle}
                        //    backdrop={false}
                        className="draggable-modal">
                        <ModalHeader toggle={toggle} className="cursor-move p-3">Trading</ModalHeader>
                        <ModalBody className='p-0'>
                            <Trading />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={toggle}>
                                Close
                            </Button>
                        </ModalFooter>
                    </Modal>
            </div>
        </>
    );
};

export default TradingModal;
