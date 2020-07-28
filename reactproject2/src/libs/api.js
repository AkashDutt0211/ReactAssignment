import axios from 'axios';

const callApi = async (credential, url, call) => {
  const { page } = credential;
  try {
    const response = await axios({
      method: call,
      baseURL: 'https://reqres.in/api/',
      url,
      data: credential,
      params: {
        page: page || 1,
      },
      headers: { Authorization: localStorage.getItem('loginToken') },
    });
    return response;
  } catch (err) {
    return (err);
  }
};
export default callApi;
