import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export async function getParkingInfo(cityName,lotName,floor) {
  const response = await axios.get(`${apiBaseUrl}/parking/lot`, {
    params: {
      cityName,
      lotName,
      floor,
    },
  });

  return response.data;
}