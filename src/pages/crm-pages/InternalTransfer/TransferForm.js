import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, FormGroup, Label, Card, CardBody, CardHeader, Alert, Spinner } from 'reactstrap';
import Select from 'react-select';
import { createInternalTransferAccounts } from '../../../rtk/slices/InternalTransferSlice/InternalTransferAccounts';
import { createInternalTransfer, resetTransferState } from '../../../rtk/slices/InternalTransferSlice/createInternalTransfer';
import { useTranslation } from 'react-i18next';
import trading from '../../../assets/images/chartbg.png';
import BackButton from '../../../Layouts/BackButton';

const TransferForm = () => {
    const { t } = useTranslation(); // Initialize translation function
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { fromAccounts, toAccounts } = useSelector((state) => state.internalTransferAccounts);
    const { loading, error, success } = useSelector((state) => state.internalTransfer);

    useEffect(() => {
        dispatch(createInternalTransferAccounts());
    }, [dispatch]);

    // Validation Schema using Yup
    const validationSchema = Yup.object().shape({
        fromAccount: Yup.string()
            .required('From Account is required')
            .test("balanceCheck", "Selected account has no Balance.", function (value) {
                const selectedAccount = fromAccounts.find((account) => account.id === parseInt(value));
                return selectedAccount ? selectedAccount.balance > 0 : false;
            }),
        toAccount: Yup.string().required('To Account is required'),
        amount: Yup.number()
            .typeError('Amount must be a number')
            .required('Amount is required')
            .min(1, 'Amount must be greater than 0')
            .test('max-balance', 'Amount cannot exceed From Account balance', function (value) {
                const selectedAccount = fromAccounts.find(
                    (account) => account.id === parseInt(this.parent.fromAccount)
                );
                return selectedAccount ? value <= selectedAccount.balance : false;
            }),
    });

    const formik = useFormik({
        initialValues: {
            fromAccount: '',
            toAccount: '',
            amount: '',
        },
        validationSchema,
        enableReinitialize: true, // Ensure form updates if accounts change
        onSubmit: (values) => {
            const token = localStorage.getItem('token');


            const transferData = new FormData();

            // Find selected fromAccount
            const selectedFromAccount = fromAccounts.find(account => account.id === Number(values.fromAccount));

            if (selectedFromAccount?.account === "wallet") {
                transferData.append('from', 'wallet');
                transferData.append('wallet_id', Number(selectedFromAccount.id)); // Ensure ID is a number
            } else {
                transferData.append('from', Number(values.fromAccount)); // Convert fromAccount to number
            }

            transferData.append('to', Number(values.toAccount)); // Convert toAccount to number
            transferData.append('amount', Number(values.amount)); // Ensure amount is a number

            dispatch(createInternalTransfer({ transferData, token }));
            setTimeout(() => {
                if (window.innerWidth < 768) {
                    navigate('/transactions');  // Navigate to /transactions for smaller screens
                } else {
                    navigate('/internal-transfer');  // Default navigation for larger screens
                }
            }, 3000);
        }

    });

    // Prepare options for react-select
    const fromAccountOptions = fromAccounts && fromAccounts.length > 0
        ? [
            { value: '', label: t('Select an account'), isDisabled: true },
            ...fromAccounts.map((account) => ({
                value: account.id,
                label: `${account.name} - (Balance: ${Number(account.balance).toFixed(2)})`,
            }))
        ]
        : [{ value: '', label: t('No accounts available'), isDisabled: true }];

    const toAccountOptions = toAccounts && toAccounts.length > 0
        ? [
            { value: '', label: t('Select an account'), isDisabled: true },
            ...toAccounts.map((account) => ({
                value: account.id,
                label: `${account.name} - (Balance: ${Number(account.balance).toFixed(2)})`,
            }))
        ]
        : [{ value: '', label: t('No accounts available'), isDisabled: true }];

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
        <div className='page-content'
            style={{
                backgroundImage: `url(${trading})`,
                backgroundSize: 'cover', backgroundPosition: 'center', padding: '20px 0',
                borderRadius: 16, boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
                height: "100%"
            }}
        >
            <BackButton />
            <div className='container-fluid'>
                <Card>
                    <CardHeader style={{ background: "transparent" }}>
                        <h3 className="mb-0">{t('Transfer Funds')}</h3>
                    </CardHeader>
                    <CardBody>
                        {success && <Alert color="success">{t('Transfer Successful!')}</Alert>}
                        {error && <Alert color="danger">{typeof error === 'string' ? error : JSON.stringify(error)}</Alert>}
                        <form onSubmit={formik.handleSubmit}>
                            <FormGroup>
                                <Label for="fromAccount">{t('From')}</Label>
                                <Select
                                    options={fromAccountOptions}
                                    onChange={(selectedOption) => {
                                        if (!selectedOption || !selectedOption.value) return;
                                        formik.setFieldValue('fromAccount', selectedOption.value);
                                    }}
                                    value={fromAccountOptions.find(option => option.value === formik.values.fromAccount) || fromAccountOptions[0]}
                                    placeholder={t('Select an account')}
                                    name="fromAccount"
                                    styles={selectStyles}
                                    isOptionDisabled={(option) => !!option.isDisabled}
                                />
                                {formik.touched.fromAccount && formik.errors.fromAccount && (
                                    <div className="text-danger">{formik.errors.fromAccount}</div>
                                )}
                            </FormGroup>

                            <FormGroup>
                                <Label for="toAccount">{t('To')}</Label>
                                <Select
                                    options={toAccountOptions}
                                    onChange={(selectedOption) => {
                                        if (!selectedOption || !selectedOption.value) return;
                                        formik.setFieldValue('toAccount', selectedOption.value);
                                    }}
                                    value={toAccountOptions.find(option => option.value === formik.values.toAccount) || toAccountOptions[0]}
                                    placeholder={t('Select an account')}
                                    name="toAccount"
                                    styles={selectStyles}
                                    isOptionDisabled={(option) => !!option.isDisabled}
                                />
                                {formik.touched.toAccount && formik.errors.toAccount && (
                                    <div className="text-danger">{formik.errors.toAccount}</div>
                                )}
                            </FormGroup>

                            <FormGroup>
                                <Label for="amount">{t('Amount')}</Label>
                                <input
                                    type="number"
                                    name="amount"
                                    id="amount"
                                    placeholder={t('Enter amount')}
                                    onChange={formik.handleChange}
                                    value={formik.values.amount}
                                    style={{ background: "transparent", border: "1px solid #390452", borderRadius: 4, padding: 12, width: '100%' }}
                                />
                                {formik.touched.amount && formik.errors.amount && (
                                    <div className="text-danger">{formik.errors.amount}</div>
                                )}
                            </FormGroup>

                            <Button className=''
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
                                block type="submit" disabled={loading}>
                                {loading ? <Spinner size="sm" /> : t('Transfer')}
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default TransferForm;
