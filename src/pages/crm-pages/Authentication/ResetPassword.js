import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Row, Col, Card, CardBody, FormGroup, Input, Button, Spinner, } from "reactstrap";
import '../../../i18n';
import LanguageSwitcher from "../../../Components/LanguageSwitcher";
import { logoLight } from '../../../utils/config';
import { useDispatch, useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { clearMessages, resetPasswordValues } from "../../../rtk/slices/resetPasswordSlice/resetPasswordValuesSlice";
import BackButton from "../../../Layouts/BackButton";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const code = searchParams.get('code');

  const { loading, successMessage, errorMessage } = useSelector((state) => state.resetPasswordValues);


  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const { t } = useTranslation();
  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    // currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      // .min(4, t('Password must be at least 8 characters'))
      // .matches(/[A-Z]/, t('Must contain at least one uppercase letter'))
      // .matches(/[0-9]/, t('Must contain at least one number'))
      // .matches(/[!@#$%^&*]/, t('Must contain at least one special character'))
      .required(t('New password is required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t('Password does not match'))
      .required(t('Confirm password is required')),
  });

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000); // 2 seconds
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);


  return (
    <div className="auth-page-content mt-5 pt-5">
      <Container fluid>
      <BackButton />

        <Row className="justify-content-center">
          <Col xs={12} md={8} xl={7}>
            <div className="text-center mt-sm-5 mb-1 text-white-50">
              <div>
                <Link to="/" className="d-inline-block auth-logo">
                  <img src={logoLight} alt="" style={{ width: '55%' }} />
                </Link>
              </div>
              <h2 className="fw-bold mt-4">{t('Reset Password')}</h2>

            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="mt-1 bg-transparent">
              <CardBody className="p-0">
                <div className="p-2 mt-4">
                  <Formik
                    initialValues={{
                      email: email,
                      code: code,
                      newPassword: "",
                      confirmPassword: "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                      // console.log("Passwords:", values); // Removed console.log
                      dispatch(resetPasswordValues({
                        email,
                        code,
                        password: values.newPassword,
                        password_confirmation: values.confirmPassword
                      }))
                    }}
                  >
                    {({ errors, touched }) => (
                      <Form>
                        <FormGroup>
                          <div className="position-relative">
                            <Input
                              type="email"
                              name="email"
                              id="email"
                              value={email}
                              readOnly
                              placeholder="Enter your email"
                              className={errors.email && touched.email ? "is-invalid" : ""}
                            />
                          </div>
                        </FormGroup>

                        <FormGroup>
                          <div className="position-relative">
                            <Input
                              type="code"
                              name="code"
                              id="code"
                              value={code}
                              readOnly
                              placeholder="Enter your code"
                              className={errors.code && touched.code ? "is-invalid" : ""}
                            />
                          </div>
                        </FormGroup>

                        {/* New Password */}
                        <FormGroup>
                          {/* <Label for="newPassword">New Password</Label> */}
                          <div className="position-relative">
                            <Field
                              as={Input}
                              type={showPassword.newPassword ? "text" : "password"}
                              name="newPassword"
                              id="newPassword"
                              placeholder={t('Enter new password')}
                              className={errors.newPassword && touched.newPassword ? "is-invalid" : ""}
                            />
                            <i
                              className={`ri-eye${showPassword.newPassword ? "-off" : ""}-line position-absolute end-0 top-50 translate-middle-y me-2 cursor-pointer`}
                              onClick={() => togglePasswordVisibility("newPassword")}
                            ></i>
                            <ErrorMessage name="newPassword" component="div" className="text-danger mt-1" />
                          </div>
                        </FormGroup>

                        {/* Confirm Password */}
                        <FormGroup>
                          {/* <Label for="confirmPassword">Confirm Password</Label> */}
                          <div className="position-relative">
                            <Field
                              as={Input}
                              type={showPassword.confirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              id="confirmPassword"
                              placeholder={t('Confirm new password')}
                              className={errors.confirmPassword && touched.confirmPassword ? "is-invalid" : ""}
                            />
                            <i
                              className={`ri-eye${showPassword.confirmPassword ? "-off" : ""}-line position-absolute end-0 top-50 translate-middle-y me-2 cursor-pointer`}
                              onClick={() => togglePasswordVisibility("confirmPassword")}
                            ></i>
                            <ErrorMessage name="confirmPassword" component="div" className="text-danger mt-1" />
                          </div>
                        </FormGroup>

                        <Button className="depositButtonLite" block type="submit" disabled={loading}>
                          {loading ? (
                            <>
                              <Spinner size="sm" color="light" className="me-2" />
                              {t('Processing...')}
                            </>
                          ) : (
                            t('Reset Password')
                          )}
                        </Button>

                      </Form>
                    )}
                  </Formik>

                  <p className="mt-3">Remember your password? <Link to='/' className="text-secondary fw-bold">Back to Terminal</Link></p>
                </div>
              </CardBody>

              {successMessage && (
                <div className="alert alert-success mt-3" role="alert">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="alert alert-danger mt-3" role="alert">
                  {errorMessage}
                </div>
              )}

            </Card>
          </Col>
        </Row>




      </Container>
    </div>
  );
};

export default ResetPassword;