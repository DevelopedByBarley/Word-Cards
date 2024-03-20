import axios from 'axios';


// Axios instance létrehozása az authentikációhoz
export const fetchAuthentication = axios.create();

// Request interceptor hozzáadása az access token beállításához
fetchAuthentication.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      return config;
    }

    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`
      }
    };
  },
  (error) => Promise.reject(error)
);

// Response interceptor hozzáadása az access token kezeléséhez
fetchAuthentication.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);

    // Hiba esetén 403-as válaszkóddal újra kért kérés ellenőrzése
    if (error.response.status !== 403) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // Ismételt kérés megakadályozása
    if (originalRequest.isRetry) {
      return Promise.reject(error);
    }

    originalRequest.isRetry = true;

    // Új access token kérése és mentése localStorage-ba
    return axios
      .get("/get-token", {
        withCredentials: true,
      })
      .then((res) => {
        let accessToken = res.data.accessToken;
        localStorage.removeItem('accessToken');
        localStorage.setItem('accessToken', accessToken);
      })
      .then(() => fetchAuthentication(originalRequest))
      .catch(err => {
        console.log(err);
        localStorage.clear();
        window.location.href = "/user";
      })
  }
);
