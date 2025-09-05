export const apiBaseUrl = process.env.REACT_APP_ORDER_API_URL
// export const crmApiBaseUrl = process.env.CRM_API_URL
export const crmApiBaseUrl = "https://www.portal.xqtrades.com/api"
export const apiBaseUrl1 = "https://www.portal.xqtrades.com/api"
export const apiKey = process.env.REACT_APP_ORDER_API_KEY
export const token = localStorage.getItem('token');
export const logoLight = "https://www.portal.xqtrades.com//assets/images/logoIcon/logo.png"
export const logoDark = "https://www.portal.xqtrades.com//assets/images/logoIcon/logo.png"

export const logoSm = "https://www.portal.xqtrades.com//assets/images/logoIcon/favicon.png"

const user = JSON.parse(localStorage.getItem('user'));
export const account = user ? user.account : null;