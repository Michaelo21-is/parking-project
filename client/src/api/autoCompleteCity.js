import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export async function autoCompleteCityRequest(query) {
  const response = await axios.get(
    `${apiBaseUrl}/parking/cities/autocomplete`,
    {
      params: {
        q: query,
      },
    }
  );

  return response.data;
}