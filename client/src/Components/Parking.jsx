import { useState, useEffect } from "react";
import { loadParkingDataByCityAndParkName } from "../api/LoadParkingDataByCityAndParkName";
import axios from 'axios'
function Parking() {
  const [normalParkingNum, setNormalParkingNum] = useState(0);
  const [disableParkingNum, setDisableParkingNum] = useState(0);
  const [deanParkingNum, setDeanParkingNum] = useState(0);
  const [sumOfFloors, setSumOfFloor] = useState(0);
  const [currentFloor, setCurrentFloor] = useState(null);
  const [cityName, setCityName] = useState("");
  const [searchCityName, setSearchCityName] =useState("");  
  const [parkName, setParkName] = useState("");
  const [searchParkName, setSearchParkName] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadParkingData(){
    try{
      const responseData = await loadParkingDataByCityAndParkName(parkName, cityName);
      let normal = 0;
      let disable = 0;
      let dean = 0;
      setSumOfFloor(responseData.floors)

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
  async function loadParkingData(){
    setLoading(true)
    const queryParms = new URLSearchParams(window.location.search);

    const parkName = queryParms.get(`parkName`);
    const cityName = queryParms.get(`cityName`);
    const floor = queryParms.get(`floor`);
    setParkName(parkName);
    setCityName(cityName);
    setfloor(currentFloor);
    if(floor.isEmpty){
      await loadParkingDataByCityAndParkName(cityName, parkName)
    }
    else{
      // search it by floor num 
    }
    setLoading(false);
  }
  useEffect(() =>{
    loadParkingData();
  },[currentFloor])

  

 

  return (
    <div className="rounded-lg p-4 mt-20">
      

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