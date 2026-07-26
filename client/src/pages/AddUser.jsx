import { useState } from "react";
import { Link } from "react-router-dom";
import { signUpRequest } from "../api/signup";

export default function AddUser() {
  const [form, setForm] = useState({
    fullName:"",
    email: "",
    password: "",
    city:""
  });

  const [loading, setLoading] = useState(false);

  async function handleOnSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await signUpRequest(form);
      console.log("Successfully saved user");
      alert("משתמש נוצר בהצלחה");
    } catch (error) {
      console.error(error);
      alert("נכשל ביצירת המשתמש, אנא נסה שוב");
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
            הוספת משתמש חדש
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

            <div>
              <label
                htmlFor="city"
                className="mb-1.5 block text-right text-sm font-medium text-text-secondary"
              >
                עיר
              </label>

              <input
                id="city"
                type="text"
                required
                dir="rtl"
                autoComplete="address-level2"
                value={form.city}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }))
                }
                className="h-12 w-full rounded-control border border-border bg-surface px-3.5 text-base text-text-primary transition-colors duration-200 outline-none hover:border-border-strong focus:border-primary focus:ring-4 focus:ring-primary/15"
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
