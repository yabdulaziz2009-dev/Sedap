import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Home from "./Pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Foods from "./Pages/Foods";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>404 Not Found</div>,
    children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path:"/Foods",
        element:<Foods/>
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
