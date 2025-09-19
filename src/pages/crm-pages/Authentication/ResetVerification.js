import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyResetLink } from '../../../rtk/slices/resetPasswordSlice/verifyResetLink';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Spinner,
    Alert,
} from 'reactstrap';


const ResetVerification = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const code = searchParams.get('token');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, verified, message, error } = useSelector((state) => state.verifyResetLink);

    useEffect(() => {
        if (email && code) {
            dispatch(verifyResetLink({ email, code }));
        }
    }, [email, code, dispatch]);

    useEffect(() => {
        if (verified) {
            // Redirect to the password reset form
            //   navigate(`/new-password?email=${email}&token=${token}`);
            // console.log('verified'); // Removed console.log
            setTimeout(() => {
                navigate(`/password-reset?email=${email}&code=${code}`);
            }, 1500);

        }
    }, [verified, navigate, email, code]);

    return (
        <div className="page-content">
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                <Row className="w-100">
                    <Col md={{ size: 6, offset: 3 }}>
                        <Card className="shadow-lg border-0">
                            <CardBody className="text-center py-5">
                                <h3 className="mb-4 text-secondary">Email Verification</h3>

                                {loading && (
                                    <>
                                        <Spinner color="secondary" />
                                        <p className="mt-3">Verifying your link, please wait...</p>
                                    </>
                                )}

                                {!loading && message && (
                                    <Alert color={verified ? 'success' : 'warning'}>
                                        {message}
                                    </Alert>
                                )}

                                {!loading && error && (
                                    <Alert color="danger">
                                        {error.message || error}
                                    </Alert>
                                )}

                                {!loading && verified && (
                                    <p className="text-muted">
                                        Redirecting to reset password page...
                                    </p>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ResetVerification;

