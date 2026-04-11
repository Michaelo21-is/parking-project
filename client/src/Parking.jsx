import { useEffect, useState } from "react";
import parkingData from "./data/mockData.json";

function Parking() {
  const [normalParkingNum, setNormalParkingNum] = useState(0);
  const [disableParkingNum, setDisableParkingNum] = useState(0);
  const [deanParkingNum, setDeanParkingNum] = useState(0);
  const [parkName, setParkName] = useState("");
  const [searchParkName, setSearchParkName] = useState("");

  const validParkingName = ["חניון חולון", "חניון תל אביב", "חניון חיפה"];

  useEffect(() => {
    loadParkingData("חניון חולון");
  }, []);

  function checkIfParkingNameValid(name) {
    return validParkingName.includes(name);
  }

  function loadParkingData(name) {
    const selectedParking = parkingData.find(
      (parking) => parking.parkingName === name
    );

    if (!selectedParking) {
      alert("חניון לא קיים");
      return;
    }

    let normal = 0;
    let disable = 0;
    let dean = 0;

    for (let i = 0; i < selectedParking.spots.length; i++) {
      const spot = selectedParking.spots[i];

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

    setParkName(name);
    setNormalParkingNum(normal);
    setDisableParkingNum(disable);
    setDeanParkingNum(dean);
  }

  function handleOnSubmit() {
    if (!checkIfParkingNameValid(searchParkName)) {
      alert("not existing park");
      return;
    }

    loadParkingData(searchParkName);
  }

  return (
    <div className="rounded-lg p-4">
      <div className="mb-4 flex justify-center">
        <div className="relative w-full max-w-2xl">
          <input
            type="text"
            placeholder="חיפוש"
            value={searchParkName}
            onChange={(e) => setSearchParkName(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 pr-10 text-right"
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

      <h2 className="text-2xl font-bold text-center mb-4">{parkName}</h2>
      <p className="text-gray-600 text-center mb-6">מספר חניות פנויות:</p>

      <div className="flex justify-center gap-8">
        <div className="w-40 h-40 rounded-full border-2 border-gray-400 bg-green-100 flex flex-col items-center justify-center">
          <span className="text-lg">שמור</span>
          <span className="text-3xl font-bold">{deanParkingNum}</span>
        </div>

        <div className="w-40 h-40 rounded-full border-2 border-gray-400 bg-white flex flex-col items-center justify-center">
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