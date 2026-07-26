import { useState } from "react";
import { Link } from "react-router"

export default function ManagementPage() {
  const [parkingForm, setParkingForm] = useState({
    name: "",
    city: "",
    floor: 0,
    numberOfSpaces: 0,
  });
  const [loading, setLoading] = useState(false);

  async function handleOnSubmit(e){
    e.preventDefault()
    setLoading(true);
    // api call
    setLoading(false);
  }

  return (
    <div dir="rtl" className="flex min-h-dvh flex-col bg-canvas">

      <header className="sticky top-0 z-20 border-b border-border bg-surface/85 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <span className="flex items-center gap-2 text-sm font-semibold text-text-primary sm:text-base">
            <span className="flex h-9 w-9 items-center justify-center rounded-control bg-primary-50 text-primary">
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
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-control border border-border bg-surface px-4 text-sm font-semibold text-text-primary shadow-card transition-all duration-200 hover:border-primary hover:text-primary hover:shadow-card-hover"
            to = "/add-user"
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
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            הוספת משתמש
          </Link>
        </div>
      </header>

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

            <div>
              <label
                htmlFor="city"
                className="mb-1.5 block text-right text-sm font-medium text-text-secondary"
              >
                שם עיר
              </label>

              <input
                id="city"
                dir="rtl"
                type="text"
                required
                value={parkingForm.city}
                onChange={(e) =>
                  setParkingForm((prev) => ({
                    ...prev,
                    city: e.target.value,
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
                  מספר קומות
                </label>

                <input
                  id="floor"
                  dir="ltr"
                  type="number"
                  required
                  value={parkingForm.floor}
                  onChange={(e) =>
                    setParkingForm((prev) => ({
                      ...prev,
                      floor: e.target.value,
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
                  value={parkingForm.numberOfSpaces}
                  onChange={(e) =>
                    setParkingForm((prev) => ({
                      ...prev,
                      numberOfSpaces: e.target.value,
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
