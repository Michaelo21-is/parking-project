import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./pages/Home.jsx";
import Parking from "./pages/Parking.jsx";
import ManagementPage from "./pages/Management.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import AddUser from "./pages/AddUser.jsx";
import Login from "./pages/Login.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { 
    path: "/", 
    element: <App /> 
  },
  { 
    path: "/parking/:lotid", 
    element: <Parking /> 
  },
  { 
    path: "/management", 
    element: (
      <ProtectedRoute>
        <ManagementPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/add-user",
    element:(
      <ProtectedRoute>
        <AddUser />
      </ProtectedRoute>
    )
  },
  {
    path:"/login",
    element:(
      <Login />
    )
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);