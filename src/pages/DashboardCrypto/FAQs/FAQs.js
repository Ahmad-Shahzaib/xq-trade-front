import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Spinner, Alert, ListGroup, ListGroupItem } from "reactstrap";
import { fetchFaqs } from "../../../rtk/slices/faqSlice/faqSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import BackButton from "../../../Layouts/BackButton";

const FAQs = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { faqs, loading, error } = useSelector((state) => state.faqs);

    useEffect(() => {
        if (faqs.length === 0) { // ✅ Fetch only if faqs are empty
            dispatch(fetchFaqs());
        }
    }, [dispatch, faqs.length]);

    const { t } = useTranslation();

    return (
        <div className="page-content  py-5" style={{
            background: 'rgb(29, 10, 37)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            overflowY: window.innerWidth <= 768 ? 'scroll' : 'auto',
          height: window.innerWidth <= 768 ? 'calc(100% - 10px)' : '89vh',
        }}>
            <BackButton />
            <Container className="mt-4">
                <h3 className="mb-4">{t('Help Center')}</h3>

                {loading && (
                    <div className="text-center">
                        <Spinner color="white" />
                        <p className="mt-2">{t('Loading FAQs')}...</p>
                    </div>
                )}

                {error && <Alert color="danger">{error}</Alert>}

                {!loading && faqs.length === 0 && <Alert color="warning">{t('No FAQs available.')}</Alert>}

                {!loading && faqs.length > 0 && (
                    <ListGroup>
                        {faqs.map((faq, index) => (
                            <ListGroupItem 
                                key={index} 
                                className="bg-transparent p-0 border-0 clickable d-flex align-items-center mb-3" 
                                onClick={() => navigate(`/faq/${index}`)} // ✅ Navigate to details page
                                style={{ cursor: "pointer" }} // ✅ Make it look clickable
                            >
                                <i class="ri-menu-2-fill me-2"></i> <h5 className="mb-0 ">{t(faq.title)}</h5>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                )}
            </Container>
        </div>
    );
};

export default FAQs;
