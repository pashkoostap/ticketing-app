import axios from 'axios';

export const buildClient = ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      baseURL: 'http://ticketing-ingress-srv',
      headers: req.headers,
    });
  }

  return axios;
};
