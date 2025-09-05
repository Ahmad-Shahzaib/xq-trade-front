import React from 'react'
import { useNavigate } from 'react-router-dom'

function BackButton() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };
  return (
    <div>
      <button style={{ padding: '5px 10px', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        onClick={handleBack}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M5 12L11 18M5 12L11 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

export default BackButton
