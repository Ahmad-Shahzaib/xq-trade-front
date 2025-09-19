import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, FormFeedback, Spinner, Toast, ToastBody } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createKyc } from '../../../rtk/slices/crm-slices/KYCSlice/KYC_FormSLice';
import { token } from '../../../utils/config';
import { submitKycForm, resetKycSubmission } from '../../../rtk/slices/crm-slices/KYCSlice/KYC_SubmitSlice';
import { invalid } from 'moment';

const formatLabel = (label) => {
    return label
        .replace(/_/g, ' ')
        .replace(/\//g, ' / ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const validateFileExtension = (file, allowedExtensions) => {
    if (!file || !allowedExtensions) return true;
    const fileExt = file.name.split('.').pop().toLowerCase();
    return allowedExtensions.split(',').map(ext => ext.trim().toLowerCase()).includes(fileExt);
};

const KYC = () => {
    const [showToast, setShowToast] = useState(false);

    const dispatch = useDispatch();
    const { form, pageTitle,errorKycForm } = useSelector((state) => state.kyc);
    const { loading, success, error } = useSelector((state) => state.kycSubmit);
    const formData = form?.form_data || {};


    // console.log('errorKycForm',errorKycForm); // Removed console.log
    
    useEffect(() => {
        if (token) dispatch(createKyc(token));
    }, [token]);

    const initialValues = {};
    const validationSchemaShape = {};

    Object.entries(formData).forEach(([key, field]) => {
        initialValues[key] = '';
        const label = formatLabel(key);

        if (field.type === 'file') {
            validationSchemaShape[key] = field.is_required === 'required'
                ? Yup.mixed()
                    .required(`${label} is required`)
                    .test(
                        'fileFormat',
                        `${label} must be of type: ${field.extensions}`,
                        (file) => validateFileExtension(file, field.extensions)
                    )
                : Yup.mixed().test(
                    'fileFormat',
                    `${label} must be of type: ${field.extensions}`,
                    (file) => validateFileExtension(file, field.extensions)
                );
        } else {
            validationSchemaShape[key] = field.is_required === 'required'
                ? Yup.string().required(`${label} is required`)
                : Yup.string();
        }
    });

    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object(validationSchemaShape),
        onSubmit: (values) => {
            const formDataToSend = new FormData();
            // console.log('Submitted KYC values:', values); // Removed console.log
            Object.entries(values).forEach(([key, value]) => {
                if (value instanceof File) {
                    formDataToSend.append(key, value);
                } else {
                    formDataToSend.append(key, value);
                }
            });

            dispatch(submitKycForm({ formData: formDataToSend, token }));
        },
    });

    useEffect(() => {
        if (success) {
            setShowToast(true);

            const timer = setTimeout(() => {
                setShowToast(false);
                dispatch(resetKycSubmission());
            }, 3000);


            return () => clearTimeout(timer);
        }
    }, [success]);

    return (
        <div className="page-content">
            <Container fluid>
                <h4 className="mb-4">{pageTitle || 'KYC Form'}</h4>
                <Form onSubmit={formik.handleSubmit}>
                    <Row>
                        {Object.entries(formData).map(([key, field]) => (
                            <Col md={6} xs={12} key={key} className="mb-3">
                                <FormGroup>
                                    <Label for={key}>{formatLabel(field.label)}</Label>
                                    {field.type === 'select' ? (
                                        <Input
                                            id={key}
                                            name={key}
                                            type="select"
                                            value={formik.values[key]}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            invalid={formik.touched[key] && !!formik.errors[key]}
                                        >
                                            <option value="">Select</option>
                                            {field.options.map((option) => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </Input>
                                    ) : field.type === 'file' ? (<>
                                        <Input
                                            id={key}
                                            name={key}
                                            type="file"
                                            onChange={(event) => {
                                                formik.setFieldValue(key, event.currentTarget.files[0]);
                                            }}
                                            onBlur={formik.handleBlur}
                                            invalid={formik.touched[key] && !!formik.errors[key]}
                                        />
                                        {!invalid? `file should be in ${field.extensions} format`: null}
                                    </>) : (
                                        <Input
                                            id={key}
                                            name={key}
                                            type={field.type}
                                            value={formik.values[key]}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            invalid={formik.touched[key] && !!formik.errors[key]}
                                        />
                                    )}
                                    {formik.touched[key] && formik.errors[key] && (
                                        <FormFeedback>{formik.errors[key]}</FormFeedback>
                                    )}
                                </FormGroup>
                            </Col>
                        ))}
                        <Col xs={12}>
                            <Button color="primary" type="submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Spinner size="sm" className="me-2" /> Submitting...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </Col>
                    </Row>
                </Form>
                {showToast && (
                    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999 }}>
                        <Toast isOpen>
                            <ToastBody className="bg-success text-white">
                                KYC form submitted successfully
                            </ToastBody>
                        </Toast>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default KYC;