import React, { useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerWithGoogle } from '../../../rtk/slices/crm-slices/auth/registerWithGoogleSlice';
import { toast } from 'react-toastify';

const GoogleLoginButton = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      // console.log("✅ Google User:", decoded);

      const { email, given_name: first_name } = decoded;

      await dispatch(
        registerWithGoogle({
          email,
          first_name,
          register_type: "google",
        })
      ).unwrap();

      navigate("/user-dashboard");
    } catch (error) {
      console.error("❌ Login Error:", error);
      toast.error(error);
    }
  };




  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: (error) => {
      console.error("❌ Google Login Error:", error);
      toast.error("Google login failed.");
    },
    flow: 'implicit',
  });

  return (
    <>
      {/* <h3>Login with Google</h3> */}
      <button
        onClick={() => login()}
        style={{
          borderRadius: '50%',
          background: 'transparent',
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 30px #c800a155',
          cursor: 'pointer',
          outline: 'none',
          padding: 0
        }}
      >
        <i className="ri-google-fill" style={{ color: '#fff', fontSize: 24 }}></i>
      </button>
    </>
  );
};

export default GoogleLoginButton;
