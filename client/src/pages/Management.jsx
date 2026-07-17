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
    e.preventdefault()
    setLoading(true);
    // api call
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <Link
        className="absolute top-6 left-6 rounded-2xl bg-black px-4 py-3 text-xl font-semibold text-white cursor-pointer"
        href = "/"
      >
        חזרה
      </Link>
      <Link
        className="absolute top-6 right-6 rounded-2xl bg-black px-4 py-3 text-xl font-semibold text-white cursor-pointer"
        href = "/add-user"
      >
        הוספת משתמש
      </Link>

      <div className="w-full max-w-md rounded-xl border border-black bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-black">
          הוספת חניון
        </h1>

        <form className="space-y-4" onSubmit={handleOnSubmit}>
          <div>
            <label
              htmlFor="prakName"
              className="mb-1 block text-right text-sm font-medium text-black"
            >
              שם חניון
            </label>

            <input
              dir="rtl"
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="whereIsKnownFrom"
              className="mb-1 block text-right text-sm font-medium text-black"
            >
              שם עיר
            </label>

            <input
              id="whereIsKnownFrom"
              dir="rtl"
              type="text"
              required
              value={form.city}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  city: e.target.value,
                }))
              }
              className="mb-2 w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="whereIsKnownFrom"
              className="mb-1 block text-right text-sm font-medium text-black"
            >
              מספר קומות
            </label>

            <input
              id="whereIsKnownFrom"
              dir="ltr"
              type="number"
              required
              value={form.floor}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  floor: e.target.value,
                }))
              }
              className="mb-2 w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label
              htmlFor="whereIsKnownFrom"
              className="mb-1 block text-right text-sm font-medium text-black"
            >
              מספר מקומות חניה בחניון
            </label>

            <input
              id="whereIsKnownFrom"
              dir="ltr"
              type="number"
              required
              value={form.numberOfSpaces}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  numberOfSpaces: e.target.value,
                }))
              }
              className="mb-2 w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "טוען ....." : "הוספת חניון"}
          </button>
        </form>
      </div>
      </div>
  );
}