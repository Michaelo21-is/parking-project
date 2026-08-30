import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default async function editPark(form, lotId){
    await axios.put(`${apiBaseUrl}/lots/${lotId}`,
    form,
    {
      withCredentials: true,
    }
  );
}