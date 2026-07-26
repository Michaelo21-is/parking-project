import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import { getParkingInfo } from "../api/getParkingInfo";
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


  useEffect(() => {
    async function initalPage(){
      if (!lotid || !apiBaseUrl) {
        return;
      }

      const responseData =  await getParkingInfo(cityName, parkName, null);

      console.log("response from server: \n", responseData);

      const socket = io(apiBaseUrl);
      socketRef.current = socket;
      socket.on("connect", () => {

      });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }
  initalPage();
}, [apiBaseUrl, lotid]);

  useEffect(() => {
    async function changeFloor(){
      const responseData = await getParkingInfo(cityName, parkName, changeFloor)
      console.log("response Data from changing floor: ", responseData);
    }
  }, [currentFloor]);





  return (
    <div dir="rtl" className="flex min-h-dvh flex-col bg-canvas">

      <header className="sticky top-0 z-20 border-b border-border bg-surface/85 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to={"/"} className="flex items-center gap-2 text-sm font-semibold text-text-primary sm:text-base">
            <span className="flex h-9 w-9 items-center justify-center rounded-control bg-primary text-on-primary">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 11h2.5a2.5 2.5 0 000-5H12v11M4 5.5A2.5 2.5 0 016.5 3h11A2.5 2.5 0 0120 5.5v13a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 18.5v-13z"
                />
              </svg>
            </span>
            חניה טק
          </Link>

          <span className="rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-semibold text-text-muted sm:text-sm">
            מצב חניון
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="animate-fade-in">

          <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                {parkName}
              </h1>
              <p className="mt-1.5 flex items-center gap-1.5 text-sm text-text-muted sm:text-base">
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {cityName}
              </p>
            </div>

            {currentFloor !== null && (
              <p className="inline-flex items-center gap-2 self-start rounded-full border border-primary/25 bg-primary-50 px-3.5 py-1.5 text-sm font-semibold text-primary sm:self-auto">
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="tabular-nums">קומה נוכחית: {currentFloor}</span>
              </p>
            )}
          </div>

          <section>
            <h2 className="text-lg font-bold tracking-tight text-text-primary sm:text-xl">
              מספר חניות פנויות:
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-3 sm:gap-5">

              <div className="rounded-card border border-border bg-surface p-5 shadow-card transition-shadow duration-200 hover:shadow-card-hover sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-success-50 text-success">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 17H4a1 1 0 01-1-1v-3.3a2 2 0 01.2-.87L5.4 7.2A2 2 0 017.2 6h9.6a2 2 0 011.8 1.2l2.2 4.63a2 2 0 01.2.87V16a1 1 0 01-1 1h-1M3.5 12.5h17"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </span>
                  <span className="text-base font-semibold text-text-secondary">
                    רגיל
                  </span>
                </div>
                <p className="mt-4 text-4xl font-bold tabular-nums tracking-tight text-text-primary sm:text-5xl">
                  {parkingDeatils.regulaerSum}
                </p>
              </div>

              <div className="rounded-card border border-border bg-surface p-5 shadow-card transition-shadow duration-200 hover:shadow-card-hover sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-primary-50 text-primary">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.5 4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M11 8.5V13h4l2.5 6.5M14.5 15.5a4.5 4.5 0 11-4.6-4.5"
                      />
                    </svg>
                  </span>
                  <span className="text-base font-semibold text-text-secondary">
                    נכה
                  </span>
                </div>
                <p className="mt-4 text-4xl font-bold tabular-nums tracking-tight text-text-primary sm:text-5xl">
                  {parkingDeatils.disableSum}
                </p>
              </div>

              <div className="rounded-card border border-border bg-surface p-5 shadow-card transition-shadow duration-200 hover:shadow-card-hover sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-surface-muted text-text-secondary">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M11.48 3.5a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                  </span>
                  <span className="text-base font-semibold text-text-secondary">
                    דיקן
                  </span>
                </div>
                <p className="mt-4 text-4xl font-bold tabular-nums tracking-tight text-text-primary sm:text-5xl">
                  {parkingDeatils.deanSum}
                </p>
              </div>

            </div>
          </section>

          <section className="mt-8 rounded-card border border-border bg-surface p-5 shadow-card sm:mt-10 sm:p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-text-secondary sm:text-base">
              <svg
                className="h-5 w-5 shrink-0 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
                />
              </svg>
              לחץ על קומה כדי להחליף קומה
            </p>

            <div className="mt-4 flex flex-wrap gap-2.5">
              {parkingDeatils.sumOfFloors.map((floor) => (
                <button
                  type="button"
                  key={floor}
                  onClick={() => setCurrentFloor(floor)}
                  aria-pressed={Number(currentFloor) === Number(floor)}
                  className={`inline-flex h-11 min-w-24 touch-manipulation cursor-pointer items-center justify-center gap-1.5 rounded-control border px-4 text-sm font-semibold tabular-nums transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 active:scale-[0.98] ${
                    Number(currentFloor) === Number(floor)
                      ? "border-primary bg-primary text-on-primary shadow-card focus-visible:ring-primary/30"
                      : "border-border bg-surface text-text-secondary hover:border-primary/50 hover:bg-primary-50 hover:text-primary focus-visible:ring-primary/25"
                  }`}
                >
                  {Number(currentFloor) === Number(floor) && (
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  )}
                  קומה {floor}
                </button>
              ))}
            </div>
          </section>

        </div>
      </main>

      {loading && (
          <Loading />
      )}
    </div>
  );
}
