import { useState, useEffect } from "react";
import axios from "axios";
import { getParkingByCity } from "../api/LoadParkingApi";

export default function App() {
  const [searchCityName, setSearchCityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const GEOAPI = import.meta.env.VITE_GEO_CODING_API_KEY;

  const [parkingData, setParkingData] = useState({
    parkName: [],
    floors: [],
    spots: [
      {
        status: false,
        type: "",
        floor: 0
      }
    ]
  });
  // loading praking by city name
  async function setParkingData(responseData) {

      let parkNameArray = [];
      let floorsArray = [];
      let spotsArray = [];

      let normal = 0;
      let disable = 0;
      let dean = 0;

      for (let i = 0; i < responseData.length; i++) {
        const parkingLot = responseData[i];

        parkNameArray.push(parkingLot.parkingName);
        floorsArray.push(parkingLot.floors);

        for (let j = 0; j < parkingLot.spots.length; j++) {
          const spot = parkingLot.spots[j];

          spotsArray.push({
            parkingName: parkingLot.parkingName,
            spot: spot.spot,
            floor: spot.floor,
            status: spot.status,
            type: spot.type
          });

          if (spot.status === true) {
            switch (spot.type) {
              case "normal":
                normal++;
                break;

              case "disabled":
                disable++;
                break;

              case "dean":
                dean++;
                break;

              default:
                break;
            }
          }
        }
      }

      setParkingData({
        parkName: parkNameArray,
        floors: floorsArray,
        spots: spotsArray,
        normalParkingNum: normal,
        disabledParkingNum: disable,
        deanParkingNum: dean
      });
    
  }

  async function handleOnSubmit() {
    setLoading(true);
    try{
      const responseData = await getParkingByCity(searchCityName);
      setParkingData(responseData);

    }
    catch (e) {
      const errorMessage = e.response?.data?.error;

      console.log("printing the error message", errorMessage);

      if (errorMessage === "City not found") {
        alert("השם של העיר לא רשום נכון");
        return;
      }

      if (errorMessage === "Parking lot not found in the specified city") {
        alert("השם של החניון לא רשום נכון");
        return;
      }

      alert("משהו לא עבד טוב בשרת בבקשה תבצע את הפעולה עוד פעם");
      console.log("something went bad, error message: ", e);
    }
    finally{
      setLoading(false);
    }  

  }
  async function getStateByCoordinates(latitude, longitude) {
  try {
    const response = await axios.get(
      "https://api.geoapify.com/v1/geocode/reverse",
      {
        params: {
          lat: latitude,
          lon: longitude,
          apiKey: GEOAPI,
        },
      }
    );

    return response.data.features?.[0]?.properties?.state || null;
    console.log("state:", state);
  } catch (e) {
    console.log("Failed to load state", e);
  }
}
  useEffect( ()=> {
    // Check if the browser supports the Geolocation API
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    // Success callback
    const handleSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    // Error callback
    const handleError = (err) => {
      setError(err.message);
    };

    // Request the current position
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true, // Forces the device to use GPS if available
      timeout: 5000,            // Time allowed to fetch location
      maximumAge: 0,            // Disables caching for a fresh reading
    });
    const state = await getStateByCoordinates(location.latitude, location.longitude);
    // axios.get(get by state) function that set all and do the axios call
    
  },[])

  return (
    <div dir="rtl">
      <div className="min-h-screen bg-white py-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-12 mr-25">
            <h1 className="text-5xl font-bold text-black mb-4">
              חני-טיק : מערכת חניה חכמה
            </h1>
          </div>

          <div className="mb-5 flex justify-center">
            <div className="relative w-full max-w-2xl">
              <input
                type="text"
                dir="rtl"
                placeholder="שם עיר"
                value={searchCityName}
                onChange={(e) => setSearchCityName(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 pr-12 text-right"
              />

              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                onClick={handleOnSubmit}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {loading && <p className="text-center">טוען...</p>}
        </div>
      </div>
    </div>
  );
}