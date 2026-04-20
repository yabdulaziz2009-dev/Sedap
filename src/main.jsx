import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import "./index.css";
import App from "./App";
import GeneralCustomer from "./Pages/GeneralCustomer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children: [
      {
        index: true,
        element: <Navigate to="/customers" replace />
      },
      {
         path: "customers",
         element: <GeneralCustomer />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
