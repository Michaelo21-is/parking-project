import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default async function addParking(form){
    await axios.post(`${apiBaseUrl}/lots`,
    {
      name: form.name,
      cityName: form.cityName,
      address: form.address,
      spotCount: Number(form.spotCount),
    },
    {
      withCredentials: true,
    }
  );
}