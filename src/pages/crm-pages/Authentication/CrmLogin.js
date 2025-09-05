import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner, ButtonGroup } from 'reactstrap';
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import withRouter from "../../../Components/Common/withRouter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { logoLight } from '../../../utils/config';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../../rtk/slices/crm-slices/auth/authSlice';
import { tradeAccountsList } from '../../../rtk/slices/crm-slices/trade/tradeAccountsList';
import { getUserDashboard } from '../../../rtk/slices/crm-slices/userDashboard/userDashboard';
import { useTranslation } from 'react-i18next';
import GoogleLoginButton from './GoogleLoginButton';
import FacebookLoginButton from './FacebookLoginButton';
import LanguageSwitcher from '../../../Components/LanguageSwitcher';
import sqlogo from "../../../assets/images/xq_logo.png"


const CrmLogin = (props) => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector((state) => state.auth);
    const [passwordShow, setPasswordShow] = useState(false);
    const { tradeAccount } = useSelector((state) => state.tradeAccountsList) || {};
    const { t } = useTranslation();

    const handleSubmit = async (values) => {
        try {
            let token;

            // 🔹 Step 1: Always Call Login API (Even If Token Exists)
            const response = await dispatch(loginUser(values)).unwrap(); // Wait for login response
            token = response?.access_token; // Assuming loginUser returns the token

            if (token) {
                localStorage.setItem("token", token); // ✅ Override previous token
            } else {
                throw new Error("Token not received after login.");
            }

            // 🔹 Step 2: Fetch userDashboard data with New Token
            const userDashboardResponse = await dispatch(getUserDashboard(token)).unwrap();
            const { user, trade_accounts, deposits, withdrawals, commission } = userDashboardResponse;

            // 🔹 Step 3: Handle trade accounts logic
            const localUser = JSON.parse(localStorage.getItem('user')) || {};

            if (!localUser?.account) {
                if (trade_accounts?.length === 1) {
                    localStorage.setItem('user', JSON.stringify({ account: trade_accounts[0]?.account }));
                } else if (trade_accounts?.length > 1) {
                    const latestAccount = trade_accounts.reduce((latest, account) =>
                        new Date(account.created_at) > new Date(latest.created_at) ? account : latest, trade_accounts[0]
                    );
                    localStorage.setItem('user', JSON.stringify({ account: latestAccount.account }));
                }
            }

            // 🔹 Step 4: Store userDashboard data in localStorage
            localStorage.setItem('crm-user', JSON.stringify({ user, trade_accounts, deposits, withdrawals, commission }));

            // 🔹 Step 5: Navigate to dashboard
            navigate('/user-dashboard');

        } catch (error) {
            console.error("Login error:", error);
        }
    };




    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().required(t('Please Enter Your Email')),
            password: Yup.string().required(t('Please Enter Your Password')),
        }),
        onSubmit: (values) => {
            handleSubmit(values);
        }
    });

    document.title = "SignIn | Trading Dashboard";
    return (
        <React.Fragment>
            {/* <ParticlesAuth> */}

            <div className="auth-page-content mt-5 pt-5" >
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
                                            width: "46%",
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
                                            width: "46%",
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
                                            action="#">
                                            <div className="mb-3">
                                                <Input
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
                                                <div className="position-relative auth-pass-inputgroup mb-3 d-flex w-100 align-items-center flex-column">
                                                    <Input
                                                        name="password"
                                                        value={validation.values.password || ""}
                                                        type={passwordShow ? "text" : "password"}
                                                        className="form-control fs-4"
                                                        placeholder={t('Enter Password')}
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        invalid={validation.touched.password && validation.errors.password ? true : false}
                                                        style={{ background: 'transparent', border: '1.5px solid #c800a1', borderRadius: 20, color: '#fff', boxShadow: '0 0 10px #c800a133', padding: '10px 18px', fontWeight: 500, height: 48, fontSize: 18 }}
                                                    />
                                                    <button
                                                        style={{
                                                            display: (validation.touched.password && validation.errors.password) ? "none" : "block",
                                                            background: 'none',
                                                            border: 'none',
                                                            color: '#c800a1',
                                                            right: 20,
                                                            top: 12
                                                        }}
                                                        className="btn h-100 btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                                        type="button" id="password-addon" onClick={() => setPasswordShow(!passwordShow)}>
                                                        <i className="ri-eye-fill align-middle" style={{ fontSize: 20 }}></i>
                                                    </button>
                                                    {validation.touched.password && validation.errors.password ? (
                                                        <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-end mb-2">
                                                <Link to="/forgot-password" style={{ color: "#c800a1", fontWeight: 600 }}>{t('Forgot Password?')}</Link>
                                            </div>
                                            <div className="mt-2">
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Button
                                                        disabled={status === 'loading'}
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
                                                        {status === 'loading' ? <Spinner size="sm" /> : t('Login')}
                                                    </Button>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                                                        {/* Google icon button */}
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
                                                            marginLeft: 0
                                                        }}>
                                                            <GoogleLoginButton />

                                                        </button>
                                                        {/* Apple icon button */}
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
                                                            marginLeft: 0
                                                        }}>
                                                            <i className="ri-apple-fill" style={{ color: '#fff', fontSize: 24 }}></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Form>
                                    </div>
                                </CardBody>
                            </Card>
                            {error && (
                                <Alert color="danger">
                                    {typeof error === 'string' ? error : error.message || 'An error occurred'}
                                </Alert>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
            {/* </ParticlesAuth> */}
        </React.Fragment>
    );
};

export default withRouter(CrmLogin);
