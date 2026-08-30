import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export async function loginRequest(form) {
  const response = await axios.post(
    `${apiBaseUrl}/auth/login`,
    {
      email: form.email,
      password: form.password,
    },
    {
      withCredentials: true,
    }
  );
}