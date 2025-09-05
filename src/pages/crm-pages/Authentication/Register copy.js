import React from "react";
import { Row, Col, CardBody, Card, Container, Input, Label, Form, FormFeedback, Alert, UncontrolledAlert, Button } from "reactstrap";
import Select from 'react-select';
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import countryList from "react-select-country-list";
import { logoLight } from '../../../utils/config';
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { PhoneNumberUtil } from 'google-libphonenumber';

import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearRegisterState, clearErrors } from "../../../rtk/slices/crm-slices/auth/registerSlice";

const Register = () => {
    const phoneUtil = PhoneNumberUtil.getInstance();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, token, errorMessage, fieldErrors } = useSelector((state) => state.register);

    const countryOptions = countryList().getData().map(country => ({
        value: country.value, // This is the country code (e.g., "PK")
        label: country.label, // This is the country name (e.g., "Pakistan")
        mobileCode: `+${phoneUtil.getCountryCodeForRegion(country.value)}` // Generate mobile code
    }));

    React.useEffect(() => {
        if (token) {
            navigate('/dashboard'); // Redirect after successful registration
            dispatch(clearRegisterState());
        }
    }, [token, navigate, dispatch]);

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            email: '',
            password: '',
            // confirm_password: '',
            // first_name: '',
            // last_name: '',
            // country: '',
            // country_code: '',
            // mobile_code: '',
            // mobile: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().required("Please Enter Your Email"),
            password: Yup.string().required("Please enter your password").min(6, "The password field must be at least 6 characters."),
            // confirm_password: Yup.string()
            //     .oneOf([Yup.ref("password")], "Passwords do not match")
            //     .required("Please confirm your password"),
            // first_name: Yup.string().required("Please Enter Your First Name"),
            // last_name: Yup.string().required("Please Enter Your Last Name"),
            // country: Yup.string().required("Please Select Your Country"),
            // country_code: Yup.string().required("Please Enter Your Country Code"),
            // mobile_code: Yup.string().required("Please Enter Your Mobile Country Code"),
            // mobile: Yup.string()
            //     .required("Please Enter Your Mobile Number")

        }),
        onSubmit: (values) => {
            dispatch(registerUser({
                email: values.email,
                password: values.password,
                // first_name: values.first_name,
                // last_name: values.last_name,
                // country: values.country,
                // country_code: values.country_code,
                // mobile_code: values.mobile_code,
                // mobile: values.mobile
            }));
        }
    });

    document.title = "Basic SignUp";

    return (
        <React.Fragment>

            <div className="auth-page-content pb-5 pt-5">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="text-center mt-sm-5 mb-1 text-white-50">
                                <div>
                                    <Link to="/" className="d-inline-block auth-logo">
                                        <img src={logoLight} alt="" style={{ width: '70%' }} />
                                    </Link>
                                </div>
                            </div>
                        </Col>
                    </Row>

                    <Row className="justify-content-center">
                        <Col xs={12} md={8} xl={7}>
                            <Card className="mt-1 bg-transparent">
                                <CardBody className="p-0">
                                    <div className="text-center mt-2">
                                        <div className="auth-heading-wrapper">
                                            <h3>Register</h3>
                                        </div>
                                    </div>
                                    <div className="p-2 mt-4">
                                        <Form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                validation.handleSubmit();
                                                return false;
                                            }}
                                            className="needs-validation" action="#">

                                            <div className="mb-3">
                                                <Row>
                                                    <Col xs={12}>
                                                        {/* <Label htmlFor="useremail" className="form-label">Email <span className="text-danger">*</span></Label> */}
                                                        <Input
                                                            id="email"
                                                            name="email"
                                                            className="form-control"
                                                            placeholder="Enter email address"
                                                            type="email"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.email || ""}
                                                            invalid={validation.touched.email && validation.errors.email}
                                                        />
                                                        {validation.touched.email && validation.errors.email ? (
                                                            <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="mb-3">
                                                <Row>
                                                    <Col xs={12} md={6} className="mb-3 mb-md-0">
                                                        {/* <Label htmlFor="first_name" className="form-label">First Name <span className="text-danger">*</span></Label> */}
                                                        <Input
                                                            name="first_name"
                                                            type="text"
                                                            placeholder="Enter first name"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.first_name || ""}
                                                            invalid={validation.touched.first_name && validation.errors.first_name}
                                                        />
                                                        {validation.touched.first_name && validation.errors.first_name ? (
                                                            <FormFeedback type="invalid">{validation.errors.first_name}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        {/* <Label htmlFor="last_name" className="form-label">Last Name <span className="text-danger">*</span></Label> */}
                                                        <Input
                                                            name="last_name"
                                                            type="text"
                                                            placeholder="Enter last name"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.last_name || ""}
                                                            invalid={validation.touched.last_name && validation.errors.last_name}
                                                        />
                                                        {validation.touched.last_name && validation.errors.last_name ? (
                                                            <FormFeedback type="invalid">{validation.errors.last_name}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                </Row>
                                            </div>

                                            <div className="mb-3">
                                                <Row>
                                                    <Col xs={12} md={6} className="mb-3 mb-md-0">
                                                        {/* <Label htmlFor="userpassword" className="form-label">Password <span className="text-danger">*</span></Label> */}
                                                        <Input
                                                            name="password"
                                                            type="password"
                                                            placeholder="Enter Password"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.password || ""}
                                                            invalid={validation.touched.password && validation.errors.password}
                                                        />
                                                        {validation.touched.password && validation.errors.password ? (
                                                            <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        {/* <Label htmlFor="confirmPassword" className="form-label">Confirm Password <span className="text-danger">*</span></Label> */}
                                                        <Input
                                                            name="confirm_password"
                                                            type="password"
                                                            placeholder="Confirm Password"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.confirm_password || ""}
                                                            invalid={validation.touched.confirm_password && validation.errors.confirm_password}
                                                        />
                                                        {validation.touched.confirm_password && validation.errors.confirm_password ? (
                                                            <FormFeedback type="invalid">{validation.errors.confirm_password}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                </Row>
                                            </div>

                                            <div className="mb-3">
                                                <Row>
                                                    <Col xs={12} md={6} className="mb-3 mb-md-0">
                                                        {/* <Label htmlFor="country" className="form-label">Country <span className="text-danger">*</span></Label> */}
                                                        <Select
                                                            id="country"
                                                            name="country"
                                                            placeholder="Country"
                                                            options={countryOptions}
                                                            onChange={(option) => {
                                                                validation.setFieldValue("country", option.label); // Store country name as string
                                                                validation.setFieldValue("country_code", option.value); // Store country code
                                                            }}
                                                            onBlur={validation.handleBlur}
                                                            value={countryOptions.find(option => option.label === validation.values.country)} // Set selected country
                                                            isInvalid={validation.touched.country && validation.errors.country}
                                                        />
                                                        {validation.touched.country && validation.errors.country ? (
                                                            <FormFeedback type="invalid">{validation.errors.country}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        {/* <Label htmlFor="country_code" className="form-label">Country Code <span className="text-danger">*</span></Label> */}
                                                        <Input
                                                            id="country_code"
                                                            name="country_code"
                                                            type="text"

                                                            placeholder="Enter country code"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.country_code || ""}
                                                            invalid={validation.touched.country_code && validation.errors.country_code}
                                                            readOnly // Make this input read-only since it's derived from the selected country
                                                        />
                                                        {validation.touched.country_code && validation.errors.country_code ? (
                                                            <FormFeedback type="invalid">{validation.errors.country_code}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="mb-3">
                                                <Row>
                                                    <Col xs={12} md={6} className="mb-3 mb-md-0">
                                                        {/* <Label htmlFor="mobile_code" className="form-label">Mobile Country Code <span className="text-danger">*</span></Label> */}
                                                        <Select
                                                            id="mobile_code"
                                                            name="mobile_code"
                                                            placeholder="Mobile Country Code"
                                                            options={countryOptions.map(option => ({
                                                                value: option.mobileCode, // The mobile code (e.g., "+92")
                                                                label: `${option.mobileCode}` // Combine code and country name
                                                            }))}
                                                            onChange={(option) => {
                                                                validation.setFieldValue("mobile_code", option.value); // Store selected mobile code
                                                            }}
                                                            onBlur={validation.handleBlur}
                                                            isInvalid={validation.touched.mobile_code && validation.errors.mobile_code}
                                                        />
                                                        {validation.touched.mobile_code && validation.errors.mobile_code ? (
                                                            <FormFeedback type="invalid">{validation.errors.mobile_code}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                    <Col xs={12} md={6}>
                                                        {/* <Label htmlFor="mobile" className="form-label">Mobile Number <span className="text-danger">*</span></Label> */}
                                                        <Input
                                                            id="mobile"
                                                            name="mobile"
                                                            type="text"
                                                            placeholder="Enter mobile number"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            value={validation.values.mobile || ""}
                                                            invalid={validation.touched.mobile && validation.errors.mobile}
                                                        />
                                                        {validation.touched.mobile && validation.errors.mobile ? (
                                                            <FormFeedback type="invalid">{validation.errors.mobile}</FormFeedback>
                                                        ) : null}
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="mt-4">
                                                <Button className="depositButtonLite justify-content-center w-100 btn-lg" type="submit" disabled={loading}>
                                                    {loading ? "Registering..." : "Sign Up"}
                                                </Button>
                                                {(errorMessage || fieldErrors.email) && (
                                                    <UncontrolledAlert color="danger" className="alert-border-left mb-xl-0">
                                                        <i className="ri-error-warning-line me-3 align-middle fs-16"></i>
                                                        <strong>
                                                            {errorMessage}
                                                            {fieldErrors.email && ` - ${fieldErrors.email[0]}`}
                                                        </strong>
                                                    </UncontrolledAlert>
                                                )}
                                            </div>
                                        </Form>

                                    </div>
                                </CardBody>
                            </Card>
                            <div className="mt-4 text-center">
                                <p className="mb-0">Already have an account?
                                     <Link to="/login" className="fw-semibold text-decoration-underline" style={{ color: "#6FFF47" }}> Sign In </Link> </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

        </React.Fragment>
    );
};

export default Register;
