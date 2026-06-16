import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";

export default function ProtectedRoute({ children }) {
  const [permission, setPermission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPermission() {
      try {
        const response = await axios.get("http://localhost:3000/check-permission", {
          withCredentials: true,
        });

        setPermission(response.data);
      } catch (error) {
        setPermission("denied");
      } finally {
        setLoading(false);
      }
    }

    checkPermission();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (permission !== "permission") {
    return <Navigate to="/login" replace />;
  }

  return children;
}