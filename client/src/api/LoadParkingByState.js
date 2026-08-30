import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export async function loadParkingByState( state ) {
    const response = await axios.get(
        `${apiBaseUrl}/parking/district`,
        {
        params: {
            name: state,
        },
        }
    );

    return response.data;
}