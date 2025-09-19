import React, { useEffect, useState } from 'react'
import FacebookLogin, { FacebookLoginClient } from '@greatsumini/react-facebook-login';

const appId = '1021545336104945';

const FacebookLoginButton = () => {
  useEffect(() => {
    FacebookLoginClient.init({
      appId,
      version: 'v18.0', // 👉 Correct: version here
      xfbml: true,
      cookie: true,
    });
  }, []);
 
  return (
    <>
      <FacebookLogin
        appId="1021545336104945" // 🔥 Replace with your Facebook App ID
        
        onSuccess={(response) => {
          // console.log('✅ Login Success!', response); // Removed console.log
        }}
        onFail={(error) => {
          // console.log('❌ Login Failed!', error); // Removed console.log
        }}
        onProfileSuccess={(profile) => {
          // console.log('🧑‍💻 Profile:', profile); // Removed console.log
        }}
        style={{
          backgroundColor: '#4267B2',
          color: '#fff',
          fontSize: '16px',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '30px',
          cursor: 'pointer',
        }}
      >
        Login with Facebook
      </FacebookLogin>
    </>
  )
}

export default FacebookLoginButton