
import {Link} from "react-router-dom"
import { useState } from "react";
export default function App() {
  const [searchCityName, setSearchCityName] =useState("");
  const [parkingData, setParkingData] = useState({
    cityName: "",
    parkName: "",
    normalParkingNum: 0,
    disableParkingNum: 0,
    deanParkingNum: 0,
  });
  async function loadParkingData(searchCityName) {
    try{
      const response = await axios.get("http://localhost:3000/parking/city",
        {params:{
          cityName: searchCityName
        }}
      );
      const responseData = await response.data;
      let normal = 0;
      let disable = 0;
      let dean = 0;

      for (let i = 0; i < responseData.spots.length; i++) {
        const spot = responseData.spots[i];

        if (spot.status === true) {
          switch (spot.type) {
            case "normal":
              normal++;
              break;
            case "disable":
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

      setParkingData({
        cityName: responseData.cityName,
        parkName: responseData.parkName,
        normalParkingNum: normal,
        disableParkingNum: disable,
        deanParkingNum: dean
      });
      }
      catch(e){
        const erorrMessage = e.response.data.error
        console.log("printing the error maseege",erorrMessage)
        if(erorrMessage === "City not found"){
          alert("השם של העיר לא רשום נכון");
          return;
          }
        if(erorrMessage === "Parking lot not found in the specified city"){
          alert("השם של החניון לא רשום נכון")
          return
        }
        alert("משהו לא עבד טוב בשרת בבקשה תבצע את הפעולה עוד פעם");
        console.log("something went bad, error maseege, ", e);        
      }
    

    
  }
  function handleOnSubmit() {
    loadParkingData(searchCityName);
  }
  return (
    <div dir="rtl">
    <div className="min-h-screen bg-white py-10 ">
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
        </div>

      </div>
     </div>
  )
  
}

