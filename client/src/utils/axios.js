import axios from "axios";

const instance = axios.create({
  baseURL: "https://onetwork-backend.onrender.com",
  withCredentials: true,
  timeout: 10000,
  delayed: true,
});

instance.interceptors.request.use(
  (config) => {
    if (config.delayed) {
      return new Promise((resolve) => setTimeout(() => resolve(config), 1000));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (err.response) {
      if (err.response.status === 401) {
        originalConfig._retry = true;

        try {
          const { data } = await instance.get("/refresh_token");
          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${data.token}`;
          originalConfig.headers["Authorization"] = `Bearer ${data.token}`;
          return instance(originalConfig);
        } catch (_error) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }

          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
