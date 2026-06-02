import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./Components/Home.jsx";
import Parking from "./Components/Parking.jsx";
import ManagementPage from "./Components/Management.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { 
    path: "/", 
    element: <App /> 
  },
  { 
    path: "/parking", 
    element: <Parking /> 
  },
  { 
    path: "/management", 
    element: (
      <ProtectedRoute>
        <ManagementPage />
      </ProtectedRoute>
    )
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);