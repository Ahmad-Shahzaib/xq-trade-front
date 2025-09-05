import React from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Button } from "reactstrap";
import { useTranslation } from 'react-i18next';

const FaqDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { faqs } = useSelector((state) => state.faqs);
    
    const faq = faqs[id];

    const { t } = useTranslation();

    const renderDescription = (text) => {
        const translatedText = t(text);
        
        // Check for numbered lists (1. 2. 3. etc.)
        const isNumberedList = /^\s*(\d+\.\s+.+(\n|$)){2,}/.test(translatedText);
        // Check for bullet point lists (- or • items)
        const isBulletList = /^\s*([-•]\s+.+(\n|$)){2,}/.test(translatedText);
        
        if (isNumberedList) {
            const items = translatedText
                .split('\n')
                .map(item => item.trim())
                .filter(item => item.match(/^\d+\.\s+.+$/));
            
            return (
                <ol className="text-white-50" style={{ listStyleType: 'decimal', paddingLeft: '20px' }}>
                    {items.map((item, index) => (
                        <li key={index}>{t(item.replace(/^\d+\.\s*/, '').trim())}</li>
                    ))}
                </ol>
            );
        }
        
        if (isBulletList) {
            const items = translatedText
                .split('\n')
                .map(item => item.trim())
                .filter(item => item.match(/^[-•]\s+.+$/));
            
            return (
                <ul className="text-white-50" style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    {items.map((item, index) => (
                        <li key={index}>{t(item.replace(/^[-•]\s*/, '').trim())}</li>
                    ))}
                </ul>
            );
        }
        
        // Default case - render as paragraph
        return <p className="text-white-50">{translatedText}</p>;
    };

    if (!faq) {
        return (
            <Container className="mt-5 text-center">
                <h4>{t('FAQ not found')}</h4>
                <Button color="primary" onClick={() => navigate(-1)}>{t('Go Back')}</Button>
            </Container>
        );
    }

    return (
        <div className="page-content min-vh-100 py-5" style={{
            background: 'rgb(29, 10, 37)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
        }}>
            <Container className="mt-4">
                <Button className="actionButton" 
                style={{
                        background:'linear-gradient(90deg, #c41a6b, #390452)',
                        color: 'white',
                        fontSize: '16px',
                        padding: '5px 10px',
                    }}
                onClick={() => navigate(-1)}>← {t('Back')}</Button>
                <h3 className="mt-3 text-white">{t(faq.title)}</h3>
                {renderDescription(faq.description)}
            </Container>
        </div>
    );
};

export default FaqDetail;