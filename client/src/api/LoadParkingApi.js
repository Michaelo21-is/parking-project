import axios from "axios";

export async function getParkingByCity(cityName) {
  const response = await axios.get("http://localhost:3000/parking/city", {
    params: {
      cityName: cityName
    }
  });

  return response.data;
}