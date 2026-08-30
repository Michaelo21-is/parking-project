import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export async function signOutRequest() {
  await axios.post(`${apiBaseUrl}/auth/logout`, {}, { withCredentials: true });
}