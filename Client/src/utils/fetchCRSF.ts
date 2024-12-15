import axiosInstance from './axiosInstance'

const fetchCsrfToken = async () => {
    const response = await axiosInstance({
      url:'/generate/csrf-token',
      method:'GET'
    })
    const data = response.data;
    document.cookie = `_csrf=${data.csrfToken}`;
  };

export default fetchCsrfToken;