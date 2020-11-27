import axios from 'axios';

export const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      baseURL: '/',
      headers: req.headers,
    });
  }

  return axios;
};
