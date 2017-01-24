export default function getCSRF() {
  let cookies = document.cookie.split('; ');
  let keys = cookies.map(cookie => cookie.split('=')[0]);
  let csrfValue = cookies[keys.indexOf("XSRF-TOKEN")].split('=')[1];
  return csrfValue;
}
