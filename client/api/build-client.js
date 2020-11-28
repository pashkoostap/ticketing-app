import axios from 'axios';

export const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: process.env.BASE_URL,
      headers: req.headers,
    });
  }

  return axios;
};
