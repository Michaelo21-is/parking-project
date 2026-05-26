import {  useState } from "react";
import axios from 'axios'
function Parking({parkingData}) {
  const [normalParkingNum, setNormalParkingNum] = useState(0);
  const [disableParkingNum, setDisableParkingNum] = useState(0);
  const [deanParkingNum, setDeanParkingNum] = useState(0);
  const [cityName, setCityName] = useState("");
  const [searchCityName, setSearchCityName] =useState("");  
  const [parkName, setParkName] = useState("");
  const [searchParkName, setSearchParkName] = useState("");

  

  

 

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