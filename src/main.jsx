import { Children } from "react";
import App from "./App";
import Home from "./Pages/Home";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    Children: [
      {
        path: "/",
        element: <Home/>,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
