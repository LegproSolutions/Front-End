// utils/axiosConfig.ts
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL; //added this line 08/08/2025
axios.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    client_id: import.meta.env.VITE_CLIENT_ID, // store in .env
  };
  return config;
});
//14/08/2025

export default axios;
