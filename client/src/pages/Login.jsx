import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../api/Login";
export default function Login(){
    const [form, setForm] = useState({
        email:"",
        password:""
    });
    const [loading , setLoading] = useState(false);
    const navigate = useNavigate();
    async function handleOnSubmit(e){
        e.preventDefault();
        setLoading(true);
        try{
            await loginRequest(form);
            navigate("/management");
        }
        catch(e){
            if(e.response?.status === 400){
                alert("missing filed");
            }
            else if(e.response?.status === 401){
                alert("email or password invalid")
            }
            else{
                alert("something went bad in the server please try again later.")
                console.log("error print for login request: ", e);
            }
        }
        finally{
            setLoading(false);
        }
    }
    return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-md rounded-xl border border-black bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-center text-2xl font-bold text-black">התחברות לאתר</h1>

        <form className="space-y-4" onSubmit={handleOnSubmit}>
          <div>
            <p  className="mb-1 block text-sm font-medium text-black text-right">
              אימייל
            </p>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <p className="mb-1 block text-sm font-medium text-black text-right">
              סיסמא
            </p>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              className="w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-3 font-semibold text-white disabled:opacity-60 mt-2"
          >
            {loading ? "טוען ....." : "כניסה"}
          </button>
        </form>

      </div>
    </div>
  );
}