import { useEffect, useState } from "react";
import extractUserDeatils from "../Components/extractUserDeatils";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../Components/Toast/ToastContext";
import { getParkingByCity } from "../api/LoadParkingByCityApi";
import Popup from "../Components/Popup/Popup";
import editPark from "../api/editPark";

const parkingIcon = (
    <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 11h2.5a2.5 2.5 0 000-5H12v11M4 5.5A2.5 2.5 0 016.5 3h11A2.5 2.5 0 0120 5.5v13a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 18.5v-13z"
    />
);

const fieldClassName =
    "h-12 w-full rounded-control border border-border bg-surface px-3.5 text-base text-text-primary transition-colors duration-200 outline-none hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/15";

const labelClassName =
    "mb-1.5 block text-right text-sm font-medium text-text-secondary";

export default function EditParkingPage(){
    const [cityName, setCityName] = useState("");
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loadedParkDeatils, setLoadedParkingDeatils] = useState({
        spotcount: "",
        name: "",
        address:"",
        lotid: "",
    });
    const[changes, setChanges] = useState({
        name:"",
        spotCount:"",
        address:""
    });
    const [selectedPark, setSelectedPark] = useState(null);
    const [saving, setSaving] = useState(false);

    
    async function loadCityDeatils(cityName){
        try{
            const responseData = await getParkingByCity(cityName);
            console.log(responseData);
            const parkingDetails = responseData.map((parking) => ({
            spotCount: parking.spotCount,
            name: parking.name,
            lotId: parking._id,
            address: parking.address
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
        if(response.role !== "worker" && response.role !== "admin"){
            navigate("/login");
        }
        setCityName(response.cityName);
        loadCityDeatils(response.cityName);
    },[])


    async function handleOnSubmit(lotId){
        setSaving(true);
        try{
            await editPark(changes, lotId)
            toast.success(`החניון "${changes.name}" עודכן בהצלחה`, {
                description: "השינויים נשמרו במערכת",
            });
            setSelectedPark(null);
            setLoadedParkingDeatils((prev) =>
            prev.map((parking) =>
                parking.lotId === lotId
                    ? {
                        ...parking,
                        name: changes.name,
                        address: changes.address,
                        spotCount: changes.spotCount,
                    }
                    : parking
            )
        );

        }
        catch(e){
            console.log("edit parking request failed: ", e);
            toast.error("עדכון החניון נכשל", {
                description:
                    e.response?.data?.error ??
                    "משהו השתבש בשרת, הפרטים נשמרו בטופס וניתן לנסות שוב",
            });
        }
        setSaving(false);
    }

    function openParkEditor(parkingLot){
        setChanges({
            name: parkingLot.name ?? "",
            spotCount: parkingLot.spotCount ?? "",
            address: parkingLot.address ?? "",
        });
        setSelectedPark(parkingLot);
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
                                עריכת חניונים בעיר {cityName}
                            </h1>
                            <p className="mt-1.5 text-sm text-text-muted sm:text-base">
                                בחר חניון כדי לערוך את הפרטים שלו
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
                                לא נמצאו חניונים בעיר {cityName}
                            </p>
                            <p className="max-w-sm text-sm text-text-muted">
                                אפשר להוסיף חניון חדש למערכת דרך פאנל הניהול
                            </p>
                            <Link
                                to="/add-park"
                                className="mt-2 inline-flex h-11 cursor-pointer items-center justify-center rounded-control bg-primary px-5 text-sm font-semibold text-on-primary shadow-card transition-all duration-200 hover:bg-primary-700 hover:shadow-card-hover"
                            >
                                הוספת חניון
                            </Link>
                        </div>
                    )}

                    {!isLoading && parkingLots.length > 0 && (
                        <ul className="grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {parkingLots.map((parkingLot) => (
                                <li
                                    key={parkingLot.lotId}
                                    className="group flex flex-col gap-4 rounded-card border border-border bg-surface p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card-hover"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control bg-primary-50 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-on-primary">
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

                                        <h2 className="min-w-0 flex-1 text-base font-semibold leading-snug text-text-primary transition-colors duration-200 group-hover:text-primary">
                                            {parkingLot.name}
                                        </h2>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => openParkEditor(parkingLot)}
                                        className="mt-auto inline-flex h-11 w-full cursor-pointer items-center justify-center gap-1.5 rounded-control bg-surface-muted px-4 text-sm font-semibold text-text-secondary transition-colors duration-200 group-hover:bg-primary group-hover:text-on-primary"
                                    >
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
                                                strokeWidth={2}
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                        עריכת חניון
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>

            <Popup
                open={selectedPark !== null}
                onClose={() => setSelectedPark(null)}
                title={selectedPark?.name}
                subtitle={`עריכת פרטי החניון · ${cityName}`}
                icon={parkingIcon}
                closeLabel="סגירה ללא שמירה"
                footer={
                    <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => setSelectedPark(null)}
                            className="inline-flex h-12 cursor-pointer items-center justify-center rounded-control border border-border bg-surface px-5 text-base font-semibold text-text-secondary transition-colors duration-200 hover:border-border-strong hover:text-text-primary sm:min-w-28"
                        >
                            ביטול
                        </button>

                        <button
                            type="submit"
                            form="edit-park-form"
                            disabled={saving}
                            className="inline-flex h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-control bg-primary px-5 text-base font-semibold text-on-primary shadow-card transition-all duration-200 hover:bg-primary-700 hover:shadow-card-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-card sm:flex-none sm:min-w-40"
                        >
                            {saving ? (
                                <>
                                    <span
                                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                                        aria-hidden="true"
                                    />
                                    שומר ...
                                </>
                            ) : (
                                "עדכון חניון"
                            )}
                        </button>
                    </div>
                }
            >
                {/* The action button lives in the modal footer, outside this form —
                    form="edit-park-form" is what wires the two together. */}
                <form
                    id="edit-park-form"
                    className="space-y-5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleOnSubmit(selectedPark.lotId);
                    }}
                >
                    <div>
                        <label htmlFor="edit-park-name" className={labelClassName}>
                            שם חניון
                        </label>
                        <input
                            id="edit-park-name"
                            dir="rtl"
                            type="text"
                            required
                            value={changes.name}
                            onChange={(e) =>
                                setChanges((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className={fieldClassName}
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-park-address" className={labelClassName}>
                            שם רחוב ומספר רחוב
                        </label>
                        <input
                            id="edit-park-address"
                            dir="rtl"
                            type="text"
                            required
                            value={changes.address}
                            onChange={(e) =>
                                setChanges((prev) => ({ ...prev, address: e.target.value }))
                            }
                            className={fieldClassName}
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-park-spots" className={labelClassName}>
                            מספר מקומות חניה בחניון
                        </label>
                        <input
                            id="edit-park-spots"
                            dir="ltr"
                            type="number"
                            min="0"
                            required
                            value={changes.spotCount}
                            onChange={(e) =>
                                setChanges((prev) => ({ ...prev, spotCount: e.target.value }))
                            }
                            className={`${fieldClassName} mb-2 tabular-nums appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                        />
                    </div>

                    
                    
                </form>
            </Popup>
        </div>
    );
}
