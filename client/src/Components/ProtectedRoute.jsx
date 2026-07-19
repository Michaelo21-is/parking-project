import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Loading from "./Loading";
import { checkPermissionRequest } from "../api/checkpermission";

export default function ProtectedRoute({ children }) {
  const [permission, setPermission] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkPermission() {
      try {
        await checkPermissionRequest()
        setPermission(true);
      } catch (error) {
        console.error(error);
        setPermission(false);
      } finally {
        setLoading(false);
      }
    }

    checkPermission();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (permission === false) {
    return <Navigate to="/login" replace />;
  }

  return children;
}