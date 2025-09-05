import React, { useEffect, useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Container,
    FormGroup,
    Input,
    Table,
    Spinner,
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { token } from '../../../utils/config';
import { myReferrals } from '../../../rtk/slices/crm-slices/myReferralsSlice/myReferralsSlice';
import { useTranslation } from 'react-i18next';
const Index = () => {
    const { t } = useTranslation(); // Initialize translation function
    const [selectedLevel, setSelectedLevel] = useState('1'); // Default level is 1
    const dispatch = useDispatch();
    const { referrals, status, error } = useSelector((state) => state.myReferrals);

    // Handle change in select option
    const handleLevelChange = (e) => {
        const level = e.target.value;
        setSelectedLevel(level);
    };

    useEffect(() => {
        if (token) {
            dispatch(myReferrals({ token, level: selectedLevel }));
        }
    }, [token, selectedLevel, dispatch]);

    return (
        <>
            <div className="page-content">
                <Container fluid>
                    <h2 className="mb-3 fw-bold">{t('Invite Friends& Get Rewards')}</h2>
                    <Card>
                        <CardHeader>
                            <div className="d-flex justify-content-between align-items-center">
                                <h3 className="mb-0">My Referrals</h3>
                                <FormGroup>
                                    <Input
                                        type="select"
                                        id="levels"
                                        name="levels"
                                        value={selectedLevel} // Controlled input
                                        onChange={handleLevelChange} // Handle change
                                    >
                                        {[...Array(10)].map((_, index) => (
                                            <option key={index + 1} value={index + 1}>
                                                Level {index + 1}
                                            </option>
                                        ))}
                                    </Input>
                                </FormGroup>
                            </div>
                        </CardHeader>
                        <CardBody className='p-0'>
                            <Table striped responsive className='text-center m-0'>
                                <thead className="text-white">
                                    <tr>

                                        <th>{t('Username')}</th>
                                        <th>{t('Name')}</th>
                                        <th>{t('Email')}</th>
                                        <th>{t('Trade Account Balance')}</th>
                                        <th>{t('IB')}</th>
                                        <th>{t('Join Date')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {status === 'loading' ? (
                                        <tr className='opd-tr'>
                                            <td colSpan="6" className="text-center">
                                                <Spinner size="sm" color="primary" /> {t('Loading')}...
                                            </td>
                                        </tr>
                                    ) : Array.isArray(referrals) && referrals.length > 0 ? (
                                        referrals.map((referral, index) => (
                                            <tr key={referral.id} className='opd-tr'>
                                                <td>{referral.username}</td>
                                                <td>{`${referral.firstname} ${referral.lastname}`}</td>
                                                <td>{referral.email}</td>
                                                <td>{referral.tradingBalance}</td>
                                                <td>{referral.is_ib === 0 ? "No" : "Yes"}</td>
                                                <td>
                                                    {new Date(referral.created_at).toLocaleDateString('en-US', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                    <span className='fw-bold mb-0'>{' '}||{' '}</span>
                                                    {new Date(referral.created_at).toLocaleTimeString('en-US', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit',
                                                        hour12: false, // Use 24-hour format
                                                    })}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className='opd-tr'>
                                            <td colSpan="6" className="text-center">
                                                {t('No Data Found')}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </Table>
                            {error && (
                                <div className="text-danger text-center mt-3">
                                    Error: {error}
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </>
    );
};

export default Index;
