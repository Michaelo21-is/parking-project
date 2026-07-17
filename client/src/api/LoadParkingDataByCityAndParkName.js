import axios from "axios";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
export async function loadParkingDataByCityAndParkName(cityName, parkName){
    const response = await axios.get(`${apiBaseUrl}/parking/lot`, {
    params: {
      cityName: cityName,
      lotName: parkName
    }
  });

  return response.data;
} 