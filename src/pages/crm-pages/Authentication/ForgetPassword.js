import PropTypes from "prop-types";
import React from "react";
import { Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form } from "reactstrap";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import withRouter from "../../../Components/Common/withRouter";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

import { useTranslation } from 'react-i18next';
import { logoLight } from "../../../utils/config";
import { resetPassword } from "../../../rtk/slices/resetPasswordSlice/resetSlice";
import sqlogo from "../../../assets/images/xq_logo.png"


const ForgetPasswordPage = props => {
  // const dispatch = useDispatch();
  const dispatch = useDispatch();
  const { loading, successMessage, errorMessage } = useSelector((state) => state.resetPassword);
  const { t } = useTranslation();
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required(t('Please Enter Your Email')),
    }),
    onSubmit: (values, { resetForm }) => {
      // console.log('forget password:', values); // Removed console.log
      dispatch(resetPassword(values)).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          resetForm();
        }
      })
    }
  });



  document.title = "Reset Password | Forex";
  return (
    // <ParticlesAuth>
    <div className="auth-page-content mt-5 pt-5">

      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} xl={7}>
            <div className="text-center mt-sm-5  text-white-50">
              <div>
                <Link to="/" className="d-inline-block auth-logo">
                  <img src={sqlogo} alt="" style={{ width: '250px', maxWidth: '100%' }} />
                </Link>
              </div>
            </div>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="mt-4 ">
              {/* <LanguageSwitcher /> */}
              <CardBody className="p-4">
                <Alert
                  className="border-0 text-center mb-2 mx-2"
                  role="alert"
                  color="secondary"
                  style={{
                    background: 'transparent',
                    border: '1.5px solid #c800a1',
                    borderRadius: 20,
                    color: '#fff',
                    boxShadow: '0 0 10px #c800a133',
                    padding: '10px 18px',
                    fontWeight: 300,
                    fontSize: 16
                  }}
                >
                  {t('Enter your email and instructions will be sent to you!')}
                </Alert>
                <div className="p-2">
                  {/* {forgetError && forgetError ? (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {forgetError}
                      </Alert>
                    ) : null}
                    {forgetSuccessMsg ? (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {forgetSuccessMsg}
                      </Alert>
                    ) : null} */}
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <div className="mb-4">
                      <Label className="form-label">{t('Email')}</Label>
                      <Input
                        name="email"
                        className="form-control"
                        placeholder={t('Enter Email')}
                        type="email"
                        style={{ background: 'transparent', border: '1.5px solid #c800a1', borderRadius: 20, color: '#fff', boxShadow: '0 0 10px #c800a133', padding: '10px 18px', fontWeight: 500, height: 48, fontSize: 18 }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ""}
                        invalid={
                          validation.touched.email && validation.errors.email ? true : false
                        }
                      />
                      {validation.touched.email && validation.errors.email ? (
                        <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                      ) : null}
                    </div>

                    <div className="text-center mt-4">
                      <button className=""
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
                        type="submit">{t('Send Reset Link')}</button>
                    </div>
                  </Form>
                </div>
                <div className="mt-4 text-center">
                  <p className="mb-0">{t('Wait, I remember my password')}... <Link to="/login" className="fw-semibold text-secondary text-decoration-underline"> {t('Click here')} </Link> </p>
                </div>
              </CardBody>
            </Card>

            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          </Col>
        </Row>
      </Container>
    </div>
    // </ParticlesAuth>
  );
};

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);