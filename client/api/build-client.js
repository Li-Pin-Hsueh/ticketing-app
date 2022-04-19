import axios from 'axios';

const BuildClient = ({ req }) => {
  if( typeof window === 'undefined') {
    // We are on the server

    return axios.create({
      baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers
    });
  } else {
    // on the browser
    return axios.create({
      baseURL: '/',
      // don't need headers because the browser will handle it for us
    })
  }
}

export default BuildClient;