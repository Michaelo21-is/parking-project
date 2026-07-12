import { useState, useEffect } from "react";
import { loadParkingDataByCityAndParkName } from "../api/LoadParkingDataByCityAndParkName";
import axios from 'axios'
import Loading from "./Loading";
import io from "socket.io-client"
import { data } from "react-router-dom";
export default function Parking() {
  const apiBaseUrl = import.meta.env.API_BASE_URL
  const socket = io(apiBaseUrl);
  
  
  const [loading, setLoading] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(null);
  const [ parkingFloor, setParkingFloor ] = useState([]);
  async function loadParkingData(responseData){
    try{
      // need to return num of parking sum of floors and thats it
      setParkingFloor(responseData.parkingFloor)
      setNormalParkingNum(responseData.normal);
      setDisableParkingNum(responseData.disable);
      setDeanParkingNum(responseData.dean);
      }
      catch(e){
        const erorrMessage = e.response.data.error
        console.log("printing the error maseege",erorrMessage)
        if(erorrMessage === "City not found"){
          alert("page not found");
          return;
          }
        if(erorrMessage === "Parking lot not found in the specified city"){
          alert("page not found")
          return
        }
        alert("משהו לא עבד טוב בשרת בבקשה תבצע את הפעולה עוד פעם");
        console.log("something went bad, error maseege, ", e);        
      }
  }
  
    useEffect(() => {
      const queryParams = new URLSearchParams(window.location.search);

      const park = queryParams.get("parkName");
      const city = queryParams.get("cityName");
      const floor = queryParams.get("floor");

      setParkName(park || "");
      setCityName(city || "");
      setCurrentFloor(floor || "");
      const handleUpdatePark = (responseData) => {
      loadParkingData(responseData);
      };

      socket.on("update-park", handleUpdatePark);

      return () => {
        socket.off("update-park", handleUpdatePark);
      };
    }, []);
    useEffect(() =>{
      if(currentFloor === null) return;
      socket.emit("chagne_floor",{
        floor: currentFloor,
      })
    },[floor])
    useEffect(() => {
      if (!parkName || !cityName || currentFloor === null) return;

      socket.emit("join_parking", {
        parkName,
        cityName,
        floor: currentFloor,
      });
    }, [parkName, cityName]);
  
  async function handleOnChangeFloor(chosenFloor) {
    setCurrentFloor(chosenFloor);
  }
 

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
      <p className="text-md text-white font-semibold mt-2">לחץ כאן כדי להחליף את הקומות</p>
      <div className="mt-2 flex-row justify-center">
        {parkingFloor.map((floor) => (
            <button
              key={floor}
              onClick={() => handleOnChangeFloor(floor)}
              className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100"
            >
             {floor}
            </button>
          ))}
      </div>
      { loading && <Loading />}
    </div>
  );
}
