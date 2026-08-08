import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../api/Login";
import { useToast } from "../Components/Toast/ToastContext";
export default function Login(){
    const [form, setForm] = useState({
        email:"",
        password:""
    });
    const [loading , setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
    async function handleOnSubmit(e){
        e.preventDefault();
        setLoading(true);
        try{
            await loginRequest(form);
            navigate("/management");
        }
        catch(e){
            if(e.response?.status === 400){
                toast.error("חסרים פרטים", {
                    description: "יש למלא גם אימייל וגם סיסמה",
                });
            }
            else if(e.response?.status === 401){
                toast.error("האימייל או הסיסמה שגויים", {
                    description: "בדוק את הפרטים ונסה להתחבר שוב",
                });
            }
            else{
                toast.error("השרת לא זמין כרגע", {
                    description: "לא הצלחנו להשלים את ההתחברות, אפשר לנסות שוב",
                    action: { label: "נסה שוב", onClick: () => handleOnSubmit(e) },
                });
                console.log("error print for login request: ", e);
            }
        }
        finally{
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
          <span className="flex h-12 w-12 items-center justify-center rounded-card bg-primary text-on-primary shadow-card">
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
                strokeWidth={2}
                d="M12 11h2.5a2.5 2.5 0 000-5H12v11M4 5.5A2.5 2.5 0 016.5 3h11A2.5 2.5 0 0120 5.5v13a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 18.5v-13z"
              />
            </svg>
          </span>
        </div>

        <div className="rounded-card border border-border bg-surface p-6 shadow-card sm:p-8">
          <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-text-primary">
            התחברות לאתר
          </h1>

          <form className="space-y-5" onSubmit={handleOnSubmit}>
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
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="h-12 w-full rounded-control border border-border bg-surface px-3.5 text-base text-text-primary transition-colors duration-200 outline-none placeholder:text-text-muted hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-right text-sm font-medium text-text-secondary"
              >
                סיסמא
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="h-12 w-full rounded-control border border-border bg-surface px-3.5 text-base text-text-primary transition-colors duration-200 outline-none placeholder:text-text-muted hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/15"
              />
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
                "כניסה"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
