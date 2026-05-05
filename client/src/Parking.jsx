import { useEffect, useState } from "react";
import axios from 'axios'
function Parking() {
  const [normalParkingNum, setNormalParkingNum] = useState(0);
  const [disableParkingNum, setDisableParkingNum] = useState(0);
  const [deanParkingNum, setDeanParkingNum] = useState(0);
  const [cityName, setCityName] = useState("");
  const [searchCityName, setSearchCityName] =useState("");  
  const [parkName, setParkName] = useState("");
  const [searchParkName, setSearchParkName] = useState("");

  const validParkingName = ["חניון חולון", "חניון תל אביב", "חניון חיפה"];

  useEffect(() => {
    loadParkingData("חולון", "חניון HIT");
  }, []);

  

  async function loadParkingData(searchCityName, searchParkName) {
    try{
      const response = await axios.get("http://localhost:3000/parking/lot",
        {params:{
          cityName: searchCityName,
          lotName: searchParkName,
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

      setParkName(searchParkName);
      setCityName(searchCityName);
      setNormalParkingNum(normal);
      setDisableParkingNum(disable);
      setDeanParkingNum(dean);
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
    loadParkingData(searchCityName, searchParkName);
  }

  return (
    <div className="rounded-lg p-4 mt-20">
      <div className="mb-5 flex justify-center ">
        <div className="relative w-full max-w-2xl">
          <div className="flex flex-row">
            <input
              type="text"
              placeholder="שם של החניון"
              dir="rtl"
              value={searchParkName}
              onChange={(e) => setSearchParkName(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 pr-10 text-right"
            />
            <input
              type="text"
              dir="rtl"
              placeholder="עיר"
              value={searchCityName}
              onChange={(e) => setSearchCityName(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 pr-10 text-right"
            />
           </div> 
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

      <h2 className="text-2xl font-bold text-center mb-4">{parkName}, {cityName}</h2>
      <p className="text-gray-600 text-center mb-6">מספר חניות פנויות:</p>

      <div className="flex justify-center gap-8">
        <div className="w-40 h-40 rounded-full border-2 border-gray-400  flex flex-col items-center justify-center">
          <span className="text-lg">דיקן</span>
          <span className="text-3xl font-bold">{deanParkingNum}</span>
        </div>

        <div className="w-40 h-40 rounded-full border-2 border-gray-400 bg-green-100 flex flex-col items-center justify-center">
          <span className="text-lg">רגיל</span>
          <span className="text-3xl font-bold">{normalParkingNum}</span>
        </div>

        <div className="w-40 h-40 rounded-full border-2 border-gray-400 bg-blue-200 flex flex-col items-center justify-center">
          <span className="text-lg">נכה</span>
          <span className="text-3xl font-bold">{disableParkingNum}</span>
        </div>
      </div>
    </div>
  );
}

export default Parking;