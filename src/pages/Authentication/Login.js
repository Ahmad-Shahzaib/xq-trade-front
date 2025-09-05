import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner } from 'reactstrap';
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { createSelector } from 'reselect';
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { unlockScreen } from '../../rtk/slices/lockSlice/lockSlice'; // Import unlock action

// Import actions
import { loginUser, resetLoginFlag } from "../../rtk/slices/loginSlice/loginSlice";
import logoLight from "../../assets/images/t-logo.png";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [passwordShow, setPasswordShow] = useState(false);

    // Memoized selector using createSelector (reselect)
    const selectLoginState = (state) => state;
    const loginPageSelector = createSelector(
        selectLoginState,
        (state) => ({
            loading: state.login.loading,
            error: state.login.error,
        })
    );

    const { loading, error } = useSelector(loginPageSelector);

    // useFormik hook for validation and form handling
    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            account: '',
            password: '',
        },
        validationSchema: Yup.object({
            account: Yup.string().required("Please Enter Your Account"),
            password: Yup.string().required("Please Enter Your Password"),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            
            try {
                const response = await dispatch(loginUser(values)).unwrap(); // Unwrap to handle response
                
                // Assuming response returns user data if successful
                if (response) {
                    console.log("Login successful, navigating to dashboard...");
                    navigate('/dashboard'); // Navigate to the dashboard after successful login
                    dispatch(unlockScreen()); 
                } else {
                    console.error("Login response was not valid");
                }
            } catch (error) {
                console.error('Login failed:', error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        // Set page title
        document.title = "Trading Application";

        // Reset the login flag after a delay to clear error messages
        if (error) {
            setTimeout(() => {
                dispatch(resetLoginFlag());
            }, 3000);
        }
    }, [dispatch, error]);

    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content mt-lg-5">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mb-4 text-white-50">
                                    <div>
                                        <Link to="/" className="d-inline-block auth-logo">
                                            <img src={logoLight} alt="" height={90}/>
                                        </Link>
                                    </div>
                                    {/* <p className="mt-3 fs-15 fw-medium">Premium Crypto & Dashboard Template</p> */}
                                </div>
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Welcome Back !</h5>
                                            <p className="text-muted">Sign in to continue</p>
                                        </div>
                                        {error && <Alert color="danger">{error}</Alert>}
                                        <div className="p-2 mt-4">
                                            <Form onSubmit={validation.handleSubmit} autoComplete="off">
                                                <div className="mb-3">
                                                    <Label htmlFor="account" className="form-label">Account</Label>
                                                    <Input
                                                        name="account"
                                                        className="form-control"
                                                        placeholder="Enter account"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.account || ""}
                                                        invalid={validation.touched.account && validation.errors.account ? true : false}
                                                    />
                                                    {validation.touched.account && validation.errors.account && (
                                                        <FormFeedback>{validation.errors.account}</FormFeedback>
                                                    )}
                                                </div>

                                                <div className="mb-3">
                                                    {/* <div className="float-end">
                                                        <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
                                                    </div> */}
                                                    <Label className="form-label" htmlFor="password-input">Password</Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Input
                                                            name="password"
                                                            value={validation.values.password || ""}
                                                            type={passwordShow ? "text" : "password"}
                                                            className="form-control pe-5"
                                                            placeholder="Enter Password"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            invalid={validation.touched.password && validation.errors.password ? true : false}
                                                        />
                                                        {validation.touched.password && validation.errors.password && (
                                                            <FormFeedback>{validation.errors.password}</FormFeedback>
                                                        )}
                                                        <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon" onClick={() => setPasswordShow(!passwordShow)}>
                                                            <i className="ri-eye-fill align-middle"></i>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* <div className="form-check">
                                                    <Input className="form-check-input" type="checkbox" id="auth-remember-check" />
                                                    <Label className="form-check-label" htmlFor="auth-remember-check">Remember me</Label>
                                                </div> */}

                                                <div className="mt-4">
                                                    <Button color="success" disabled={loading || validation.isSubmitting} className="btn btn-success w-100" type="submit">
                                                        {loading && <Spinner size="sm" className='me-2'> Loading... </Spinner>}
                                                        Sign In
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default Login;
