import React, { useCallback, useEffect } from "react";
import { Row, Col, Card, Container, Input, Form, FormFeedback, Label, Button } from "reactstrap";
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
import { PhoneNumberUtil } from 'google-libphonenumber';
import countryList from 'react-select-country-list';
import AuthSlider from '../authCarousel';

const Register = () => {
    const phoneUtil = PhoneNumberUtil.getInstance();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();

    const { loading, token, errorMessage, fieldErrors } = useSelector((state) => state.register);
    const { fullname: refName, email: refEmail, errorMessage: refError, status } = useSelector((state) => state.checkReferral);

    const countryOptions = countryList().getData().map(country => ({
        value: country.value,
        label: country.label,
        mobileCode: `+${phoneUtil.getCountryCodeForRegion(country.value)}`
    }));

    const queryParams = new URLSearchParams(location.search);
    const refNumFromUrl = queryParams.get('reff_code');

    const debouncedCheckReferral = useCallback(
        debounce((value) => {
            dispatch(checkReferral({ reff_code: value }));
        }, 500),
        [dispatch]
    );

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
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
            reff_code: refNumFromUrl || '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email(t('Please Enter a Valid Email')).required(t('Please Enter Your Email')),
            password: Yup.string().required(t('Please Enter Your Password')).min(6, t('The password field must be at least 6 characters.')),
            reff_code: Yup.string(),
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
            <div className="auth-page-wrapper auth-bg-cover py-5 d-flex justify-content-center align-items-center min-vh-100">
                <div className="bg-overlay"></div>
                <div className="auth-page-content overflow-hidden pt-lg-5">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <Card className="overflow-hidden">
                                    <Row className="justify-content-center g-0">
                                        <AuthSlider />
                                        <Col lg={6}>
                                            <div className="p-lg-5 p-4">
                                                <h5 className="text-primary">{t('Register Account')}</h5>
                                                <p className="text-muted">{t('Create your account with Velzon')}</p>

                                                <div className="mt-2 text-center">
                                                    <lord-icon
                                                        src="https://cdn.lordicon.com/rhvddzym.json"
                                                        trigger="loop"
                                                        colors="primary:#0ab39c"
                                                        className="avatar-xl"
                                                        style={{ width: "120px", height: "120px" }}
                                                    ></lord-icon>
                                                </div>

                                                <div className="alert border-0 alert-warning text-center mb-2 mx-2" role="alert">
                                                    {t('Enter your details to create an account!')}
                                                </div>

                                                <div className="p-2">
                                                    <Form
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            validation.handleSubmit();
                                                            return false;
                                                        }}
                                                    >
                                                        <div className="mb-4">
                                                            <Label className="form-label">{t('Referral Code (optional)')}</Label>
                                                            <Input
                                                                id="reff_code"
                                                                name="reff_code"
                                                                className="form-control"
                                                                placeholder={t('Enter Referral Code (optional)')}
                                                                type="text"
                                                                onChange={(e) => {
                                                                    validation.handleChange(e);
                                                                    debouncedCheckReferral(e.target.value);
                                                                }}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.reff_code || ""}
                                                            />
                                                            {status === true && refName && (
                                                                <small className="text-success">{t('Referred by')}: {refName} ({refEmail})</small>
                                                            )}
                                                            {status === false && (
                                                                <small className="text-danger">{t('Invalid Referral Code, can still proceed registering')}</small>
                                                            )}
                                                        </div>
                                                        <div className="mb-4">
                                                            <Label className="form-label">{t('Email')}</Label>
                                                            <Input
                                                                id="email"
                                                                name="email"
                                                                className="form-control"
                                                                placeholder={t('Enter Email')}
                                                                type="email"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.email || ""}
                                                                invalid={validation.touched.email && validation.errors.email ? true : false}
                                                            />
                                                            {validation.touched.email && validation.errors.email ? (
                                                                <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                                                            ) : null}
                                                        </div>
                                                        <div className="mb-4">
                                                            <Label className="form-label">{t('Password')}</Label>
                                                            <Input
                                                                name="password"
                                                                type="password"
                                                                placeholder={t('Enter Password')}
                                                                className="form-control"
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.password || ""}
                                                                invalid={validation.touched.password && validation.errors.password ? true : false}
                                                            />
                                                            {validation.touched.password && validation.errors.password ? (
                                                                <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                            ) : null}
                                                        </div>
                                                        <div className="text-center mt-4">
                                                            <Button
                                                                color="success"
                                                                className="w-100"
                                                                type="submit"
                                                                disabled={loading}
                                                            >
                                                                {loading ? t('Registering') + '...' : t('Register')}
                                                            </Button>
                                                        </div>
                                                        <div className="mt-3 text-center">
                                                            <div className="d-flex justify-content-center gap-2">
                                                                <div className="btn btn-outline-secondary btn-icon">
                                                                    <GoogleLoginButton />
                                                                </div>
                                                                <button type="button" className="btn btn-outline-secondary btn-icon">
                                                                    <i className="ri-apple-fill" style={{ fontSize: 24 }}></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {(errorMessage || fieldErrors.email) && (
                                                            <div className="alert border-0 alert-danger text-center mt-2 mb-0" role="alert">
                                                                {errorMessage}
                                                                {fieldErrors.email && ` - ${fieldErrors.email[0]}`}
                                                            </div>
                                                        )}
                                                    </Form>
                                                </div>
                                                <div className="mt-5 text-center">
                                                    <p className="mb-0">
                                                        {t('Already have an account?')} <Link to="/auth-signin-cover" className="fw-bold text-primary text-decoration-underline">{t('Sign in')}</Link>
                                                    </p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
                <footer className="footer">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center">
                                    <p className="mb-0">© {new Date().getFullYear()} Velzon. Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </footer>
            </div>
        </React.Fragment>
    );
};

export default Register;