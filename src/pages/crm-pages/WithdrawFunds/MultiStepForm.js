import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createWithdraw } from "../../../rtk/slices/crm-slices/withdraw/getWithdrawFormSlice";
import { token } from "../../../utils/config";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Toast, ToastBody, ToastHeader, Button, FormGroup, Label, Input, Row, Col, Spinner, Alert } from "reactstrap"; // Import Reactstrap components
import Step1Component from "./Step1Component";
import Step2Component from "./Step2Component";
import { stepOneSubmit } from "../../../rtk/slices/crm-slices/withdraw/stepOneFormSubmitSlice";
import { stepTwoSubmit } from "../../../rtk/slices/crm-slices/withdraw/stepTwoFormSubmitSlice";
import { fetchWalletList } from "../../../rtk/slices/walletListSlice/walletListSlice";
import { useTranslation } from "react-i18next";
// Helper function to validate file type
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];


const MultiStepForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { withdrawMethods, tradeAccounts, status, error } = useSelector((state) => state.withdraw);
  const { walletList } = useSelector((state) => state.walletList);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState("trade_account");

  const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [gateway, setGateway] = useState("");
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const [loading, setLoading] = useState(false)

  const [selectWallet, setSelectWallet] = useState(null)

  // useEffect(() => {
  //   dispatch(stepOneSubmit(token)); // Ensure initial data is loaded
  // }, [dispatch]);

  // useEffect(() => {
  //   dispatch(stepTwoSubmit(token)); // Ensure initial data is loaded
  // }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchWalletList({ token }));
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(createWithdraw(token)); // Ensure data is loaded
  }, [dispatch]);

  useEffect(() => {
    if (selectedWithdrawMethod) {
      setGateway(selectedWithdrawMethod.name);
    }
  }, [selectedWithdrawMethod]);

  const handleWithdrawMethodChange = (methodId) => {
    const selectedMethod = withdrawMethods.find((method) => method.id === parseInt(methodId));
    setSelectedWithdrawMethod(selectedMethod);


  };

  const handleWalletMethodChange = (event) => {
    const walletId = event.target.value ? parseInt(event.target.value, 10) : null;

    if (!walletId) {
      console.log("Invalid Wallet ID:");
      setSelectWallet(null);
      return;
    }

    const selectedWallet = walletList.find(wallet => wallet.id === walletId);
    setSelectWallet(selectedWallet);


  };
  // Handle account change
  const handleAccountChange = (e) => {
    const accountId = e.target.value;
    setSelectedAccount(tradeAccounts.find(account => account.id === parseInt(accountId)));
  };

  const handleAmountChange = (e) => {
    const amountValue = e.target.value
    setAmount(amountValue)
  }

  // Validation Schema
  const step1ValidationSchema = Yup.object({
    withdrawMethod: Yup.string().required(t("Withdrawal method is required.")),

    account: Yup.string().when("activeTab", {
      is: "trade_account", // Validate only if activeTab is "trade_account"
      then: (schema) =>
        schema
          .required(t("Account selection is required."))
          .test("marginFreeCheck", t("Selected account has no margin free."), function (value) {
            const selectedAccount = tradeAccounts.find((account) => account.id === parseInt(value));
            return selectedAccount ? selectedAccount.balance > 0 : true;
          }),
      otherwise: (schema) => schema.notRequired(), // Skip validation if activeTab is not "trade_account"
    }),

    wallet: Yup.string().when("activeTab", {
      is: "wallet", // Validate only if activeTab is "wallet"
      then: (schema) =>
        schema
          .required(t("Wallet selection is required."))
          .test("balanceCheck", t("Selected wallet has no balance."), function (value) {
            const selectedWallet = walletList.find((wallet) => wallet.id === parseInt(value));
            return selectedWallet ? selectedWallet.balance > 0 : true;
          }),
      otherwise: (schema) => schema.notRequired(), // Skip validation if activeTab is not "wallet"
    }),

    amount: Yup.number()
      .required(t("Amount is required."))
      .positive(t("Amount must be greater than 0."))
      .test("maxBalance", t("Amount must be less than or equal to available balance."), function (value) {
        if (!value) return false;

        if (this.parent.activeTab === "trade_account") {
          const selectedAccount = tradeAccounts.find((account) => account.id === parseInt(this.parent.account));
          return selectedAccount ? value <= selectedAccount.balance : true;
        } else if (this.parent.activeTab === "wallet") {
          const selectedWallet = walletList.find((wallet) => wallet.id === parseInt(this.parent.wallet));
          return selectedWallet ? value <= selectedWallet.balance : true;
        }

        return true;
      }),
  });



  const step2ValidationSchema = Yup.object({
    ...selectedWithdrawMethod?.form?.form_data &&
    Object.keys(selectedWithdrawMethod.form.form_data).reduce((acc, key) => {
      const field = selectedWithdrawMethod.form.form_data[key];

      if (field.is_required === "required") {
        if (field.type === "file") {
          // Validation for file type
          acc[key] = Yup.mixed()
            .required(`${field.label} is required.`)
            .test(
              "fileType",
              "Only JPG, JPEG, and PNG files are allowed",
              (value) => {
                if (!value) return false; // Ensure the file is provided
                return SUPPORTED_FORMATS.includes(value.type);
              }
            );
        } else {
          // Default validation for other fields
          acc[key] = Yup.string().required(`${field.label} is required.`);
        }
      }

      return acc;
    }, {}),
  });




  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = async (values, { setSubmitting }) => {
    const payload = {
      method_code: values.withdrawMethod,
      amount: values.amount,
      trade_account: activeTab === "trade_account" ? values.account : values.wallet,
      from: activeTab === "trade_account" ? "trade_account" : "wallet",
      barrier: token, // Include the barrier token
    };

    try {
      const response = await dispatch(stepOneSubmit(payload)).unwrap();
      setFormData((prevData) => ({
        ...prevData,
        ...values,
      }));
      setCurrentStep(2);
    } catch (err) {
      setToast({ visible: true, message: err.message || "Error in Step 1", type: "danger" });
      console.error("Error submitting Step 1:", err);
      setSubmitting(false);

    }
  };


  const handlePreviousStep = () => {
    setCurrentStep(1);
  };





  const handleSubmit = async (values) => {
    const finalData = { ...values };

    const formData = new FormData();
    for (const key in finalData) {
      if (key === 'upi_qr_code' && finalData[key] instanceof File) {
        formData.append(key, finalData[key]);
      } else {
        formData.append(key, finalData[key]);
      }
      setLoading(true);
    }

    try {
      const response = await dispatch(stepTwoSubmit(formData)).unwrap();
      setToast({ visible: true, message: response.message, type: "success" });

      setTimeout(() => {
        navigate("/withdraw-funds/history"); // Navigate after showing the toast
      }, 3000);
    } catch (err) {
      setToast({ visible: true, message: err.response?.data?.message || err.message, type: "danger" });
      console.error(
        "Error submitting Step 2:",
        err.response?.data || err.message
      );
    }
  };

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <Spinner color="white" />
      </div>
    );
  }

  if (status === "error") {
    return <Alert color="danger">Error: {error}</Alert>;
  }

  return (
    <>
      <div className="container mt-4" style={{
        maxWidth: 600,
        background: "transparent",
        backdropFilter: "blur(20px)",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
        padding: 32,
      
        border: "1px solid rgba(196, 26, 107, 0.1)"
      }}>
        {toast.visible && (
          <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
            <Toast isOpen={toast.visible} style={{ borderRadius: 12, boxShadow: "0 2px 12px rgba(196,26,107,0.15)" }}>
              <ToastHeader
                icon={toast.type === "success" ? "success" : "danger"}
                toggle={() => setToast({ ...toast, visible: false })}
                style={{ background: toast.type === "success" ? "linear-gradient(90deg, #c41a6b, #390452)" : "#dc3545", color: "#fff", borderRadius: 10 }}
              >
                {toast.type === "success" ? "Success" : "Error"}
              </ToastHeader>
              <ToastBody style={{ color: "#390452", fontWeight: 500 }}>{toast.message}</ToastBody>
            </Toast>
          </div>
        )}

        {currentStep === 1 && (
          <Formik
            initialValues={{
              activeTab,
              withdrawMethod: formData.withdrawMethod || "",
              account: formData.account || "",
              wallet: formData.wallet || "",
              amount: formData.amount || "",
            }}
            validationSchema={step1ValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              handleNextStep(values, { setSubmitting });
            }}
          >
            {({ setFieldValue }) => (
              <Form>
                <Step1Component
                  withdrawMethods={withdrawMethods || []}
                  tradeAccounts={tradeAccounts || []}
                  walletList={walletList || []}
                  handleWithdrawMethodChange={(e) => {
                    setFieldValue("withdrawMethod", e.target.value);
                    handleWithdrawMethodChange(e.target.value);
                  }}
                  handleAccountChange={(e) => {
                    setFieldValue("account", e.target.value);
                    handleAccountChange(e);
                  }}
                  handleAmountChange={(e) => {
                    setFieldValue("amount", e.target.value);
                    handleAmountChange(e);
                  }}
                  handleWalletMethodChange={(e) => {
                    setFieldValue("wallet", e.target.value);
                    handleWalletMethodChange(e);
                  }}
                  gateway={gateway}
                  amount={amount}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
                <FormGroup style={{ marginTop: 24 }}>
                  <Button
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
                    type="submit" block>
                    {t('Next')}
                  </Button>
                </FormGroup>
              </Form>
            )}
          </Formik>
        )}

        {currentStep === 2 && (
          <Formik
            initialValues={formData}
            validationSchema={step2ValidationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Step2Component selectedWithdrawMethod={selectedWithdrawMethod} />

              <Row className="mt-3">
                <Col md={6}>
                  <Button
                    style={{
                      background: "linear-gradient(90deg, #fff, #c41a6b)",
                      border: "none",
                      borderRadius: 10,
                      padding: "12px 28px",
                      fontWeight: 600,
                      fontSize: 18,
                      boxShadow: "0 2px 8px rgba(196,26,107,0.10)",
                      color: "#390452"
                    }}
                    onClick={handlePreviousStep} block disabled={loading}>
                    {t('Previous')}
                  </Button>
                </Col>
                <Col md={6}>
                  <Button
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
                    type="submit" block disabled={loading}>
                    {loading ? <Spinner size="sm" /> : t("Submit")}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Formik>
        )}
      </div>
    </>
  );
};

export default MultiStepForm;
