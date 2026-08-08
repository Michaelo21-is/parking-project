import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export async function signUpRequest(form) {
  await axios.post(
    `${apiBaseUrl}/auth/signup`,
    {
      fullName: form.fullName,  
      email: form.email,
      password: form.password,
      city: form.cityId,
      role: form.role === "admin" ? "admin" : "worker"
    },
    {
      withCredentials: true,
    }
  );
}