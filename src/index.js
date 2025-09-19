import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { FavoriteCurrenciesProvider } from './context/FavoriteCurrenciesContext';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from './rtk/store';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GoogleOAuthProvider clientId="515557635774-9hdpk7json8r9fj2npqh308ovj3gkeji.apps.googleusercontent.com">
    <Provider store={store}>
      <FavoriteCurrenciesProvider>
        <React.Fragment>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <App style={{
              paddingTop: 'env(safe-area-inset-top)',
              paddingBottom: 'env(safe-area-inset-bottom)',
              paddingLeft: 'env(safe-area-inset-left)',
              paddingRight: 'env(safe-area-inset-right)',
            }} />
          </BrowserRouter>
        </React.Fragment>
      </FavoriteCurrenciesProvider>
    </Provider>
  </GoogleOAuthProvider>
  // ok
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();