import React, { useCallback, useEffect } from "react";
import { Row, Col, CardBody, Card, Container, Input, Form, FormFeedback, UncontrolledAlert, Button, ButtonGroup } from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearRegisterState, clearErrors } from "../../../rtk/slices/crm-slices/auth/registerSlice";
import { checkReferral } from "../../../rtk/slices/checkReferralSlice/checkReferralSlice";
import debounce from "lodash.debounce";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../../Components/LanguageSwitcher';
import GoogleLoginButton from './GoogleLoginButton';
import { PhoneNumberUtil } from 'google-libphonenumber'; // Added explicit import
import countryList from 'react-select-country-list'; // Added explicit import
import sqlogo from "../../../assets/images/xq_logo.png"

const Register = () => {
    const phoneUtil = PhoneNumberUtil.getInstance();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const { loading, token, errorMessage, fieldErrors } = useSelector((state) => state.register);
    const { fullname: refName, email: refEmail, errorMessage: refError, status } = useSelector((state) => state.checkReferral);

    const countryOptions = countryList().getData().map(country => ({
        value: country.value, // This is the country code (e.g., "PK")
        label: country.label, // This is the country name (e.g., "Pakistan")
        mobileCode: `+${phoneUtil.getCountryCodeForRegion(country.value)}` // Generate mobile code
    }));

    const queryParams = new URLSearchParams(location.search);
    const refNumFromUrl = queryParams.get('reff_code'); // Get the value of reff_code from the query string

    // Debounced checkReferral API call
    const debouncedCheckReferral = useCallback(
        debounce((value) => {
            dispatch(checkReferral({ reff_code: value }));
        }, 500), // 500ms delay before API call
        [dispatch] // Added dispatch to dependency array
    );

    useEffect(() => {
        if (token) {
            navigate('/dashboard'); // Redirect after successful registration
            dispatch(clearRegisterState());
        }
    }, [token, navigate, dispatch]);

    useEffect(() => {
        if (refNumFromUrl) {
            dispatch(checkReferral({ reff_code: refNumFromUrl }));
        }
    }, [dispatch, refNumFromUrl]);

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            country: '',
            country_code: '',
            mobile_code: '',
            mobile: '',
            reff_code: refNumFromUrl || '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email(t('Please Enter a Valid Email')).required(t('Please Enter Your Email')),
            password: Yup.string().required(t('Please Enter Your Password')).min(6, t('The password field must be at least 6 characters.')),
            reff_code: Yup.string(), // Optional field
        }),
        onSubmit: (values) => {
            dispatch(registerUser({
                email: values.email,
                password: values.password,
                first_name: "N/A",
                last_name: "N/A",
                country: "N/A",
                country_code: "N/A",
                mobile_code: "N/A",
                mobile: "N/A",
                reff_code: status === true ? values.reff_code : ""
            }));
            document.title = "SignUp | Trading Dashboard";
        }
    });

    return (
        <React.Fragment>
            <div className="auth-page-content mt-5 pt-5">
                <Container>
                    <LanguageSwitcher />
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <div className="text-center mt-sm-5 mb-1 text-white-50">
                                <div>
                                    <Link to="/" className="d-inline-block auth-logo">
                                        <img src={sqlogo} alt="" style={{ width: '250px', maxWidth: '100%' }} />
                                    </Link>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 45, width: '100%', gap: 24 }}>
                                    <Button
                                        style={{
                                            background: location.pathname === "/register"
                                                ? 'linear-gradient(90deg, #c800a1 0%, #7f2ae8 100%)'
                                                : 'transparent',
                                            border: location.pathname === "/register" ? 'none' : '1.5px solid #c800a1',
                                            borderRadius: 30,
                                            color: location.pathname === "/register" ? '#fff' : '#fff',
                                            fontWeight: 600,
                                            width: '46%',
                                            fontSize: 16,
                                            boxShadow: location.pathname === "/register" ? '0 0 30px #c800a155' : 'none',
                                            transition: 'all 0.2s',
                                            padding: '12px 0',
                                            letterSpacing: 1
                                        }}
                                        onClick={() => navigate('/register')}
                                    >
                                        {t('Registration')}
                                    </Button>
                                    <Button
                                        style={{
                                            background: location.pathname === "/register"
                                                ? 'transparent'
                                                : 'linear-gradient(90deg, #c800a1 0%, #7f2ae8 100%)',
                                            border: location.pathname === "/register" ? '1.5px solid #c800a1' : 'none',
                                            borderRadius: 30,
                                            color: location.pathname === "/register" ? '#fff' : '#fff',
                                            fontWeight: 600,
                                            width: '46%',
                                            fontSize: 16,
                                            boxShadow: location.pathname === "/register" ? 'none' : '0 0 30px #c800a155',
                                            transition: 'all 0.2s',
                                            padding: '12px 0',
                                            letterSpacing: 1
                                        }}
                                        onClick={() => navigate('/login')}
                                    >
                                        {t('Login')}
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        <Col md={8} lg={6} xl={5}>
                            <Card className="mt-1 bg-transparent" style={{ boxShadow: 'none', background: 'transparent' }}>
                                <CardBody className="p-0">
                                    <div className="p-2 mt-4">
                                        <Form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                validation.handleSubmit();
                                                return false;
                                            }}
                                            action="#"
                                        >
                                            <div className="mb-3">
                                                <Input
                                                    id="reff_code"
                                                    name="reff_code"
                                                    className="form-control fs-4"
                                                    placeholder={t('Enter Referral Code (optional)')}
                                                    type="text"
                                                    onChange={(e) => {
                                                        validation.handleChange(e);
                                                        debouncedCheckReferral(e.target.value);
                                                    }}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.reff_code || ""}
                                                    style={{ background: 'transparent', border: '1.5px solid #c800a1', borderRadius: 20, color: '#fff', boxShadow: '0 0 10px #c800a133', padding: '10px 18px', fontWeight: 500, height: 48, fontSize: 18 }}
                                                />
                                                {status === true && refName && (
                                                    <small className="text-success">Referred by: {refName} ({refEmail})</small>
                                                )}
                                                {status === false && (
                                                    <small className="text-danger">Invalid Referral Code, can still proceed registering</small>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    className="form-control fs-4"
                                                    placeholder={t('Enter Email')}
                                                    type="email"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.email || ""}
                                                    invalid={validation.touched.email && validation.errors.email ? true : false}
                                                    style={{ background: 'transparent', border: '1.5px solid #c800a1', borderRadius: 20, color: '#fff', boxShadow: '0 0 10px #c800a133', padding: '10px 18px', fontWeight: 500, height: 48, fontSize: 18 }}
                                                />
                                                {validation.touched.email && validation.errors.email ? (
                                                    <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <Input
                                                    name="password"
                                                    type="password"
                                                    placeholder={t('Enter Password')}
                                                    className="form-control fs-4"
                                                    onChange={validation.handleChange}
                                                    onBlur={validation.handleBlur}
                                                    value={validation.values.password || ""}
                                                    invalid={validation.touched.password && validation.errors.password ? true : false}
                                                    style={{ background: 'transparent', border: '1.5px solid #c800a1', borderRadius: 20, color: '#fff', boxShadow: '0 0 10px #c800a133', padding: '10px 18px', fontWeight: 500, height: 48, fontSize: 18 }}
                                                />
                                                {validation.touched.password && validation.errors.password ? (
                                                    <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                ) : null}
                                            </div>
                                            <div className="mt-2">
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Button
                                                        disabled={loading}
                                                        className="justify-content-center fs-5"
                                                        type="submit"
                                                        style={{
                                                            background: 'linear-gradient(90deg, #c800a1 0%, #390452 100%)',
                                                            border: 'none',
                                                            borderRadius: 30,
                                                            color: '#fff',
                                                            fontWeight: 700,
                                                            width: 220,
                                                            boxShadow: '0 0 30px #c800a155',
                                                            padding: '12px 0',
                                                            fontSize: 20,
                                                            letterSpacing: 1
                                                        }}
                                                    >
                                                        {loading ? t('Registering') + '...' : t('Registration')}
                                                    </Button>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                                        <button type="button" style={{
                                                            background: 'linear-gradient(90deg, #c800a1 0%, #7f2ae8 100%)',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            width: 48,
                                                            height: 48,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            boxShadow: '0 0 30px #c800a155',
                                                        }}>
                                                            <GoogleLoginButton />
                                                        </button>
                                                        <button type="button" style={{
                                                            background: 'linear-gradient(90deg, #c800a1 0%, #7f2ae8 100%)',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            width: 48,
                                                            height: 48,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            boxShadow: '0 0 30px #c800a155',
                                                        }}>
                                                            <i className="ri-apple-fill" style={{ color: '#fff', fontSize: 24 }}></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {(errorMessage || fieldErrors.email) && (
                                                <UncontrolledAlert color="danger" className="alert-border-left mt-2 mb-xl-0">
                                                    <i className="ri-error-warning-line me-3 align-middle fs-16"></i>
                                                    <strong>
                                                        {errorMessage}
                                                        {fieldErrors.email && ` - ${fieldErrors.email[0]}`}
                                                    </strong>
                                                </UncontrolledAlert>
                                            )}
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default Register;