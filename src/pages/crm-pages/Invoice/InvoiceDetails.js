import React from "react";
import { CardBody, Row, Col, Card, Table, CardHeader, Container, CardTitle } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Link } from "react-router-dom";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// import logoDark from "../../../assets/images/logo-dark.png";
// import logoLight from "../../../assets/images/logo-light.png";

const logoLight = "https://portal.xqtrades.com/assets/images/logoIcon/logo.png"
const logoDark = "https://portal.xqtrades.com/assets/images/logoIcon/logo.png"

const InvoiceDetails = ({ type, user, selectedRecord }) => {
  //Print the Invoice
  const printInvoice = () => {
    window.print();
  };

  // Download the Invoice as PDF
  //  const downloadPDF = async () => {
  //   const element = document.getElementById("demo"); // The card's root element
  //   const canvas = await html2canvas(element); // Render the element as a canvas
  //   const imgData = canvas.toDataURL("image/png"); // Convert the canvas to an image

  //   const pdf = new jsPDF("p", "mm", "a4"); // Create a new jsPDF instance
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight); // Add the image to the PDF
  //   pdf.save(`${type}_Invoice_${selectedRecord.trx}.pdf`); // Save the PDF
  // };


  return (

    <Row className="justify-content-center">
      <Col xs={12}>
        <Card id="demo">
          <Row>
            <Col lg={12}>
              <CardHeader className="border-bottom-dashed p-4">
                <CardTitle>{type} Invoice</CardTitle>
                <div className="d-flex flex-wrap">
                  <div className="flex-grow-1">
                    <img
                      src={logoDark}
                      className="card-logo card-logo-dark"
                      alt="logo dark"
                      height="47"
                    />
                    <img
                      src={logoLight}
                      className="card-logo card-logo-light"
                      alt="logo light"
                      height="47"
                    />
                    <div className="mt-sm-3 mt-4">
                      <h6 className="text-muted text-uppercase fw-bold">
                        Company Name
                      </h6>
                    </div>
                    <h6>
                      <span className="text-muted fw-normal">Email:</span>{" "}
                      <span id="email">app@portal.xqtrades.com</span>
                    </h6>
                    <h6>
                      <span className="text-muted fw-normal">Website:</span>{" "}
                      <Link to="#" className="link-primary" id="website">
                        https://app.portal.xqtrades.com/
                      </Link>
                    </h6>
                  </div>
                  <div className="flex-shrink-0 mt-sm-0 mt-3">
                    <h6 className="text-muted fs-2 fw-bold">
                      Client Details
                    </h6>


                    <h6 className="mb-1">
                      <span className="text-muted fw-normal">Name:</span>{" "}
                      <span id="contact-no"> {`${user.firstname} ${user.lastname}`}</span>
                    </h6>
                    <h6 className="mb-1">
                      <span className="text-muted fw-normal">Email:</span>{" "}
                      <span id="contact-no"> {user.email}</span>
                    </h6>
                    <h6 className="mb-0">
                      <span className="text-muted fw-normal">Adress:</span>{" "}
                      <span id="contact-no"> {`${user.address?.address},${user.address?.city}`}</span>
                    </h6>
                  </div>
                </div>
              </CardHeader>
            </Col>
            <Col lg={12}>
              <CardBody className="px-4 py-2">
                <Row className="g-3 justify-content-between">
                  <Col lg={3} xs={6}>
                    <p className="text-muted mb-2 text-uppercase fw-semibold">
                      Invoice No
                    </p>
                    <h5 className="fs-14 mb-0">#<span id="invoice-no" className="text-primary">{selectedRecord.trx}</span></h5>
                  </Col>
                  <Col lg={3} xs={6} >
                    <p className="text-muted mb-2 text-uppercase fw-semibold">
                      Date
                    </p>
                    <h5 className="fs-14 mb-0">
                      <span id="invoice-date">
                        {new Date(selectedRecord.created_at).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <small className="text-muted" id="invoice-time"> {' '}
                        {new Date(selectedRecord.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: false, // Use 24-hour format
                        })}
                      </small>
                    </h5>
                  </Col>
                  <Col lg={3} xs={6} >
                    <p className="text-muted mb-2 text-uppercase fw-semibold">
                      Payment Status
                    </p>
                    <span
                      className={`badge  fs-11 ${selectedRecord.status === 2 ? "bg-warning-subtle text-warning" : "bg-success-subtle text-success"
                        }`}
                      id="payment-status"
                    >
                      {selectedRecord.status === 2 ? "Pending" : "Success"}
                    </span>
                  </Col>
                </Row>
              </CardBody>
            </Col>

            <Col lg={12}>
              <CardBody className="p-4 pt-1">

                <div className="border-top border-top-dashed mt-2">
                  <Table className="table table-borderless table-nowrap align-middle mb-0 ms-auto" >
                    <tbody>
                      <tr>
                        <td>Initial Amount</td>
                        <td className="text-end">{Number(selectedRecord.amount)}</td>
                      </tr>
                      <tr>
                        <td>Tax Charged</td>
                        <td className="text-end">{Number(selectedRecord.charge)}</td>
                      </tr>
                      <tr>
                        <td>Currency</td>
                        <td className="text-end">{
                          type === "Withdrawal" ?
                            `${selectedRecord.currency}` :
                            type === "Deposit" ?
                              `${selectedRecord.method_currency}` :
                              ""
                        }</td>
                      </tr>
                      {
                        type === 'Withdrawal' ?
                          <tr>
                            <td>Change rate</td>
                            <td className="text-end">{Number(selectedRecord.rate)}</td>
                          </tr> : <></>
                      }

                      <tr className="border-top border-top-dashed fs-15">
                        <th scope="row">Total Amount</th>
                        <th className="text-end">{
                          type === "Withdrawal" ?
                            `${Number(selectedRecord.final_amount)}` :
                            type === "Deposit" ?
                              `${Number(selectedRecord.final_amo)}` :
                              ""
                        }</th>
                      </tr>
                    </tbody>
                  </Table>
                </div>
                {/* <div className="mt-3">
                  <h6 className="text-muted text-uppercase fw-semibold mb-3">
                    Payment Details:
                  </h6>
                  <p className="text-muted mb-1">
                    Payment Method:{" "}
                    <span className="fw-medium" id="payment-method">Mastercard</span>
                  </p>
                  <p className="text-muted mb-1">
                    Card Holder:{" "}
                    <span className="fw-medium" id="card-holder-name">David Nichols</span>
                  </p>
                  <p className="text-muted mb-1">
                    Card Number:{" "}
                    <span className="fw-medium" id="card-number">xxx xxxx xxxx 1234</span>
                  </p>
                  <p className="text-muted">
                    Total Amount: <span className="fw-medium" id="">$755.96</span>
                  </p>
                </div> */}
                {/* <div className="mt-4">
                  <div className="alert alert-info">
                    <p className="mb-0">
                      <span className="fw-semibold">NOTES:</span>
                      <span id="note"> All accounts
                        are to be paid within 7 days from receipt of invoice. To
                        be paid by cheque or credit card or direct payment online.
                        If account is not paid within 7 days the credits details
                        supplied as confirmation of work undertaken will be
                        charged the agreed quoted fee noted above.
                      </span>
                    </p>
                  </div>
                </div> */}
                <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                  <Link
                    to="#"
                    onClick={printInvoice}
                    className="btn btn-success"
                  >
                    <i className="ri-printer-line align-bottom me-1"></i> Print
                  </Link>
                  <Link to="#" className="btn btn-primary">
                    <i className="ri-download-2-line align-bottom me-1"></i>{" "}
                    Download
                  </Link>
                </div>
              </CardBody>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row >


  );
};

export default InvoiceDetails;
