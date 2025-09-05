import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { tradeGroups } from '../../../rtk/slices/crm-slices/trade/tradeGroups';
import { submitNewTradingAccount } from '../../../rtk/slices/crm-slices/trade/newTradingAccountSlice';
import { token } from '../../../utils/config';
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Container,
    FormFeedback,
} from 'reactstrap';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { tradeAccountsList } from '../../../rtk/slices/crm-slices/trade/tradeAccountsList';
import { setSelectedAccount } from '../../../rtk/slices/accountTypeSlice/accountTypeSlice';
import trading from '../../../assets/images/chartbg.png';
import BackButton from '../../../Layouts/BackButton';
import { useTranslation } from "react-i18next";
const NewTradingAccount = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const tradeGroupData = useSelector((state) => state.tradeGroupsList);
    const tradeGroupList = tradeGroupData?.tradeGroup?.tradeGroups || [];
    const { loading, error, success } = useSelector((state) => state.newTradingAccount);


    useEffect(() => {
        const storedToken = localStorage.getItem("token"); // Fetch token from local storage
        const storedSelectedAccount = localStorage.getItem("selectedAccount");
        const parsedSelectedAccount = storedSelectedAccount ? JSON.parse(storedSelectedAccount) : {};

        if (storedToken) {
            dispatch(tradeGroups(storedToken)).unwrap().then((response) => {
                if (response?.tradeAccount && Object.keys(parsedSelectedAccount).length === 0) {
                    const account = response.tradeAccount;
                    dispatch(setSelectedAccount(account));
                    localStorage.setItem("selectedAccount", JSON.stringify(account));
                }
            }).catch((error) => {
                console.error("Failed to fetch trade groups:", error);
            });
        }
    }, [dispatch]);



    // Yup validation schema
    const validationSchema = Yup.object().shape({
        accountType: Yup.string().required('Account Type is required'),
        name: Yup.string()
            .required('name is required'),

    });

    // Formik setup
    const formik = useFormik({
        initialValues: {
            accountType: '',
            name: '',
            is_real: 1
        },
        validationSchema,
        onSubmit: (values) => {
            const storedToken = localStorage.getItem("token");
            const selectedGroup = tradeGroupList.find((group) => group.name === values.accountType);
            if (selectedGroup) {
                const formData = new FormData();
                formData.append('trade_group', selectedGroup.id);
                formData.append('name', values.name);
                formData.append('is_real', values.is_real);

                // Dispatch the async thunk with the form data and token
                dispatch(submitNewTradingAccount({
                    newTradeAccountData: formData,
                    storedToken,
                }));
                dispatch(tradeAccountsList(storedToken))
                setTimeout(() => {
                    navigate('/trading-accounts')
                }, 2000);
            }

        },
    });

    return (
        <div className="page-content" style={{
            backgroundImage: `url(${trading})`,
            backgroundSize: 'cover', backgroundPosition: 'center', padding: '20px 0',
            borderRadius: 16, boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
            height: "100%"
        }}>
            <BackButton />
            <Container>
                <Form onSubmit={formik.handleSubmit} className="mt-4">
                    {/* Account Type Select */}
                    <FormGroup>
                        <Label for="accountType">{t("Currency")}</Label>
                        <Input
                            type="select"
                            name="accountType"
                            id="accountType"
                            value={formik.values.accountType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.accountType && !!formik.errors.accountType}
                        >
                            <option value="" disabled>{t("Select Account Type")}</option>
                            {tradeGroupList.map((group) => (
                                <option key={group.id} value={group.name}>
                                    {t(group.name)}
                                </option>
                            ))}
                        </Input>
                        {formik.touched.accountType && formik.errors.accountType && (
                            <FormFeedback>{formik.errors.accountType}</FormFeedback>
                        )}
                    </FormGroup>

                    {/* name Input */}
                    <FormGroup>
                        <Label for="name">{t("Name")}</Label>
                        <Input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Enter name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.name && !!formik.errors.name}
                        />
                        {formik.touched.name && formik.errors.name && (
                            <FormFeedback>{formik.errors.name}</FormFeedback>
                        )}
                    </FormGroup>

                    {/* Submit Button */}
                    <Button type="submit" color="primary" disabled={loading}
                        style={{
                            background: "linear-gradient(90deg,  #c41a6b, #390452)"
                            , border: "1px solid #390452", padding: "10px 20px"
                        }}>
                        {loading ? t("Crearing Account....") : t("Create Account")


                        }
                    </Button>

                    {/* Feedback Messages */}
                    {error && <p className="text-danger mt-2">Error: {error.message || error}</p>}
                    {success && <p className="text-success mt-2">Account created successfully!</p>}
                </Form>
            </Container>
        </div>
    );
};

export default NewTradingAccount;
