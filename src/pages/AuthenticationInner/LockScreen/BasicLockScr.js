import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, Col, Container, Row, Alert, Spinner } from 'reactstrap';
import ParticlesAuth from "../ParticlesAuth";
import { useDispatch, useSelector } from 'react-redux';
import { resetLoginFlag } from '../../../rtk/slices/loginSlice/loginSlice';
import { loginUser } from '../../../rtk/slices/loginSlice/loginSlice'; // Import login action
import { unlockScreen } from '../../../rtk/slices/lockSlice/lockSlice'; // Import unlock action

// Import images
import logoLight from "../../../assets/images/logo-light.png";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";

const BasicLockScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const account = user ? user.account : null;

    const [inputPassword, setInputPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('user');
        dispatch(resetLoginFlag());
        navigate('/login');
    };

    // BasicLockScreen.js
    const handleUnlock = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const credentials = {
            account: account,
            password: inputPassword,
        };

        try {
            const response = await dispatch(loginUser(credentials)).unwrap();
            if (response) {
                dispatch(unlockScreen()); // Unlock the screen
                localStorage.setItem('isLocked', 'false'); // Ensure lock status is false in local storage
                navigate('/dashboard'); // Navigate to dashboard
            } else {
                setError('Invalid password');
            }
        } catch (err) {
            setError('Invalid password');
        } finally {
            setLoading(false);
        }
    };

    document.title = "Trading Application";
    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content mt-lg-5">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link to="/dashboard" className="d-inline-block auth-logo">
                                            <img src={logoLight} alt="" height="20" />
                                        </Link>
                                    </div>
                                    <p className="mt-3 fs-15 fw-medium">Premium Admin & Dashboard Template</p>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Lock Screen</h5>
                                            <p className="text-muted">Enter your password to unlock the screen!</p>
                                        </div>
                                        <div className="user-thumb text-center">
                                            <img src={avatar1} className="rounded-circle img-thumbnail avatar-lg" alt="thumbnail" />
                                            <h5 className="font-size-15 mt-3">{account}</h5>
                                        </div>
                                        <div className="p-2 mt-4">
                                            <form onSubmit={handleUnlock}>
                                                <div className="mb-3">
                                                    <label className="form-label" htmlFor="userpassword">Password</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        id="userpassword"
                                                        placeholder="Enter password"
                                                        required
                                                        value={inputPassword}
                                                        onChange={(e) => setInputPassword(e.target.value)}
                                                    />
                                                </div>
                                                {error && <Alert color="danger">{error}</Alert>} {/* Display error message */}
                                                <div className="mb-2 mt-4">
                                                    <Button color="success" className="w-100" type="submit" disabled={loading}>
                                                        {loading ? <Spinner size="sm" /> : 'Unlock'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className="mt-4 text-center">
                                    <p className="mb-0">Not you? Return <span onClick={handleLogout} className="fw-semibold text-primary text-decoration-underline cursor-pointer"> Signin </span></p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default BasicLockScreen;
