import axios from "axios";
const apiBaseUrl = import.meta.env.API_BASE_URL
export async function loadParkingByState({state}) {
    const response = axios.get(`${apiBaseUrl}/district`, 
        
    )
}