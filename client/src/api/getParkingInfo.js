import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export async function getParkingInfo(lotId) {
  const response = await axios.get(
    `${apiBaseUrl}/lots/${lotId}`
  );

  return response.data;
}