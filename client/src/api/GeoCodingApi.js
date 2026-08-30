import axios from "axios";

const GEOAPI = import.meta.env.VITE_GEO_CODING_API_KEY;

/// getting state by coordinates by geocode api
  export async function getStateByCoordinates(latitude, longitude) {
    try {
      const response = await axios.get("https://geocode.maps.co/reverse", {
        params: {
          lat: latitude,
          lon: longitude,
          api_key: GEOAPI,
          format: "json",
        },
      });

      return response.data.address?.state || null;
    } catch (e) {
      return null;
    }
  }