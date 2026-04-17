import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Home from "./Pages/Home";
import "./index.css"; // ← SHU QATORNI QO'SHING
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
