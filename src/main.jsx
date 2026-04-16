import { Children } from "react";
import App from "./App";
import Home from "./Pages/Home";
import OrderListData from "./Pages/OrderListData";
import { createBrowserRouter } from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    Children: [
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "/azizPage",
        element: <OrderListData/>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
