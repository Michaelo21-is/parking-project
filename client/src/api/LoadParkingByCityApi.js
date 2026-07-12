import axios from "axios";
const apiBaseUrl = import.meta.env.API_BASE_URL;
export async function getParkingByCity(cityName) {
  
  const response = await axios.get(`${apiBaseUrl}/parking/city`, {
    params: {
      cityName: cityName
    }
  });

  return response.data;
}