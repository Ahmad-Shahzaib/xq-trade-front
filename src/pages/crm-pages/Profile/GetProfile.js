import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../../../rtk/slices/crm-slices/user/getUserSlice'; // Import the getUser action
import { Card, CardBody, CardTitle, CardText, Row, Col, Spinner, Alert, Button, CardHeader } from 'reactstrap'; // Import reactstrap components


const GetProfile = () => {
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');  // Get token from localStorage
    const { user, status, error } = useSelector(state => state.user);  // Access user data from Redux state

    const avatar = require('../../../assets/images/users/avatar-1.jpg')

    useEffect(() => {
        if (token) {
            // Dispatch the getUser action when the component mounts
            dispatch(getUser(token));
        }
    }, [dispatch, token]);

    if (status === 'loading') {
        return (
            <div className="text-center">
                <Spinner color="light" />
                <p>Loading...</p>
            </div>
        );
    }

    if (status === 'failed') {
        return <Alert color="danger">Error: {error}</Alert>;
    }

    return (
        <>

            {user ? (
                <Card className="shadow-lg border rounded bg-transparent">
                    <CardHeader className='bg-transparent'>
                        <h3 className="mb-0">Profile</h3>
                    </CardHeader>
                    <CardBody>
                        <Row className="align-items-center justify-content-between">
                            <Col xs="6">
                                <CardTitle tag="h4" className="mb-3">{user.firstname} {user.lastname}</CardTitle>

                            </Col>
                            <Col xs="6" className="d-flex justify-content-end">
                                <div
                                    className="d-flex justify-content-center align-items-center "
                                    style={{
                                        width: '90px',
                                        height: '90px',
                                        borderRadius: '50%',
                                        backgroundColor: '#f0f0f0', // Light background to make avatar pop
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Soft shadow for depth
                                        overflow: 'hidden', // Ensures image stays inside the circular container
                                        transition: 'transform 0.3s ease', // Smooth transition for hover effect
                                    }}
                                >
                                    <img
                                        src={avatar}
                                        alt="user avatar"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover', // Ensures image covers the entire area
                                        }}
                                    />
                                </div>
                            </Col>

                        </Row>
                    </CardBody>
                </Card>
            ) : (
                <div>No user information available</div>
            )}
        </>
    );
};

export default GetProfile;