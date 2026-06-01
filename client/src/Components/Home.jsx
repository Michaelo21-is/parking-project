import { useState, useEffect } from "react";
import axios from "axios";
import { getParkingByCity } from "../api/LoadParkingByCityApi";
import { Link } from 'react-router'

export default function App() {
  const [searchCityName, setSearchCityName] = useState("");
  const [loading, setLoading] = useState(false);
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
  async function loadParkingByCityName(responseData) {

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

      loadParkingByCityName({
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
      loadParkingByCityName(responseData);

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
      "https://geocode.maps.co/reverse",
      {
        params: {
          lat: latitude,
          lon: longitude,
          api_key: GEOAPI,
          format: "json"
        },
      }
    );

    console.log("maps.co response:", response.data);

    return response.data.address?.state || null;
  } catch (e) {
    console.log("Failed to load state", e);
    console.log("status:", e.response?.status);
    console.log("data:", e.response?.data);
    return null;
  }
}
async function searchByState() {
  if (!navigator.geolocation) {
    setError("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;


      console.log("user latitude:", latitude);
      console.log("user longitude:", longitude);

      const state = await getStateByCoordinates(latitude, longitude);
      console.log("state:", state);

      // פה תעשה axios לבאק לפי state
      // const responseData = await getParkingByState(state);
      // setParkingData(...)
    },
    (err) => {
      setError(err.message);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}
  useEffect( ()=> {
    searchByState();

  },[])

  return (
    <div dir="rtl">
      <div className="min-h-screen bg-white py-10">
        <Link className="absolute top-10 left-5 p-3 bg-slate-900
        hover:bg-slate-700 text-white font-semibold text-xl rounded-2xl"
        to={"/mangement"}
        >
            כניסה למורשים
         </Link>
         <Link className="absolute top-10 left-5 p-3 bg-slate-900
        hover:bg-slate-700 text-white font-semibold text-xl rounded-2xl"
        to={"/mangement"}
        >
           להתחברות
         </Link>
        <div className="max-w-4xl mx-auto px-6 mt-10">
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