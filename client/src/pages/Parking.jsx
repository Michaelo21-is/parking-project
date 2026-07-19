import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";

import Loading from "../Components/Loading";

export default function Parking() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const { lotId } = useParams();
  const [searchParams] = useSearchParams();

  const parkName = searchParams.get("parkName");
  const cityName = searchParams.get("parkCity");

  const socketRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [currentFloor, setCurrentFloor] = useState(null);
  const [parkingFloors, setParkingFloors] = useState([]);

  const [normalParkingNum, setNormalParkingNum] = useState(0);
  const [disabledParkingNum, setDisabledParkingNum] = useState(0);
  const [deanParkingNum, setDeanParkingNum] = useState(0);

  function applyParkingData(responseData) {
    if (Array.isArray(responseData.parkingFloors)) {
      setParkingFloors(responseData.parkingFloors);
    }

    const freeSpots = responseData.freeSpots;

    setNormalParkingNum(freeSpots.regular);
    setDisabledParkingNum(freeSpots.disabled);
    setDeanParkingNum(freeSpots.dean);
  }


  // שאני טוען את הלוט אייידי ואת הapibaseurl
  useEffect(() => {

    if (!lotId && !apiBaseUrl) {
      return;
    } 

    const socket = io(apiBaseUrl, {
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      // ה-backend מקבל רק lotId
      socket.emit("joinLot", lotId);
    });

    socket.on("parkingUpdated", (updatedParkingData) => {
      console.log("Parking updated:", updatedParkingData);

      if (
        updatedParkingData.floor !== undefined &&
        Number(updatedParkingData.floor) !== Number(currentFloor)
      ) {
        return;
      }

      applyParkingData(updatedParkingData);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection failed:", error.message);
    });

    return () => {
      socket.emit("leaveLot", lotId);
      socket.off("parkingUpdated");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [apiBaseUrl, lotId]);

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
          <span className="text-3xl font-bold">{deanParkingNum}</span>
        </div>

        <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-2 border-gray-400 bg-green-100">
          <span className="text-lg">רגיל</span>
          <span className="text-3xl font-bold">{normalParkingNum}</span>
        </div>

        <div className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-2 border-gray-400 bg-blue-200">
          <span className="text-lg">נכה</span>
          <span className="text-3xl font-bold">{disabledParkingNum}</span>
        </div>
      </div>

      <p className="mt-6 text-center font-semibold text-gray-800">
        לחץ על קומה כדי להחליף קומה
      </p>

      <div className="mt-3 flex justify-center gap-2">
        {parkingFloors.map((floor) => (
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