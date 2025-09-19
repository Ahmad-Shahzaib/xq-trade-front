import React, { useEffect, useState } from "react";
import { Container, Card, CardBody, Form, Input, Button, Label, Spinner, CardHeader, Badge, Row, Col, FormGroup, FormText } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchTicketDetails, fetchTicketMessages } from "../../../rtk/slices/supportTicketSlices/ticketShowSlice";
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { replyTicket, resetReplyStatus } from "../../../rtk/slices/supportTicketSlices/replyTicketSlice";
import { useTranslation } from "react-i18next";


const STATUS_MAP = {
    0: { label: "Open", color: "warning" },
    1: { label: "Answered", color: "success" },
    2: { label: "Replied", color: "info" },
    3: { label: "Closed", color: "danger" },
};

const TicketShow = () => {
    const { ticketId } = useParams();
    const dispatch = useDispatch();
    const {t} = useTranslation()
    const [files, setFiles] = useState([null])

    const params = useParams();
    const { ticketNumber } = params;

    const { ticket, messages, status, error } = useSelector((state) => state.ticketShow) || {};
    const { replyStatus } = useSelector((state) => state.replyTicket) || {};

    // console.log('replyStatus', replyStatus) // Removed console.log

    const validationSchema = Yup.object({
        message: Yup.string().required('Message is required'),
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

    const formik = useFormik({
        initialValues: {
            message: '',
            newTicketAttachments: []
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const ticketNum = ticket?.ticket
            const ticketData = { message: values.message }; // Correct data format
            dispatch(replyTicket({ ticketNum: ticketNum, ticketData })); // Pass correctly
        }

    })

    useEffect(() => {
        if (replyStatus === "succeeded") {
            dispatch(fetchTicketMessages(ticketId)); // ✅ Fetch only messages
            dispatch(resetReplyStatus()); // ✅ Reset reply status after updating messages
        }
    }, [replyStatus, dispatch, ticketId]);
    


    useEffect(() => {
        if (ticketId && !ticket) {
            dispatch(fetchTicketDetails(ticketId));
        }
    }, [dispatch, ticketId]);


    const handleAddFile = () => {
        if (files.length < 5) {
            setFiles([...files, null])
            formik.setFieldValue('newTicketAttachments', [...formik.values.newTicketAttachments, null])
        }
    }

    const handleFileChange = (e, index) => {
        const newFiles = [...files]
        newFiles[index] = e.target.files[0]
        setFiles(newFiles)

        formik.setFieldValue('newTicketAttachments', newFiles.filter(file => file !== null))
        formik.setFieldTouched('newTicketAttachments', true, false) // Mark the file field as touched
    }
    const handleRemoveFile = (index) => {
        const newFiles = files.filter((_, i) => i !== index)
        setFiles(newFiles)

        formik.setFieldValue('newTicketAttachments', newFiles.filter(file => file !== null))
        formik.setFieldTouched('newTicketAttachments', true, false) // Mark the file field as touched
    }

    return (
        <div className="page-content">
            <Container fluid className="mt-4">
                {status === "loading" && (
                    <div className="text-center my-4">
                        <Spinner color="light" />
                        <p>{t("Loading ticket details...")}</p>
                    </div>
                )}

                {status === "failed" && <p className="text-danger">Error: {error}</p>}

                {/* Show ticket details when loaded */}
                {status === "succeeded" && ticket && (
                    <>

                        <Card>
                            <CardHeader className="d-flex">
                                <div className="d-flex gap-2 align-items-center">
                                    <Badge color={STATUS_MAP[ticket.status]?.color || "dark"}
                                        pill
                                    >
                                        {STATUS_MAP[ticket.status]?.label || "Unknown"}
                                    </Badge>

                                    <h4 className="fw-bold mb-0">[{t("Ticket #")}{ticket.ticket}] {ticket.subject}</h4>
                                </div>

                            </CardHeader>
                            <CardBody>

                                <Form onSubmit={formik.handleSubmit}>


                                    <Row>
                                        <Col xs={12}>
                                            <FormGroup>
                                                <Label htmlFor="message">{t("Message")}</Label>
                                                <Input
                                                    id="message"
                                                    name="message"
                                                    type="textarea"
                                                    value={formik.values.message}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    invalid={formik.touched.message && formik.errors.message}
                                                />
                                                {formik.touched.message && formik.errors.message ? (
                                                    <div className="text-danger">{formik.errors.message}</div>
                                                ) : null}
                                            </FormGroup>
                                        </Col>
                                    </Row>

                                    <Row className="align-items-center">
                                        <Col xs={12}>
                                            <Row className="align-items-center mb-2">
                                                <Col md={8}>
                                                    <div className="d-flex align-items-center gap-1">
                                                        <Label
                                                            htmlFor="newTicketAttachment"
                                                            className="text-muted mb-0"
                                                            style={{ fontSize: '13px' }}
                                                        >
                                                            {t("Attachments")}
                                                        </Label>
                                                        <h6
                                                            className="text-danger mb-0 fw-normal"
                                                            style={{ fontSize: '10px' }}
                                                        >
                                                            {t("Max 5 files can be uploaded. Maximum upload size is 3MB.")}
                                                        </h6>
                                                    </div>
                                                </Col>
                                                <Col md={4} className="text-end">
                                                    <Button
                                                        color="dark"
                                                        className="btn-label"
                                                        onClick={handleAddFile}
                                                        disabled={files.length >= 5} // Disable after 5 files
                                                    >
                                                        <i className="ri-add-line label-icon align-middle fs-16 me-2"></i>
                                                        {t("Add File")}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>

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
                                                    />
                                                    {files.length > 1 && (
                                                        <Button
                                                            className="btn-sm ms-2"
                                                            onClick={() => handleRemoveFile(index)}
                                                        >
                                                            <i className="ri-close-line"></i>
                                                        </Button>
                                                    )}
                                                </div>
                                                {formik.touched.newTicketAttachments?.[index] && formik.errors.newTicketAttachments?.[index] ? (
                                                    <div className="text-danger">{formik.errors.newTicketAttachments[index]}</div>
                                                ) : null}
                                            </FormGroup>
                                        ))}
                                        <FormText>
                                            {t("Allowed File Extensions, .jpg, .jpeg, .png, .pdf, .doc, .docx")}
                                        </FormText>
                                    </Row>

                                    <Button
                                        className='depositButtonLite mt-3'
                                        type="submit"
                                        block
                                        disabled={!(formik.isValid && formik.dirty)}  // Disable if the form is not valid or hasn't been modified
                                    >
                                        {t("Reply")}
                                    </Button>
                                </Form>

                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>




                                {/* Display previous messages */}
                                <div className="mt-4">
                                    {messages.length > 0 ? (
                                        messages.map((msg, index) => (
                                            <Row key={index} className="mb-3 border py-2"> {/* ✅ Ensure each message is in a separate Row */}
                                                <Col md={3} style={{ borderRight: '1px solid grey' }}>
                                                    <h3>{msg.admin}</h3>
                                                </Col>
                                                <Col md={9}>
                                                    <p>{msg.created_at}</p>
                                                    <p>{msg.message}</p>
                                                    <p>
                                                        <i className="ri-file-3-line"></i> {t("Attachments")} {Array.isArray(msg.attachments) ? msg.attachments.length : 0}
                                                    </p>
                                                </Col>
                                            </Row>
                                        ))
                                    ) : (
                                        <p>{t("No messages yet.")}</p>
                                    )}
                                </div>

                            </CardBody>
                        </Card>
                    </>
                )}
            </Container>
        </div>
    );
};

export default TicketShow;