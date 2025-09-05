import React, { useState } from 'react'
import { Card, CardBody, CardHeader, FormGroup, Label, Input, Button, Row, Col, Toast, ToastBody, ToastHeader } from 'reactstrap'
import { useTranslation } from 'react-i18next';
const GoogleAuthenticator = () => {
    const { t } = useTranslation(); // Initialize translation function
    // Dummy setup key for Google Authenticator
    const setupKey = '1234-5678-ABCD-EFGH';

    // State to control toast visibility
    const [showToast, setShowToast] = useState(false);

    // Function to copy the setup key to the clipboard and show toast
    const copyToClipboard = () => {
        navigator.clipboard.writeText(setupKey);
        setShowToast(true); // Show the toast

        // Hide toast after 3 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    return (
        <div>

                <CardHeader className='bg-transparent'>
                    <h3 className="mb-0">{t('Add Your Account')}</h3>
                </CardHeader>
                <CardBody>
                    <h5 className='fs-6 fw-light'>{t('Use the QR code or setup key on your Google Authenticator app to add your account.')}</h5>

                    {/* Dummy QR Code */}
                    <div style={{ textAlign: 'center', margin: '20px 0' }}>
                        <img
                            src="https://aboutreact.com/wp-content/uploads/2018/08/qrcode.png"
                            alt="Dummy QR Code"
                            style={{ width: '150px', height: '150px' }}
                        />
                    </div>

                    {/* Setup Key Input Field */}
                    <FormGroup>
                        <Label for="amount">{t('Setup Key')}</Label>
                        <Row className='align-items-stretch mx-0' style={{ border: '1px solid #ced4da', borderRadius: '0.25rem' }}>
                            <Col xs={10} className='ps-0'>
                                <Input
                                    type="text"
                                    value={setupKey}
                                    readOnly
                                    className="me-2 border-0"
                                />
                            </Col>
                            <Col xs={2} className='pe-0 text-end'>
                                <Button className='actionButtonLite mb-0 h-100' onClick={copyToClipboard} >
                                    {t('Copy')}
                                </Button>
                            </Col>
                        </Row>
                    </FormGroup>
                    <div className="message">
                        <p className="text-muted"><i class="ri-error-warning-line me-1">{t('Help')}</i> </p>
                        <p className='mb-0 '>
                            {t('Google Authenticator is a multifactor app for mobile devices. It generates timed codes used during the 2-step verification process. To use Google Authenticator, install the Google Authenticator application on your mobile device.')}
                            
                            <a className='text-secondary' href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en" target='_blank'
                              
                            >
                                {t('Download')}
                            </a>
                        </p>
                    </div>
                </CardBody>


            {/* Toast Notification */}
            {showToast && (
                // <div className="position-fixed  end-0 p-3 text-white" style={{ zIndex: 9999, top: "60px" }}>
                //     <Toast isOpen={showToast} style={{ borderColor: '#3577f1', background: '#0012ef57' }}>
                //         <ToastHeader icon="primary" className='text-white' style={{ background: '#0012ef57' }}>
                //             Success
                //         </ToastHeader>
                //         <ToastBody>
                //             Setup key copied to clipboard!
                //         </ToastBody>
                //     </Toast>
                // </div>
                <div className="position-fixed  end-0 p-3" style={{ zIndex: 5, top: '70px' }}>
                    <Toast isOpen={showToast}>
                        <ToastHeader icon="secondary">
                            Success
                        </ToastHeader>
                        <ToastBody>
                            Setup key copied to clipboard!
                        </ToastBody>
                    </Toast>
                </div>
            )}


        </div>
    );
};

export default GoogleAuthenticator;
