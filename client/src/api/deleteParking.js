import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default async function deleteParking(lotId) {
  const response = await axios.delete(
    `${apiBaseUrl}/lots/${lotId}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
}