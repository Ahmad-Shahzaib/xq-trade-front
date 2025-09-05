import React, { useState } from 'react'
import { Card, CardBody, CardHeader, FormGroup, Label, Input, Button, Toast, ToastBody, ToastHeader } from 'reactstrap'
import { useTranslation } from 'react-i18next';
const GoogleAuthenticatorOTP = () => {
    const { t } = useTranslation(); // Initialize translation function
    // State to hold OTP value and submission state
    const [otp, setOtp] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState('');

    // Handle OTP input change
    const handleOtpChange = (e) => {
        setOtp(e.target.value);
        setError(''); // Clear any existing error when typing
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!otp) {
            setError('OTP is required');
            return;
        }


        setShowToast(true);

        // Reset the OTP field
        setOtp('');

        // Hide the toast after 3 seconds
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    return (
        <div>
            <Card className='bg-transparent'>
                <CardHeader className='bg-transparent'>
                    <h3 className="mb-0">{t('Enable 2FA Security')}</h3>
                </CardHeader>
                <CardBody>
                    <FormGroup>
                        <Label for="otp">{t('Google Authenticator OTP')}</Label>
                        <Input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={handleOtpChange}
                            className="mb-1 w-100"
                            invalid={!!error} // Add invalid state if there's an error
                        />
                        {error && <div className="text-danger">{error}</div>}
                        <Button className="w-100 mt-2 depositButtonLite justify-content-center" type="submit" onClick={handleSubmit}>
                            {t('Submit')}
                        </Button>
                    </FormGroup>
                </CardBody>
            </Card>

            {/* Toast Notification */}
            {showToast && (
                <div className="position-fixed  end-0 p-3" style={{ zIndex: 5, top:'70px' }}>
                    <Toast isOpen={showToast}>
                        <ToastHeader icon="secondary">
                            {t('Success')}
                        </ToastHeader>
                        <ToastBody>
                           {t(' OTP submitted successfully!')}
                        </ToastBody>
                    </Toast>
                </div>
            )}
        </div>
    );
};

export default GoogleAuthenticatorOTP;
