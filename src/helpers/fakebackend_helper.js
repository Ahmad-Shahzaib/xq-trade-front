import { APIClient } from "./api_helper";

import * as url from "./url_helper";

const api = new APIClient();

// Login Method
export const postFakeLogin = data => api.create(url.POST_FAKE_LOGIN, data);

// postForgetPwd
export const postFakeForgetPwd = data => api.create(url.POST_FAKE_PASSWORD_FORGET, data);



// Register Method
export const postJwtRegister = (url, data) => {
  return api.create(url, data)
    .catch(err => {
      var message;
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            message = "Sorry! the page you are looking for could not be found";
            break;
          case 500:
            message = "Sorry! something went wrong, please contact our support team";
            break;
          case 401:
            message = "Invalid credentials";
            break;
          default:
            message = err[1];
            break;
        }
      }
      throw message;
    });
};

// Login Method
export const postJwtLogin = data => api.create(url.POST_FAKE_JWT_LOGIN, data);

// Crypto
// Transation
export const getTransationList = () => api.get(url.GET_TRANSACTION_LIST);

// Order List
export const getOrderList = () => api.get(url.GET_ORDRER_LIST);

// Dashboard Crypto
// Portfolio
export const getBtcPortfolioData = () => api.get(url.GET_BTCPORTFOLIO_DATA);
export const getUsdPortfolioData = () => api.get(url.GET_USDPORTFOLIO_DATA);
export const getEuroPortfolioData = () => api.get(url.GET_EUROPORTFOLIO_DATA);
