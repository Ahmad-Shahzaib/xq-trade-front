import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, FormText, Input, Label, Row } from 'reactstrap'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from "react-redux";
import * as Yup from 'yup'
import { createSupportTicket } from '../../../rtk/slices/supportTicketSlices/createSupportTicketSlice';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import trading from '../../../assets/images/chartbg.png';
import BackButton from '../../../Layouts/BackButton';
const NewSupportTicket = () => {
    const { t } = useTranslation()

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, success } = useSelector((state) => state.supportTicket);

    const user = JSON.parse(localStorage.getItem('crm-user'))


    const name = user?.user?.name ?? '';
    const email = user?.user?.email || '';

    // State to manage the list of files
    const [files, setFiles] = useState([null])  // Initialize with one file input



    // Validation schema for individual file fields
    const validationSchema = Yup.object({
        subject: Yup.string().required('Subject is required'),
        priority: Yup.string().required('Priority is required'),
        message: Yup.string().required('Message is required'),
        // Add validation for each file input dynamically
        newTicketAttachments: Yup.array().of(
            Yup.mixed()
                .nullable()
                .test('fileSize', 'File is too large', (value) => !value || value.size <= 3145728)
                .test('fileType', 'Unsupported File Format', (value) =>
                    !value || ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type)
                )
        )
        // .min(1, 'At least one file is required')
    })

    // Handle form submission with Formik
    const formik = useFormik({
        initialValues: {
            name: name !== null ? name : '',
            email,
            subject: '',
            priority: '3',
            message: '',
            newTicketAttachments: []  // Initialize with an empty array for file uploads
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {



            const payload = {
                name: values.name,
                email: values.email,
                subject: values.subject,
                priority: values.priority,
                message: values.message
            }

            // console.log('payload st', payload); // Removed console.log


            dispatch(createSupportTicket(payload)).then((response) => {
                if (response.meta.requestStatus === "fulfilled") {
                    const windowWidth = window.innerWidth; // Get window width
                    console.log("Window Width:", windowWidth); // Debugging // Removed console.log

                    if (windowWidth > 768) {
                        navigate("/support-tickets");
                    } else {
                        navigate("/chat");
                    }
                }
            });

        }
    })

    // Handle adding a new file input
    const handleAddFile = () => {
        if (files.length < 5) {
            setFiles([...files, null])
            formik.setFieldValue('newTicketAttachments', [...formik.values.newTicketAttachments, null])
        }
    }

    // Handle file change for each file input
    const handleFileChange = (e, index) => {
        const newFiles = [...files]
        newFiles[index] = e.target.files[0]
        setFiles(newFiles)

        // Update Formik's state with the updated file list
        formik.setFieldValue('newTicketAttachments', newFiles.filter(file => file !== null))
        formik.setFieldTouched('newTicketAttachments', true, false) // Mark the file field as touched
    }

    // Handle file removal
    const handleRemoveFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)

        // Update Formik's state when a file is removed
        formik.setFieldValue('newTicketAttachments', newFiles.filter(file => file !== null))
        formik.setFieldTouched('newTicketAttachments', true, false) // Mark the file field as touched
    }

    return (
        <div className="page-content" style={{
            backgroundImage: `url(${trading})`,
            backgroundSize: 'cover', backgroundPosition: 'center', padding: '20px 0',
            borderRadius: 16, boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
            // height: "94%",
            overflowY: window.innerWidth <= 768 ? 'scroll' : 'auto',
            height: window.innerWidth <= 768 ? 'calc(100% - 10px)' : '89vh',
        }}>
            <BackButton />
            <Container className="d-flex align-items-center justify-content-center"
            
            >
                <Card >
                    <CardHeader style={{
                        background: 'transparent',
                        borderBottom: 'none',
                        textAlign: 'center',
                        paddingTop: '2rem',
                        paddingBottom: 0,
                        color: 'white',

                    }}>
                        <h2 className="mb-0" style={{ color: 'white' }}>
                            <i className="remixicon ri-customer-service-2-line me-2"></i>
                            {t('New Support Ticket')}
                        </h2>
                        <h5 className="mt-2 mb-0" style={{ color: 'white' }}>{t('How can we help you?')}</h5>
                    </CardHeader>
                    <CardBody style={{ paddingTop: '1.5rem', color: 'white' }}>
                        <Form onSubmit={formik.handleSubmit}>
                            {/* ...existing code for form fields... */}
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label htmlFor="name" style={{ color: 'white' }}>{t('Name')}</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            invalid={formik.touched.name && formik.errors.name}
                                            style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(196, 26, 107, 0.1)' }}
                                        />
                                        {formik.touched.name && formik.errors.name ? (
                                            <div className="text-danger" style={{ color: 'white' }}>{formik.errors.name}</div>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label htmlFor="email" style={{ color: 'white' }}>{t('Email')}</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="text"
                                            value={formik.values.email}
                                            disabled
                                            style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(196, 26, 107, 0.1)' }}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label htmlFor="subject" style={{ color: 'white' }}>{t('Subject')}</Label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            type="text"
                                            value={formik.values.subject}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            invalid={formik.touched.subject && formik.errors.subject}
                                            style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(196, 26, 107, 0.1)' }}
                                        />
                                        {formik.touched.subject && formik.errors.subject ? (
                                            <div className="text-danger" style={{ color: 'white' }}>{formik.errors.subject}</div>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label htmlFor="priority" style={{ color: 'white' }}>{t('Priority')}</Label>
                                        <Input
                                            id="priority"
                                            name="priority"
                                            type="select"
                                            value={formik.values.priority}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            invalid={formik.touched.priority && formik.errors.priority}
                                            style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(196, 26, 107, 0.1)' }}
                                        >
                                            <option value="3">{t('High')}</option>
                                            <option value="2">{t('Medium')}</option>
                                            <option value="1">{t('Low')}</option>
                                        </Input>
                                        {formik.touched.priority && formik.errors.priority ? (
                                            <div className="text-danger" style={{ color: 'white' }}>{formik.errors.priority}</div>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <FormGroup>
                                        <Label htmlFor="message" style={{ color: 'white' }}>{t('Message')}</Label>
                                        <Input
                                            id="message"
                                            name="message"
                                            type="textarea"
                                            value={formik.values.message}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            invalid={formik.touched.message && formik.errors.message}
                                            style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(196, 26, 107, 0.1)' }}
                                        />
                                        {formik.touched.message && formik.errors.message ? (
                                            <div className="text-danger" style={{ color: 'white' }}>{formik.errors.message}</div>
                                        ) : null}
                                    </FormGroup>
                                </Col>
                            </Row>
                            {/* File Upload */}
                            <Row className="align-items-center">
                                <Col xs={12}>
                                    <Row className="align-items-center mb-2">
                                        <Col md={8}>
                                            <div className="d-flex align-items-center gap-1">
                                                <Label
                                                    htmlFor="newTicketAttachment"
                                                    className="mb-0"
                                                    style={{ fontSize: '13px', color: 'white' }}
                                                >
                                                    {t('Attachments')}
                                                </Label>
                                                <h6
                                                    className="mb-0 fw-normal"
                                                    style={{ fontSize: '10px', color: 'white' }}
                                                >
                                                    {t('Max 5 files can be uploaded. Maximum upload size is 3MB.')}
                                                </h6>
                                            </div>
                                        </Col>
                                        <Col md={4} className="text-end">
                                            <Button
                                                color="dark"
                                                className="btn-label"
                                                onClick={handleAddFile}
                                                disabled={files.length >= 5}
                                                style={{ background: 'linear-gradient(90deg, #c41a6b, #390452)', color: 'white', border: 'none' }}
                                            >
                                                <i className="ri-add-line label-icon align-middle fs-16 me-2"></i>
                                                {t('Add File')}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                                {/* Render File Inputs Dynamically */}
                                {files.map((file, index) => (
                                    <FormGroup key={index}>
                                        <div className="d-flex align-items-center">
                                            <Input
                                                id={`newTicketAttachment${index}`}
                                                name={`newTicketAttachment${index}`}
                                                type="file"
                                                onChange={(e) => handleFileChange(e, index)}
                                                onBlur={formik.handleBlur}
                                                invalid={formik.touched.newTicketAttachments?.[index] && formik.errors.newTicketAttachments?.[index]}
                                                style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(196, 26, 107, 0.1)' }}
                                            />
                                            {files.length > 1 && (
                                                <Button
                                                    className="btn-sm ms-2"
                                                    onClick={() => handleRemoveFile(index)}
                                                    style={{ background: 'rgba(196,26,107,0.8)', color: 'white', border: 'none' }}
                                                >
                                                    <i className="ri-close-line"></i>
                                                </Button>
                                            )}
                                        </div>
                                        {formik.touched.newTicketAttachments?.[index] && formik.errors.newTicketAttachments?.[index] ? (
                                            <div className="text-danger" style={{ color: 'white' }}>{formik.errors.newTicketAttachments[index]}</div>
                                        ) : null}
                                    </FormGroup>
                                ))}
                                <FormText style={{ color: 'white' }}>
                                    {t('Allowed File Extensions: .jpg, .jpeg, .png, .pdf, .doc, .docx')}
                                </FormText>
                            </Row>
                            {/* Submit Button */}
                            <div className="text-center mt-4">
                                <Button
                                    className='depositButtonLite'
                                    type="submit"
                                    disabled={!(formik.isValid && formik.dirty)}
                                    style={{
                                        background: 'linear-gradient(90deg, #c41a6b, #390452)',
                                        color: 'white',
                                        fontSize: '18px',
                                        padding: '10px 40px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 2px 8px rgba(60,60,120,0.12)'
                                    }}
                                >
                                    {t('Submit')}
                                </Button>
                            </div>
                        </Form>
                        {success && <p className="text-center mt-3" style={{ color: "white", fontWeight: 600 }}>{t('Ticket submitted successfully!')}</p>}
                        {error && <p className="text-center mt-3" style={{ color: "white", fontWeight: 600 }}>{t('something went wrong')}</p>}
                    </CardBody>
                </Card>
            </Container>
        </div>
    )
}

export default NewSupportTicket

