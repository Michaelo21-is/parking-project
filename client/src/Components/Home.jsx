import { useState, useEffect } from "react";
import axios from "axios";
import { getParkingByCity } from "../api/LoadParkingByCityApi";
import { Link } from "react-router";
import Loading from "./Loading";
import { getStateByCoordinates } from "../api/GeoCodingApi";

export default function App() {
  

  const [searchCityName, setSearchCityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const cityName = ["תל אביב", "חולון"];
  const [suggestedCity, setSuggestedCity] = useState([]);

  // geting park info through city search
  async function handleOnSubmit() {
    setLoading(true);

    try {
      const responseData = await getParkingByCity(searchCityName);
      // setting up the city information
      setSuggestedCity([]);
    } catch (e) {
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
    } finally {
      setLoading(false);
    }
  }

  

  async function searchByState() {
    setLoading(true);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
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


        setLoading(false);

        // פה תעשה axios לבאק לפי state
        // const responseData = await getParkingByState(state);
        // setParkingData(...)
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }

  function handleOnCityInput(query) {
    setSearchCityName(query);

    if (query.trim() === "") {
      setSuggestedCity([]);
      return;
    }

    const filteredCities = cityName.filter((city) =>
      city.includes(query.trim())
    );

    setSuggestedCity(filteredCities);
  }

  useEffect(() => {
    searchByState();
  }, []);

  return (
    <div dir="rtl">
      <div className="min-h-screen bg-white py-10">
        <Link
          className="absolute top-10 left-5 p-3 bg-slate-900 hover:bg-slate-700 text-white font-semibold text-md rounded-xl"
          to={"/management"}
        >
          כניסה למורשים
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
                onChange={(e) => handleOnCityInput(e.target.value)}
                className="w-full border border-gray-300 rounded p-2 pr-12 text-right"
              />

              <button
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

              {suggestedCity.length > 0 && (
                <div className="absolute z-10 mt-2 w-full rounded border border-gray-300 bg-white shadow">
                  {suggestedCity.map((city) => (
                    <button
                      key={city}
                      type="button"
                      className="block w-full px-4 py-2 text-right hover:bg-gray-100"
                      onClick={() => {
                        setSearchCityName(city);
                        setSuggestedCity([]);
                      }}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading && <Loading />}
        </div>
      </div>
    </div>
  );
}