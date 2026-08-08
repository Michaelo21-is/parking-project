import { useState, useEffect } from "react";
import axios from "axios";
import { getParkingByCity } from "../api/LoadParkingByCityApi";
import { Link } from "react-router-dom";
import Loading from "../Components/Loading";
import { loadParkingByState } from "../api/LoadParkingByState";
import { getStateByCoordinates } from "../api/GeoCodingApi";
import ShowParking from "../Components/HomeComponent/ShowParking";
import { autoCompleteCityRequest } from "../api/autoCompleteCity";
import { useToast } from "../Components/Toast/ToastContext";

export default function App() {

  const { toast } = useToast();

  const [searchCityName, setSearchCityName] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedCity, setSuggestedCity] = useState([]);

  const [parkDeatils, setParkDeatils] = useState({});
  const [visibleParkDetails, setVisibleParkDetails] = useState({}); // need it for handle on submit


  // geting park info through city search
  async function handleOnSubmit() {
    const normalizedCityName = searchCityName.trim(); // removing all the uncessery spaceing

    if (!normalizedCityName) {
      toast.info("יש להזין שם עיר", {
        description: "הקלד שם עיר בשדה החיפוש כדי לראות את החניונים בה",
      });
      return;
    }

    setLoading(true);


    try {
      const responseData = await getParkingByCity(searchCityName);


      const parkingLots = responseData.map((parkingLot) => ({
      lotId: parkingLot._id,
      name: parkingLot.name,
      }));


      setVisibleParkDetails({
        [normalizedCityName]: parkingLots,
      });

      setSuggestedCity([]);
    } catch (e) {
      const errorMessage = e.response?.data?.error;

      console.log("printing the error message", errorMessage);

      if (errorMessage === "City not found") {
        toast.error(`לא נמצאה עיר בשם "${normalizedCityName}"`, {
          description: "בדוק את האיות או בחר עיר מתוך ההצעות בחיפוש",
        });
        return;
      }


      toast.error("החיפוש נכשל", {
        description: "משהו השתבש בשרת, אפשר לנסות שוב",
        action: { label: "נסה שוב", onClick: handleOnSubmit },
      });
      console.log("something went bad, error message: ", e);
    } finally {
      setLoading(false);
    }
  }



  async function searchByState() {
    setLoading(true);

    if (!navigator.geolocation) {
      toast.info("איתור מיקום לא נתמך בדפדפן", {
        description: "אפשר לחפש חניונים לפי שם עיר בשדה החיפוש",
      });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const state = await getStateByCoordinates(latitude, longitude);

          const responseData = await loadParkingByState(state);

          setVisibleParkDetails(responseData);
          setParkDeatils(responseData);
        } catch (e) {
          toast.error("לא הצלחנו לטעון חניונים באזור שלך", {
            description: "אפשר לחפש לפי שם עיר, או לנסות שוב",
            action: { label: "נסה שוב", onClick: searchByState },
          });
          console.log("failed loading parking by state: ", e);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("לא קיבלנו גישה למיקום", {
          description: "חפש חניונים לפי שם עיר, או אפשר גישה למיקום בהגדרות הדפדפן",
        });
        setLoading(false);
      }
    );
  }

  async function handleOnCityInput(query) {
    setSearchCityName(query);

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setSuggestedCity([]);
      setVisibleParkDetails(parkDeatils);
      return;
    }

    try {
      const responseData = await autoCompleteCityRequest(normalizedQuery);

      setSuggestedCity(
        Array.isArray(responseData) ? responseData : []
      );

      const filteredCities = Object.entries(parkDeatils).filter(
        ([cityName]) => cityName.startsWith(normalizedQuery)
      );

      setVisibleParkDetails(Object.fromEntries(filteredCities));
    } catch (error) {
      console.error("Autocomplete request failed:", error);
      setSuggestedCity([]);
    }
  }

  useEffect(() => {
    searchByState();
  }, []);

  return (
    <div dir="rtl">
      <div className="flex min-h-dvh flex-col bg-canvas">

        <header className="sticky top-0 z-20 border-b border-border bg-surface/85 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <span className="flex items-center gap-2 text-sm font-semibold text-text-primary sm:text-base">
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
            </span>

            <Link
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-control bg-text-primary px-4 text-sm font-semibold text-white shadow-card transition-all duration-200 hover:bg-primary hover:shadow-card-hover"
              to={"/management"}
            >
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              כניסה למורשים
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
          <div className="animate-fade-in">
            <div className="mb-8 max-w-2xl sm:mb-10">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
                חניה טק : מערכת חניה חכמה
              </h1>
            </div>

            <div className="mb-10 sm:mb-12">
              <div className="relative w-full max-w-2xl">
                <input
                  type="text"
                  dir="rtl"
                  placeholder="שם עיר"
                  value={searchCityName}
                  onChange={(e) => handleOnCityInput(e.target.value)}
                  className="h-14 w-full rounded-card border border-border bg-surface pr-5 pl-16 text-base text-text-primary shadow-card transition-colors duration-200 outline-none placeholder:text-text-muted hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/15"
                />

                <button
                  type="button"
                  aria-label="חיפוש"
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-control bg-primary text-on-primary transition-colors duration-200 hover:bg-primary-700"
                  onClick={handleOnSubmit}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>

                {suggestedCity.length > 0 && (
                  <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-card border border-border bg-surface py-1 shadow-popover">
                    {suggestedCity.map((city) => (
                      <button
                        key={city.id}
                        type="button"
                        className="flex w-full cursor-pointer items-center gap-2.5 px-4 py-3 text-right text-base text-text-secondary transition-colors duration-150 hover:bg-primary-50 hover:text-primary"
                        onClick={() => {
                          setSearchCityName(city.name);
                          setSuggestedCity([]);
                        }}
                      >
                        <svg
                          className="h-4.5 w-4.5 shrink-0 text-text-muted"
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
                        {city.name}
                      </button>
                    ))}
                  </div>
                )}

              </div>
            </div>

            <section>
              <h2 className="flex items-center gap-2 border-b border-border pb-3 text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                <svg
                  className="h-5 w-5 text-primary"
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
                רשימת ערים
              </h2>
              <ShowParking parkDetails={visibleParkDetails}/>
            </section>
          </div>
        </main>

        {loading && <Loading />}
      </div>
    </div>
  );
}
