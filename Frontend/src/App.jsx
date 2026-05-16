import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Room from "./pages/Room";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { useAuth } from "./context/Authcontext";

// These components, and cc are imported just to use the toastify part in our project.
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./components/Style.css";

function App() {
  // we have to protect our router, therefore we need the authenticated state to verify that the user is logged in or not.
  const { Authenticated } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      element: Authenticated ? <Home /> : <Navigate to="/login" />,
    },

    {
      path: "/room/:roomId",
      element: Authenticated ? <Room /> : <Navigate to="/login" />,
    },

    {
      path: "/login",
      element: !Authenticated ? <Login /> : <Navigate to="/" />,
    },
    {
      path: "/signup",
      element: !Authenticated ? <Signup /> : <Navigate to="/" />,
    },
  ]);

  return (
    <>
      {/* This toastcontainer is wrapping all of the program so it gives space for the toasts to appear on the top right of the screen for 3 seconds and with the theme dark. */}
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={2000}
        toastClassName={"glass-toast"}
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
