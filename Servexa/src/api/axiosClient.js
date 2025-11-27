import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://localhost:7078",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json"
  }
});

export default axiosClient;
