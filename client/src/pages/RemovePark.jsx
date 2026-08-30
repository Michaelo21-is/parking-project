import { useToast } from "../Components/Toast/ToastContext";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import extractUserDeatils from "../Components/extractUserDeatils";
import { getParkingByCity } from "../api/LoadParkingByCityApi";
import deleteParking from "../api/deleteParking";
import Popup from "../Components/Popup/Popup";

const parkingIcon = (
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 11h2.5a2.5 2.5 0 000-5H12v11M4 5.5A2.5 2.5 0 016.5 3h11A2.5 2.5 0 0120 5.5v13a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 18.5v-13z"
    />
);

const trashIcon = (
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
);

export default function RemoveParkPage(){
    const [cityName, setCityName] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loadedParkDeatils, setLoadedParkingDeatils] = useState({
        name: "",
        lotid: "",
    });
    const [parkToDelete, setParkToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    async function loadCityDeatils(cityName){
            try{
                const responseData = await getParkingByCity(cityName);
                console.log(responseData);
                const parkingDetails = responseData.map((parking) => ({
                name: parking.name,
                lotId: parking._id,
                }));
                setLoadedParkingDeatils(parkingDetails);
            }
            catch(e){
                console.log("failed to load city: ", e);
                toast.error("לא הצלחנו לטעון את החניונים", {
                description: "נסה שוב בעוד כמה רגעים",
                });
            }
        }
    useEffect(() =>{
            const response = extractUserDeatils();
            console.log(response);
            if(response.role !== "admin"){
                navigate("/login");
            }
            setCityName(response.cityName);
            loadCityDeatils(response.cityName);
        },[])
    async function handleOnDeletePark(lotId){
        try{
            await deleteParking(lotId);
            // show success toast
             setLoadedParkingDeatils((prev) =>
            prev.filter((parking) => parking.lotId !== lotId)
            );
        toast.success("החניון נמחק בהצלחה");
        } catch (error) {
            console.log("failed to delete parking:", error);

            toast.error("לא הצלחנו למחוק את החניון", {
            description: "נסה שוב בעוד כמה רגעים",
            });
        }
    }

    // The dialog only guards the destructive action — the deletion itself
    // stays in handleOnDeletePark, which owns its own toasts.
    async function confirmDelete(){
        if (!parkToDelete) return;
        setDeleting(true);
        await handleOnDeletePark(parkToDelete.lotId);
        setDeleting(false);
        setParkToDelete(null);
    }

    const isLoading = !Array.isArray(loadedParkDeatils);
    const parkingLots = isLoading ? [] : loadedParkDeatils;

    return (
        <div dir="rtl" className="flex min-h-dvh flex-col bg-canvas">

            <header className="sticky top-0 z-20 border-b border-border bg-surface/85 backdrop-blur-sm">
                <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-sm font-semibold text-text-primary sm:text-base"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-control bg-primary-50 text-primary">
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                {parkingIcon}
                            </svg>
                        </span>
                        חניה טק
                    </Link>

                    <Link
                        to="/management"
                        className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-control border border-border bg-surface px-4 text-sm font-semibold text-text-primary shadow-card transition-all duration-200 hover:border-primary hover:text-primary hover:shadow-card-hover"
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
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                        חזרה לפאנל
                    </Link>
                </div>
            </header>

            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
                <div className="animate-fade-in">
                    <div className="mb-8 flex flex-wrap items-end justify-between gap-3 sm:mb-10">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl">
                                הסרת חניונים בעיר {cityName}
                            </h1>
                            <p className="mt-1.5 text-sm text-text-muted sm:text-base">
                                מחיקת חניון היא פעולה בלתי הפיכה
                            </p>
                        </div>

                        {!isLoading && parkingLots.length > 0 && (
                            <span className="rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-semibold text-text-muted sm:text-sm">
                                <span className="tabular-nums">{parkingLots.length}</span> חניונים
                            </span>
                        )}
                    </div>

                    {isLoading && (
                        <div
                            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                            aria-hidden="true"
                        >
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    className="flex flex-col gap-4 rounded-card border border-border bg-surface p-5 shadow-card"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="h-11 w-11 shrink-0 animate-pulse rounded-control bg-surface-muted" />
                                        <span className="h-4 w-32 animate-pulse rounded-full bg-surface-muted" />
                                    </div>
                                    <span className="h-11 w-full animate-pulse rounded-control bg-surface-muted" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!isLoading && parkingLots.length === 0 && (
                        <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border-strong bg-surface px-6 py-14 text-center">
                            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-muted text-text-muted">
                                <svg
                                    className="h-7 w-7"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    {parkingIcon}
                                </svg>
                            </span>
                            <p className="text-base font-semibold text-text-primary">
                                אין חניונים למחיקה בעיר {cityName}
                            </p>
                            <p className="max-w-sm text-sm text-text-muted">
                                כשיתווספו חניונים למערכת הם יופיעו כאן
                            </p>
                            <Link
                                to="/management"
                                className="mt-2 inline-flex h-11 cursor-pointer items-center justify-center rounded-control bg-primary px-5 text-sm font-semibold text-on-primary shadow-card transition-all duration-200 hover:bg-primary-700 hover:shadow-card-hover"
                            >
                                חזרה לפאנל הניהול
                            </Link>
                        </div>
                    )}

                    {!isLoading && parkingLots.length > 0 && (
                        <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {parkingLots.map((parkingLot) => (
                                <li
                                    key={parkingLot.lotId}
                                    className="group flex flex-col gap-4 rounded-card border border-border bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-danger/40 hover:shadow-card-hover"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-primary-50 text-primary transition-colors duration-200 group-hover:bg-danger-50 group-hover:text-danger">
                                            <svg
                                                className="h-5.5 w-5.5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                aria-hidden="true"
                                            >
                                                {parkingIcon}
                                            </svg>
                                        </span>

                                        <h2 className="min-w-0 flex-1 text-base font-semibold leading-snug text-text-primary">
                                            {parkingLot.name}
                                        </h2>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setParkToDelete(parkingLot)}
                                        aria-label={`מחיקת החניון ${parkingLot.name}`}
                                        className="mt-auto inline-flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-control bg-danger-50 px-4 text-sm font-semibold text-danger-700 transition-colors duration-200 hover:bg-danger hover:text-white active:scale-[0.99]"
                                    >
                                        <svg
                                            className="h-4 w-4 shrink-0"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            {trashIcon}
                                        </svg>
                                        מחיקת חניון
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>

            <Popup
                open={parkToDelete !== null}
                onClose={() => !deleting && setParkToDelete(null)}
                title="מחיקת חניון"
                subtitle={parkToDelete?.name}
                closeLabel="ביטול המחיקה"
                footer={
                    <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => setParkToDelete(null)}
                            disabled={deleting}
                            className="inline-flex h-12 cursor-pointer items-center justify-center rounded-control border border-border bg-surface px-5 text-base font-semibold text-text-secondary transition-colors duration-200 hover:border-border-strong hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-28"
                        >
                            ביטול
                        </button>

                        <button
                            type="button"
                            onClick={confirmDelete}
                            disabled={deleting}
                            className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-control bg-danger px-5 text-base font-semibold text-white shadow-card transition-all duration-200 hover:bg-danger-700 hover:shadow-card-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-card sm:flex-none sm:min-w-40"
                        >
                            {deleting ? (
                                <>
                                    <span
                                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                                        aria-hidden="true"
                                    />
                                    מוחק ...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="h-4.5 w-4.5 shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        {trashIcon}
                                    </svg>
                                    מחיקת החניון
                                </>
                            )}
                        </button>
                    </div>
                }
            >
                <div className="flex gap-3 rounded-control border border-danger/25 bg-danger-50 p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-danger text-white">
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
                                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                            />
                        </svg>
                    </span>

                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-danger-700">
                            פעולה בלתי הפיכה
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                            החניון{" "}
                            <span className="font-semibold text-text-primary">
                                {parkToDelete?.name}
                            </span>{" "}
                            יימחק מהמערכת לצמיתות, ולא ניתן יהיה לשחזר אותו.
                        </p>
                    </div>
                </div>
            </Popup>
        </div>
    );
}
