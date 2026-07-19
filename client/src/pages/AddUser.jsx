import { useState } from "react";
import { Link } from "react-router-dom";

export default function AddUser() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  async function handleOnSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // API call
      console.log("Successfully saved user");
    } catch (error) {
      console.error(error);
      alert("נכשל ביצירת המשתמש, אנא נסה שוב");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-xl border border-black bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-black">
          הוספת משתמש חדש
        </h1>

        <form className="space-y-4" onSubmit={handleOnSubmit}>
          <div>
            <p
              className="mb-1 block text-right text-sm font-medium text-black"
            >
              אימייל
            </p>

            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <p
              className="mb-1 block text-right text-sm font-medium text-black"
            >
              סיסמה
            </p>

            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "טוען..." : "הרשמה"}
          </button>
        </form>

        
      </div>
    </div>
  );
}