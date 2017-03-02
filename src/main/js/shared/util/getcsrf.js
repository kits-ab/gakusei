export default function getCSRF() {
  try {
    const cookies = document.cookie.split('; ');
    const keys = cookies.map(cookie => cookie.split('=')[0]);
    const csrfValue = cookies[keys.indexOf('XSRF-TOKEN')].split('=')[1];
    return csrfValue;
  } catch (err) {
    return null;
  }
}
