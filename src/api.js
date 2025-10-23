// export const API_BASE_URL = "http://localhost:5000/api";
export const API_BASE_URL = process.env.REACT_APP_API_URL;
// export const API_BASE_URL = "http://192.168.1.5:5000/api";

export function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

