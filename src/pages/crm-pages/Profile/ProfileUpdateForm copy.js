import React, { useEffect } from 'react';
import { Col, Form, FormGroup, Input, Label, Row, Button } from 'reactstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../../rtk/slices/crm-slices/user/updateProfileSlice';
import { getUser } from '../../../rtk/slices/crm-slices/user/getUserSlice';
import { token } from '../../../utils/config';

const ProfileUpdateForm = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user); // Get user data from Redux
    const access_token = token;

    useEffect(() => {
        if (!user) {
            // Dispatch an action to fetch the user data on initial load
            dispatch(getUser({ token: access_token }));
        }
    }, [dispatch, user, access_token]);

    const formik = useFormik({
        initialValues: {
            firstName: user?.firstname || '',
            lastName: user?.lastname || '',
            email: user?.email || '',
            mobileNumber: user?.mobile || '',
            address: user?.address?.address || '',
            state: user?.address?.state || '',
            zipCode: user?.address?.zip || '',
            city: user?.address?.city || '',
            country: user?.address?.country || '',
            profilePicture: user?.image || null, // Make sure image is set
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
        }),
        enableReinitialize: true, // Reinitialize form when user data changes
        onSubmit: (values) => {

            const profileData = new FormData();
            profileData.append('firstname', values.firstName);
            profileData.append('lastname', values.lastName);
            profileData.append('email', values.email);
            profileData.append('mobile', values.mobileNumber);
            profileData.append('address', values.address);
            profileData.append('state', values.state);
            profileData.append('zip', values.zipCode);
            profileData.append('city', values.city);
            profileData.append('country', values.country);

            // Check if profile picture is selected and append it
            if (values.profilePicture) {
                profileData.append('image', values.profilePicture);
            }
            

            dispatch(updateProfile({ profileData, token: access_token }));
        }
    });

    return (
        <Form onSubmit={formik.handleSubmit} className='pb-md-0 pb-5'>
            <Row>
                <Col md={6}>
                    <FormGroup>
                        {/* <Label htmlFor="firstName">First Name</Label> */}
                        <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder='First Name'
                            value={formik.values.firstName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.firstName && !!formik.errors.firstName}
                        />
                        {formik.touched.firstName && formik.errors.firstName && (
                            <div className="text-danger">{formik.errors.firstName}</div>
                        )}
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        {/* <Label htmlFor="lastName">Last Name</Label> */}
                        <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder='Last Name'
                            value={formik.values.lastName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            invalid={formik.touched.lastName && !!formik.errors.lastName}
                        />
                        {formik.touched.lastName && formik.errors.lastName && (
                            <div className="text-danger">{formik.errors.lastName}</div>
                        )}
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <FormGroup>
                        {/* <Label htmlFor="email">Email</Label> */}
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder='Email'
                            value={formik.values.email}
                            readOnly
                        />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        {/* <Label htmlFor="mobileNumber">Mobile Number</Label> */}
                        <Input
                            id="mobileNumber"
                            name="mobileNumber"
                            type="tel"
                            placeholder='Mobile Number'
                            value={formik.values.mobileNumber}
                            readOnly
                        />
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <FormGroup>
                        {/* <Label htmlFor="address">Address</Label> */}
                        <Input
                            id="address"
                            name="address"
                            type="text"
                            placeholder='Address'
                            value={formik.values.address}
                            onChange={formik.handleChange}
                        />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        {/* <Label htmlFor="state">State</Label> */}
                        <Input
                            id="state"
                            name="state"
                            type="text"
                            placeholder='State'
                            value={formik.values.state}
                            onChange={formik.handleChange}
                        />
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col md={4}>
                    <FormGroup>
                        {/* <Label htmlFor="zipCode">Zip Code</Label> */}
                        {/* <Input
                            id="zipCode"
                            name="zipCode"
                            type="text"
                            value={formik.values.zipCode}
                            onChange={formik.handleChange}
                        /> */}
                        <Input
                            id="zipCode"
                            name="zipCode"
                            type="text"
                            placeholder='Zip Code'
                            value={formik.values.zipCode}
                            onChange={formik.handleChange}
                        />
                    </FormGroup>
                </Col>
                <Col md={4}>
                    <FormGroup>
                        {/* <Label htmlFor="city">City</Label> */}
                        <Input
                            id="city"
                            name="city"
                            type="text"
                            placeholder='City'
                            value={formik.values.city}
                            onChange={formik.handleChange}
                        />
                    </FormGroup>
                </Col>
                <Col md={4}>
                    <FormGroup>
                        {/* <Label htmlFor="country">Country</Label> */}
                        <Input
                            id="country"
                            name="country"
                            type="text"
                            placeholder='Country'
                            value={formik.values.country}
                            readOnly
                        />
                    </FormGroup>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <FormGroup>
                        {/* <Label htmlFor="profilePicture">Profile Picture</Label> */}
                        <Input
                            id="profilePicture"
                            name="profilePicture"
                            type="file"
                            placeholder='Profile Picture'
                            onChange={(event) =>
                                formik.setFieldValue('profilePicture', event.currentTarget.files[0])
                            }
                            accept="image/*"
                        />
                    </FormGroup>
                </Col>
            </Row>

            <Button className='depositButtonLite' type="submit" block>Update Profile</Button>
        </Form>
    );
}

export default ProfileUpdateForm;
