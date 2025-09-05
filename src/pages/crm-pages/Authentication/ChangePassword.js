import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import '../../../i18n';
import LanguageSwitcher from "../../../Components/LanguageSwitcher";

import { useTranslation } from 'react-i18next';
import trading from '../../../assets/images/chartbg.png';
import BackButton from "../../../Layouts/BackButton";

const ChangePassword = () => {
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
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
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .min(8, t('Password must be at least 8 characters'))
      .matches(/[A-Z]/, t('Must contain at least one uppercase letter'))
      .matches(/[0-9]/, t('Must contain at least one number'))
      .matches(/[!@#$%^&*]/, t('Must contain at least one special character'))
      .required(t('New password is required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], t('Password does not match'))
      .required(t('Confirm password is required')),
  });

  return (
    <div className="page-content"
      style={{
        backgroundImage: `url(${trading})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        borderRadius: 16, boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
        height: "89vh",
        padding: "15px"

      }}
    >
      <BackButton />
      <Container fluid style={{
        marginTop: "25px"

      }}>

        <h4 className="mb-4">{t('Reset Password')}</h4>
        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log("Passwords:", values);
          }}
        >
          {({ errors, touched }) => (
            <Form>
              {/* Current Password */}
              <FormGroup>
                {/* <Label for="currentPassword">Current Password</Label> */}
                <div className="position-relative">
                  <Field
                    as={Input}
                    type={showPassword.currentPassword ? "text" : "password"}
                    name="currentPassword"
                    id="currentPassword"
                    placeholder={t('Enter current password')}
                    className={errors.currentPassword && touched.currentPassword ? "is-invalid" : ""}
                  />
                  <i
                    className={`ri-eye${showPassword.currentPassword ? "-off" : ""}-line position-absolute end-0 top-50 translate-middle-y me-2 cursor-pointer`}
                    onClick={() => togglePasswordVisibility("currentPassword")}
                  ></i>
                  <ErrorMessage name="currentPassword" component="div" className="text-danger mt-1" />
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

              <Button className=""
                style={{
                  background: "linear-gradient(90deg, #c41a6b, #390452)",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 28px",
                  fontWeight: 600,
                  fontSize: 18,
                  boxShadow: "0 2px 8px rgba(196,26,107,0.10)",
                  color: "#fff"

                }}
                block type="submit">
                {t('Reset Password')}
              </Button>
            </Form>
          )}
        </Formik>

      </Container>
    </div>
  );
};

export default ChangePassword;
