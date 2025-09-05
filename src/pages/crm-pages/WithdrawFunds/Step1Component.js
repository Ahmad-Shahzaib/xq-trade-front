import React, { useState } from "react";
import { Field, ErrorMessage } from "formik";
import { Form, FormGroup, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import Select from "react-select";
import { useTranslation } from "react-i18next";

const Step1Component = ({
  withdrawMethods,
  tradeAccounts,
  walletList,
  handleWalletMethodChange,
  handleWithdrawMethodChange,
  handleAccountChange,
  handleAmountChange,
  amount,
  activeTab,
  setActiveTab
}) => {


  const { t } = useTranslation()

  // Prepare options for react-select
  const accountOptions = tradeAccounts && tradeAccounts.length > 0
    ? [
      { value: '', label: t('Select Account'), isDisabled: true },
      ...tradeAccounts.map((account) => ({
        value: account.id,
        label: `${account.name} (${Number(account.balance).toFixed(2)})`,
      }))
    ]
    : [{ value: '', label: t('No accounts available'), isDisabled: true }];

  const walletOptions = walletList && walletList.length > 0
    ? [
      { value: '', label: t('Select Wallet'), isDisabled: true },
      ...walletList.map((wallet) => ({
        value: wallet.id,
        label: `${wallet.currency} (${Number(wallet.balance).toFixed(2)})`,
      }))
    ]
    : [{ value: '', label: t('No wallets available'), isDisabled: true }];

  const withdrawMethodOptions = withdrawMethods && withdrawMethods.length > 0
    ? [
      { value: '', label: t('Withdrawal Method'), isDisabled: true },
      ...withdrawMethods.map((method) => ({
        value: method.id,
        label: method.name,
      }))
    ]
    : [{ value: '', label: t('No withdrawal methods'), isDisabled: true }];

  const selectStyles = {
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
  };

  return (
    <Form>
      {/* Tabs for switching between Trade Account and Wallet */}
      <Nav tabs className="mb-2 custom-tabs">
        <NavItem className="flex-grow-1 text-center">
          <NavLink
            className={classnames("custom-tab", { active: activeTab === "trade_account" })}
            onClick={() => setActiveTab("trade_account")}
          >
            {t("Trade Account")}
          </NavLink>
        </NavItem>
        <NavItem className="flex-grow-1 text-center">
          <NavLink
            className={classnames("custom-tab", { active: activeTab === "wallet" })}
            onClick={() => setActiveTab("wallet")}
          >
            {t("Wallet")}
          </NavLink>
        </NavItem>
      </Nav>

      <TabContent activeTab={activeTab}>
        <TabPane tabId="trade_account">
          {/* Account Selection Field (custom react-select) */}
          <FormGroup>
            <Select
              options={accountOptions}
              onChange={(selectedOption) => {
                if (!selectedOption || !selectedOption.value) return;
                if (typeof handleAccountChange === "function") {
                  handleAccountChange({ target: { value: selectedOption.value } });
                }
              }}
              placeholder={t('Select Account')}
              name="account"
              styles={selectStyles}
              isOptionDisabled={(option) => !!option.isDisabled}
            />
            <ErrorMessage name="account" component="div" className="text-danger" />
          </FormGroup>
        </TabPane>

        <TabPane tabId="wallet">
          {/* Wallet Selection Field (custom react-select) */}
          <FormGroup>
            <Select
              options={walletOptions}
              onChange={(selectedOption) => {
                if (!selectedOption || !selectedOption.value) return;
                if (typeof handleWalletMethodChange === "function") {
                  handleWalletMethodChange({ target: { value: selectedOption.value } });
                }
              }}
              placeholder={t('Select Wallet')}
              name="wallet"
              styles={selectStyles}
              isOptionDisabled={(option) => !!option.isDisabled}
            />
            <ErrorMessage name="wallet" component="div" className="text-danger" />
          </FormGroup>
        </TabPane>
      </TabContent>

      {/* Withdraw Method Field (custom react-select) */}
      <FormGroup>
        <Select
          options={withdrawMethodOptions}
          onChange={(selectedOption) => {
            if (!selectedOption || !selectedOption.value) return;
            if (typeof handleWithdrawMethodChange === "function") {
              handleWithdrawMethodChange({ target: { value: selectedOption.value } });
            }
          }}
          placeholder={t('Withdrawal Method')}
          name="withdrawMethod"
          styles={selectStyles}
          isOptionDisabled={(option) => !!option.isDisabled}
        />
        <ErrorMessage name="withdrawMethod" component="div" className="text-danger" />
      </FormGroup>

      {/* Amount Field */}
      <FormGroup>
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
    </Form>
  );
};

export default Step1Component;
