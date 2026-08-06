import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./pages/Home.jsx";
import Parking from "./pages/Parking.jsx";
import ManagementPage from "./pages/Management.jsx";
import AddUser from "./pages/AddUser.jsx";
import Login from "./pages/Login.jsx";
import AddParkPage from "./pages/AddPark.jsx";
import EditParkingPage from "./pages/editParking.jsx";
import RemoveParkPage from "./pages/RemovePark.jsx";

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
        <ManagementPage />
    )
  },
  {
    path: "/add-park",
    element: (
        <AddParkPage />
    )
  },
  {
    path: "/edit-parking",
    element: (
        <EditParkingPage/>
    )
  },
  {
    path: "remove-parking",
    element: (
      <RemoveParkPage/>
    )
  },
  {
    path: "/add-user",
    element:(
        <AddUser />
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