import React from "react";
import { Field, ErrorMessage } from "formik";
import { Form, FormGroup, Label, Input, Row, Col, Alert } from "reactstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";

const Step1Component = ({ gateways, tradeAccounts, handlegatewaysChange, handleAccountChange, handleAmountChange, amount }) => {



  const gatewayOptions = gateways.map((method) => ({
    id: method.id,
    value: method.method_code,
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={`https://wise.com/public-resources/assets/flags/rectangle/${String(
            method.currency
          )
            .slice(0, 3)
            .toLowerCase()}.png`}
          alt={method.currency}
          width="20"
          style={{ marginRight: "10px" }}
        />
        {method.name}
      </div>
    ),
    id: method.id, // Store the unique id in the option
    currency: method.currency, // Optional: Store currency to make the label unique
  }));

  const { t } = useTranslation();
  return (
    <Form>
      {/* Withdraw Method Field */}
      <FormGroup>
        <Select
          options={gatewayOptions}
          onChange={(selectedOption) => {
            if (!selectedOption || !selectedOption.value) {
              console.error("Invalid selection:");
              return;
            }
            if (typeof handlegatewaysChange === "function") {
              handlegatewaysChange(selectedOption);
            } else {
              console.error("handlegatewaysChange is not a function:");
            }
          }}
          placeholder={t('Select Gateway')}
          name="gateway"
          styles={{
            control: (provided, state) => ({
              ...provided,
              background: "transparent",
              border: state.isFocused ? "2px solid #c41a6b" : "1px solid #390452",
              borderRadius: 10,
              boxShadow: state.isFocused ? "0 0 0 2px rgba(196,26,107,0.10)" : "none",
              padding: "4px 4px",
              minHeight: 48,
              width: '100%',
            }),
            option: (provided, state) => ({
              ...provided,
              background: state.isSelected
                ? "#0b0a0bff"
                : state.isFocused
                  ? "rgba(196,26,107,0.18)" // dark magenta rgba for focus/hover
                  : "#fff",
              color: state.isSelected ? "#fff" : "#390452",
              fontWeight: state.isSelected ? 600 : 500,
              padding: 12,
              borderRadius: 8,
              transition: "background 0.2s",
            }),
            menu: (provided) => ({
              ...provided,
              borderRadius: 12,
              boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
              zIndex: 20,
            }),
            singleValue: (provided) => ({
              ...provided,
              fontWeight: 600,
            }),
            placeholder: (provided) => ({
              ...provided,
              fontWeight: 500,
            }),
            dropdownIndicator: (provided, state) => ({
              ...provided,
            }),
            indicatorSeparator: (provided) => ({
              ...provided,
              backgroundColor: "#c41a6b",
            }),
          }}
        />



        <ErrorMessage name="gateway" component="div" className="text-danger" />
      </FormGroup>

      {/* Account Selection Field (custom react-select) */}
      <FormGroup>
        <Select
          options={
            tradeAccounts && tradeAccounts.length > 0
              ? [
                { value: '', label: t('Select Account'), isDisabled: true },
                ...tradeAccounts.map((account) => ({
                  value: account.id,
                  label: `${account.name} (${Number(account.balance).toFixed(2)})`,
                }))
              ]
              : [{ value: '', label: t('No accounts available'), isDisabled: true }]
          }
          onChange={(selectedOption) => {
            if (!selectedOption || !selectedOption.value) return;
            if (typeof handleAccountChange === "function") {
              // Simulate event for Formik
              handleAccountChange({ target: { value: selectedOption.value } });
            }
          }}
          placeholder={t('Select Account')}
          name="account"
          styles={{
            control: (provided, state) => ({
              ...provided,
              background: "transparent",
              border: state.isFocused ? "2px solid #c41a6b" : "1px solid #390452",
              borderRadius: 10,
              boxShadow: state.isFocused ? "0 0 0 2px rgba(196,26,107,0.10)" : "none",
              padding: "4px 4px",
              minHeight: 48,
              width: '100%',
            }),
            option: (provided, state) => ({
              ...provided,
              background: state.isSelected
                ? "#0b0a0bff"
                : state.isFocused
                  ? "rgba(196,26,107,0.18)"
                  : "#fff",
              color: state.isSelected ? "#fff" : "#390452",
              fontWeight: state.isSelected ? 600 : 500,
              padding: 12,
              borderRadius: 8,
              transition: "background 0.2s",
            }),
            menu: (provided) => ({
              ...provided,
              borderRadius: 12,
              boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
              zIndex: 20,
            }),
            singleValue: (provided) => ({
              ...provided,
              fontWeight: 600,
            }),
            placeholder: (provided) => ({
              ...provided,
              fontWeight: 500,
            }),
            dropdownIndicator: (provided, state) => ({
              ...provided,
            }),
            indicatorSeparator: (provided) => ({
              ...provided,
              backgroundColor: "#c41a6b",
            }),
          }}
          isOptionDisabled={(option) => !!option.isDisabled}
        />
        <ErrorMessage name="account" component="div" className="text-danger" />
      </FormGroup>

      {/* Amount Field */}
      <FormGroup>
        {/* <Label for="amount">Amount</Label> */}
        <Field
          type="number"
          name="amount"
          value={amount}
          onChange={handleAmountChange}
          className=""
          style={{ background: "transparent", border: "1px solid #390452", borderRadius: 4, padding: 12, width: '100%' }}
          placeholder={t("Amount")}
        />
        <ErrorMessage name="amount" component="div" className="text-danger" />
      </FormGroup>

      {/* Conversion Rate and Receivable Calculation */}
      {/* {gateway === "Bank Transfer" && amount > 0 && (
        <Row>
          <Col>
            <Alert color="info">
              <div>Conversion Rate: 1 USD = {conversionRate} INR</div>
              <div>Receivable: {amount * conversionRate} INR</div>
            </Alert>
          </Col>
        </Row>
      )} */}
    </Form>
  );
};

export default Step1Component;
