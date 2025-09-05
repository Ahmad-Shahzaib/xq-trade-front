
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <style>{`
        .language-switcher-container {
          position: absolute;
          top: -70px;
          right: -70px;
          z-index: 1000;
        }

        @media (max-width: 900px) {
          .language-switcher-container {
            top: 10px;
            right: 50px;
          }
          .language-switcher-select {
            width: 100px !important;
            font-size: 0.9rem !important;
            padding: 6px 8px !important;
          }
        }
        @media (max-width: 600px) {
          .language-switcher-container {
            top: -90px;
            right: 30px;
          }
        }
        @media (max-width: 768px) {
          .language-switcher-container {
            top: -90px;
            right: 30px;
          }
        }
      `}</style>
      <div className="language-switcher-container">
        <select
          className="form-select language-switcher-select"
          style={{
            background: 'linear-gradient(rgb(31, 14, 39), rgb(60, 20, 80))',
            color: 'white',
            border: '1px solid #3b3040',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1rem',
            padding: '8px 12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            outline: 'none',
            width: '140px',
            appearance: 'none',
            MozAppearance: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer',
            marginTop: '2px',
          }}
          onChange={(e) => changeLanguage(e.target.value)}
        >
          <option value="en" style={{ color: 'black' }}>English</option>
          <option value="ar" style={{ color: 'black' }}>Arabic</option>
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;