import { Link } from "react-router";

export default function ShowParking({ parkDetails }) {
  return (
    <div className="mt-5">
      {Object.entries(parkDetails).map(([cityName, parkingLots]) => (
        <div key={cityName} className="mb-8">
          <p className="text-lg font-semibold">
            {cityName}:
          </p>

          {parkingLots.map((parkingLot) => (
            <div
              key={parkingLot.lotId}
              className="mt-3 border p-4 hover:cursor-pointer hover:shadow-md rounded-2xl"
            >
              <Link
                className="block text-lg"
                to={`/parking/${parkingLot.lotId}`}
              >
                {parkingLot.name}
              </Link>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}