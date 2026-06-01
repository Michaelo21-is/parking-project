import axios from "axios";
export async function loadParkingDataByCityAndParkName(cityName, parkName){
    const response = await axios.get("http://localhost:3000/parking/lot", {
    params: {
      cityName: cityName,
      lotName: parkName
    }
  });

  return response.data;
} 