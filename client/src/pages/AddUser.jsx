import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpRequest } from "../api/signup";
import extractUserDeatils from "../Components/extractUserDeatils";
import { useToast } from "../Components/Toast/ToastContext";

const ROLES = [
  {
    value: "worker",
    label: "עובד",
    description: "צפייה וניהול חניות בעיר",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    ),
  },
  {
    value: "admin",
    label: "מנהל",
    description: "הרשאות מלאות, כולל הוספת משתמשים",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 3l7 3v5.5c0 4.2-2.9 8.1-7 9.5-4.1-1.4-7-5.3-7-9.5V6l7-3z"
      />
    ),
  },
];

const DEFAULT_ROLE = "worker";

export default function AddUser() {
  const [form, setForm] = useState({
    fullName:"",
    email: "",
    password: "",
    cityId:"",
    role: DEFAULT_ROLE
  });
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(()=>{
      const response = extractUserDeatils();
      if(response === null){
        navigate("/login");
      }
      if(response.role !== "admin"){
        toast.error("אין לך הרשאה לדף זה", {
          description: "רק מנהל יכול להוסיף משתמשים למערכת",
        });
        navigate("/login");
      }
      setForm((prev) => ({...prev, cityId: response.cityId}))
      setCityName(response.cityName);
  },[])

  async function handleOnSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await signUpRequest(form);
      console.log("Successfully saved user");
      toast.success(`${form.fullName} נוסף בהצלחה`, {
        description: `נוצר משתמש עם הרשאת ${
          form.role === "admin" ? "מנהל" : "עובד"
        } ב${cityName}`,
      });
      setForm((prev) => ({
        ...prev,
        fullName: "",
        email: "",
        password: "",
        role: DEFAULT_ROLE,
      }));
    } catch (error) {
      console.error(error);
      toast.error("יצירת המשתמש נכשלה", {
        description:
          error.response?.status === 409
            ? "כתובת האימייל הזו כבר רשומה במערכת"
            : "משהו השתבש בשרת, הפרטים נשמרו בטופס וניתן לנסות שוב",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-10 sm:px-6"
    >
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-card bg-primary-50 text-primary">
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </span>
        </div>

        <div className="rounded-card border border-border bg-surface p-6 shadow-card sm:p-8">
          <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-text-primary">
            הוספת משתמש חדש ל{cityName}
          </h1>

          <form className="space-y-5" onSubmit={handleOnSubmit}>

            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-right text-sm font-medium text-text-secondary"
              >
                שם מלא
              </label>

              <input
                id="fullName"
                type="text"
                required
                dir="rtl"
                autoComplete="name"
                value={form.fullName}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                className="h-12 w-full rounded-control border border-border bg-surface px-3.5 text-base text-text-primary transition-colors duration-200 outline-none hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-right text-sm font-medium text-text-secondary"
              >
                אימייל
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="h-12 w-full rounded-control border border-border bg-surface px-3.5 text-base text-text-primary transition-colors duration-200 outline-none hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-right text-sm font-medium text-text-secondary"
              >
                סיסמה
              </label>

              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="h-12 w-full rounded-control border border-border bg-surface px-3.5 text-base text-text-primary transition-colors duration-200 outline-none hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </div>

            <fieldset>
              <legend className="mb-1.5 block text-right text-sm font-medium text-text-secondary">
                הרשאה
              </legend>

              <div className="flex gap-1 rounded-control border border-border bg-surface-muted p-1">
                {ROLES.map((role) => (
                  <label
                    key={role.value}
                    className="relative flex-1 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={form.role === role.value}
                      onChange={() =>
                        setForm((prev) => ({
                          ...prev,
                          role: role.value,
                        }))
                      }
                      className="peer sr-only"
                    />

                    <span className="flex h-11 w-full items-center justify-center gap-2 rounded-control px-3 text-sm font-medium text-text-secondary transition-all duration-200 peer-hover:text-text-primary peer-checked:bg-surface peer-checked:font-semibold peer-checked:text-primary peer-checked:shadow-card peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary">
                      <svg
                        className="h-5 w-5 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        {role.icon}
                      </svg>
                      {role.label}
                    </span>
                  </label>
                ))}
              </div>

              <p className="mt-1.5 text-right text-sm text-text-muted">
                {ROLES.find((role) => role.value === form.role)?.description}
              </p>
            </fieldset>

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
                  טוען...
                </>
              ) : (
                "הרשמה"
              )}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
}
