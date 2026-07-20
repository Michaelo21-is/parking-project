import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

import Loading from "../Components/Loading";

export default function Parking() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const { lotid } = useParams();
  const [ searchParams ] = useSearchParams();

  const parkName = searchParams.get("parkName");
  const cityName = searchParams.get("parkCity");

  const socketRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(null);
  const [parkingDeatils, setParkingDeatils] = useState({
    disableSum:0,
    deanSum:0,
    regulaerSum:0,
    sumOfFloors:[], 
  });


  // שאני טוען את הלוט אייידי ואת הapibaseurl
  useEffect(() => {

    if (!lotid && !apiBaseUrl) {
      return;
    } 
    console.log("lotid: ", lotid)

    const socket = io(apiBaseUrl, {
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("connected start")
    });

    socket.emit("joinLot", (lotid, callback) => {
    console.log("joinLot received:", lotid);

    if (!lotid) {
      return;
    }

    const roomName = `lot:${lotid}`;

    socket.join(roomName);

    console.log(`Socket ${socket.id} joined room ${roomName}`);
    console.log("Socket rooms:", [...socket.rooms]);

  
    });


    return () => {
      socket.emit("disconnect");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [apiBaseUrl, lotid]);

  useEffect(() => {
    // tell in socket connectyion to 
  }, [currentFloor]);

  



  return (
    <div className="mt-20 rounded-lg p-4" dir="rtl">
      <h2 className="mb-4 text-center text-2xl font-bold">
        {parkName}, {cityName}
      </h2>

      {currentFloor !== null && (
        <p className="mb-2 text-center font-semibold">
          קומה נוכחית: {currentFloor}
        </p>
      )}

      <p className="mb-6 text-center text-2xl text-gray-600">
        מספר חניות פנויות:
      </p>

      <div className="flex justify-center gap-8">
        <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-2 border-gray-400">
          <span className="text-lg">דיקן</span>
          <span className="text-3xl font-bold">{parkingDeatils.deanSum}</span>
        </div>

        <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-2 border-gray-400 bg-green-100">
          <span className="text-lg">רגיל</span>
          <span className="text-3xl font-bold">{parkingDeatils.regulaerSum}</span>
        </div>

        <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-2 border-gray-400 bg-blue-200">
          <span className="text-lg">נכה</span>
          <span className="text-3xl font-bold">{parkingDeatils.disableSum}</span>
        </div>
      </div>

      <p className="mt-6 text-center font-semibold text-gray-800">
        לחץ על קומה כדי להחליף קומה
      </p>

      <div className="mt-3 flex justify-center gap-2">
        {parkingDeatils.sumOfFloors.map((floor) => (
          <button
            type="button"
            key={floor}
            onClick={() => setCurrentFloor(floor)}
            className={`cursor-pointer rounded-lg border px-4 py-2 transition ${
              Number(currentFloor) === Number(floor)
                ? "border-black bg-black text-white"
                : "border-gray-400 hover:bg-gray-100"
            }`}
          >
            קומה {floor}
          </button>
        ))}
      </div>

      {loading && (
          <Loading />
      )}
    </div>
  );
}