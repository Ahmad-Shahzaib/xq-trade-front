import React, { useEffect, useRef, useState } from 'react';
import { Col, Form, FormGroup, Input, Row, Button, InputGroup, InputGroupText, Toast, ToastBody, ToastHeader } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../../rtk/slices/crm-slices/user/updateProfileSlice';
import { getUser } from '../../../rtk/slices/crm-slices/user/getUserSlice';
import { token } from '../../../utils/config';
import { useTranslation } from 'react-i18next';

const ProfileUpdateForm = () => {
    const [countries, setCountries] = useState([]);
    const [countryCode, setCountryCode] = useState('');
    const [countryName, setCountryName] = useState('');

    const dispatch = useDispatch();
    const { t } = useTranslation()
    const { user } = useSelector(state => state.user); // Get user data from Redux
    const access_token = token;
    const fileInputRef = useRef(null); // Ref for file input
    const [preview, setPreview] = useState(null); // Preview image
    const [showToast, setShowToast] = useState(false);



    useEffect(() => {
        if (!user) {
            dispatch(getUser({ token: access_token }));
        }
    }, [dispatch, user, access_token]);

    const formik = useFormik({
        initialValues: {
            firstName: user?.firstname || '',
            lastName: user?.lastname || '',
            profilePicture: user?.image || null,
            dateOfBirth: user?.dob ? user.dob : '', // ✅ Handle null dob properly
            country: user?.address?.country || '',
            mobileNumber: user?.mobile || '',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First Name is required'),
        }),
        enableReinitialize: true,
        onSubmit: async (values) => {

            const profileData = new FormData();
            profileData.append('firstname', values.firstName);
            profileData.append('lastname', values.lastName);
            if (values.profilePicture) {
                profileData.append('image', values.profilePicture);
            }
            if (values.dateOfBirth) { // Ensure DOB is included
                profileData.append('dob', values.dateOfBirth);
            }
            profileData.append('country', values.country);
            profileData.append('mobile', values.mobileNumber);
            const response = await dispatch(updateProfile({ profileData, token: access_token }));
            if (response.meta.requestStatus === "fulfilled") {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000); // Hide after 3s
            }
        }
    });

    const handleFileChange = (event) => {
        const file = event.currentTarget.files[0];
        if (file) {
            formik.setFieldValue('profilePicture', file);

            // Preview selected image
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Reset file input to allow re-upload
            event.target.value = "";
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click(); // Open file selector when clicking the image
    };

    // Fetch the countries on component mount
    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all")
            .then((res) => res.json())
            .then((data) => {
                const formattedCountries = data.map((country) => ({
                    name: country.name.common,
                    code: country.cca2, // cca2 is the 2-letter country code
                }));
                setCountries(formattedCountries);
            })
            .catch((err) => console.error("Error fetching countries:", err));
    }, []);

    // Function to get country code from country name
    const getCountryCode = (name) => {
        const country = countries.find((c) => c.name.toLowerCase() === name.toLowerCase());
        return country ? country.code : null; // Returns the country code or null if not found
    };

    useEffect(() => {
        // Assuming user.address.country is available
        const userCountry = user?.address?.country || ''; // Replace this with user.address.country
        const countryCodeFromUser = getCountryCode(userCountry); // Get country code from the country name
        setCountryCode(countryCodeFromUser); // Set the country code
        setCountryName(userCountry); // Optionally, set the country name if needed
    }, [countries]); // This useEffect will run when countries data is fetched
    return (
        <Form onSubmit={formik.handleSubmit} className='pb-md-0 pb-5'>
            <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1050 }}>
                <Toast isOpen={showToast} style={{ backgroundColor: "#00934f" }}>
                    <ToastHeader toggle={() => setShowToast(false)} style={{ backgroundColor: "#00934f", color: '#ffffff' }}>
                        {t("Profile updated successfully! 🎉")}
                    </ToastHeader>
                    {/* <ToastBody>
                        Profile updated successfully! 🎉
                    </ToastBody> */}
                </Toast>
            </div>

            <Row>
                <Col md={12} className="text-center d-flex justify-content-center">
                    <div className="profile-picture-container mb-3" onClick={handleImageClick}>
                        {preview || user?.image ? (
                            <>
                                <img
                                    src={preview || user?.image_path}
                                    alt="Profile"
                                    className="profile-picture"
                                    style={{background: "transparent"}}
                                />
                                {/* {userFlag && (
                                    <img
                                        src={userFlag}
                                        alt={`${user?.country_code} flag`}
                                            style={{ width: '30px', height: '18px', border: '1px solid rgb(105, 255, 65)', position: 'absolute', bottom: "0px", right: '0px', zIndex: '9999', }}

                                    />
                                )} */}

                                {countryCode && (
                                    <img
                                        src={`https://flagcdn.com/w40/${String(countryCode).toLowerCase()}.png`}
                                        alt={`${countryCode} flag`}
                                        style={{ width: '30px', height: '18px', border: '1px solid rgb(105, 255, 65)', position: 'absolute', bottom: "0px", right: '0px', zIndex: '9999', }}

                                    />
                                )}


                            </>
                        ) : (
                            <div className="upload-placeholder">
                                <i className="ri-camera-line"></i>
                            </div>
                        )}
                        <Input
                            id="profilePicture"
                            name="profilePicture"
                            type="file"
                            style={{background:"transparent"}}
                            className="d-none"
                            innerRef={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <FormGroup>
                        <InputGroup>
                        <Input
                            id="firstName"
                            name="firstName"
                            style={{background:"transparent"}}
                            type="text"
                            placeholder='First Name'
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.firstName && !!formik.errors.firstName}
                        />
                            <InputGroupText style={{background:"transparent"}}>
                                <i className="ri-pencil-line"></i>
                            </InputGroupText>
                        </InputGroup>
                        {formik.touched.firstName && formik.errors.firstName && (
                            <div className="text-danger">{formik.errors.firstName}</div>
                        )}
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <FormGroup>
                        <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            style={{background:"transparent"}}
                            type="date"
                            placeholder="Date of Birth"
                            value={formik.values.dateOfBirth}
                            onChange={(e) => {// 🔍 Check if it's updating
                                formik.handleChange(e);
                            }}
                        />
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <FormGroup>
                        <InputGroup>
                            <Input
                                id="mobileNumber"
                                name="mobileNumber"
                                style={{background:"transparent"}}
                                type="tel"
                                placeholder='Mobile Number'
                                value={formik.values.mobileNumber}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={formik.touched.mobileNumber && !!formik.errors.mobileNumber}
                            />
                            <InputGroupText style={{background:"transparent"}}>
                                <i className="ri-pencil-line"></i>
                            </InputGroupText>
                        </InputGroup>
                        {formik.touched.mobileNumber && formik.errors.mobileNumber && (
                            <div className="text-danger">{formik.errors.mobileNumber}</div>
                        )}
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <FormGroup>
                        <InputGroup>
                            <Input
                                id="country"
                                name="country"
                                style={{background:"transparent"}}
                                type="text"
                                placeholder='Country'
                                value={formik.values.country}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                invalid={formik.touched.country && !!formik.errors.country}
                            />
                            <InputGroupText style={{background:"transparent"}}>
                                <i className="ri-pencil-line"></i>
                            </InputGroupText>
                        </InputGroup>
                        {formik.touched.country && formik.errors.country && (
                            <div className="text-danger">{formik.errors.country}</div>
                        )}
                    </FormGroup>
                </Col>
            </Row>


            <Button className=''
                style={{
                    background: "linear-gradient(90deg, #c41a6b, #390452)",
                    border: "1px solid #390452",
                    padding: "10px 20px",
                    fontWeight: 600,
                    fontSize: 18,
                    borderRadius: 10,
                    boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
                    color: "#fff",
                    width: '100%',
                }}
                type="submit" block>{t("Update Profile")}</Button>
        </Form>
    );
};

export default ProfileUpdateForm;
