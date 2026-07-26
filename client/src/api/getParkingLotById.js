import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export async function getParkingLotById(lotId) {

  const response = await axios.get(
    `${apiBaseUrl}/lots/${lotId}`,
  );

  return response.data;
}