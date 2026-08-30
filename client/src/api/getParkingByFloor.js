import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export default async function getParkingByFloor( currentFloor,cityName, parkName) {
  const response = await axios.get(`${apiBaseUrl}/parking/lot`, {
    params: {
      cityName,
      lotName: parkName,
      floor: currentFloor,
    },
  });

  return response.data;
}