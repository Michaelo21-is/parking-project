import { useEffect, useState } from "react";
import { useNavigate } from "react-router"
import extractUserDeatils from "../Components/extractUserDeatils";
import addParking from "../api/addParking";
import { useToast } from "../Components/Toast/ToastContext";
import MangementNavbar from "../Components/MangementNavbar";

export default function AddPark() {
  const [parkingForm, setParkingForm] = useState({
    name: "",
    cityName: "",
    address:"",
    spotCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() =>{
    const response = extractUserDeatils();
    if(response === null){
      navigate("/login");
      return;
    }
    if(response.role !== "admin"){
      toast.error("אין לך הרשאה לדף זה", {
        description: "רק מנהל יכול להוסיף חניון חדש למערכת",
      });
      navigate("/login")
      return;
    }
    setParkingForm((prev) => ({
      ...prev,
      cityName: response.cityName,
    }));
  },[])


  async function handleOnSubmit(e){
    e.preventDefault()
    setLoading(true);
    try{
      await addParking(parkingForm);
      toast.success(`החניון "${parkingForm.name}" נוסף בהצלחה`, {
        description: `${parkingForm.spotCount} מקומות חניה ב${parkingForm.address}, ${parkingForm.cityName}`,
      });
      setParkingForm((prev) => ({
        ...prev,
        name: "",
        address: "",
        spotCount: 0,
      }));
    }
    catch(e){
      toast.error("הוספת החניון נכשלה", {
        description:
          e.response?.data?.error ??
          "משהו השתבש בשרת, הפרטים נשמרו בטופס וניתן לנסות שוב",
      });
      console.log("add parking request failed: ", e);
    }
    setLoading(false);
  }

  return (
    <div dir="rtl" className="flex min-h-dvh flex-col bg-canvas">

      <MangementNavbar />

      <main className="flex flex-1 items-start justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div className="w-full max-w-lg animate-fade-in rounded-card border border-border bg-surface p-6 shadow-card sm:p-8">
          <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-text-primary">
            הוספת חניון
          </h1>

          <form className="space-y-5" onSubmit={handleOnSubmit}>
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-right text-sm font-medium text-text-secondary"
              >
                שם חניון
              </label>

              <input
                dir="rtl"
                id="name"
                type="text"
                required
                value={parkingForm.name}
                onChange={(e) =>
                  setParkingForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="h-12 w-full rounded-control border border-border bg-surface px-3.5 text-base text-text-primary transition-colors duration-200 outline-none hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </div>


            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="floor"
                  className="mb-1.5 block text-right text-sm font-medium text-text-secondary"
                >
                  שם רחוב ומספר רחוב
                </label>

                <input
                  id="address"
                  dir="rtl"
                  type="text"
                  required
                  value={parkingForm.address}
                  onChange={(e) =>
                    setParkingForm((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="h-12 w-full rounded-control border border-border
                   bg-surface px-3.5 text-base text-text-primary tabular-nums
                   transition-colors duration-200 outline-none
                   hover:border-border-strong focus:border-primary focus:ring-4
                   focus:ring-primary/15 appearance-none
                   [&::-webkit-inner-spin-button]:appearance-none
                   [&::-webkit-outer-spin-button]:appearance-none"
                />
              </div>

              <div>
                <label
                  htmlFor="numberOfSpaces"
                  className="mb-1.5 block text-right text-sm font-medium text-text-secondary"
                >
                  מספר מקומות חניה בחניון
                </label>

                <input
                  id="numberOfSpaces"
                  dir="ltr"
                  type="number"
                  required
                  value={parkingForm.spotCount}
                  onChange={(e) =>
                    setParkingForm((prev) => ({
                      ...prev,
                      spotCount: e.target.value,
                    }))
                  }
                  className="h-12 w-full rounded-control border border-border bg-surface px-3.5
                   text-base text-text-primary tabular-nums transition-colors duration-200
                   outline-none hover:border-border-strong focus:border-primary
                   focus:ring-4 focus:ring-primary/15
                   appearance-none
                   [&::-webkit-inner-spin-button]:appearance-none
                  [&::-webkit-outer-spin-button]:appearance-none
                  "
                />
              </div>
            </div>



            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-control bg-primary px-4 text-base font-semibold text-on-primary shadow-card transition-all duration-200 hover:bg-primary-700 hover:shadow-card-hover active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-card"
            >
              {loading ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    aria-hidden="true"
                  />
                  טוען .....
                </>
              ) : (
                "הוספת חניון"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
