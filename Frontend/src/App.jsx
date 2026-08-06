import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Room from "./pages/Room";

import { useAuth } from "./context/Authcontext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { Authenticated, Loading } = useAuth();

  if (Loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#09090F] text-white">
        Loading...
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/home",
      element: Authenticated ? <Home /> : <Navigate to="/login" />,
    },
    {
      path: "/room/:roomId",
      element: Authenticated ? <Room /> : <Navigate to="/login" />,
    },
    {
      path: "/login",
      element: !Authenticated ? <Login /> : <Navigate to="/home" />,
    },
    {
      path: "/signup",
      element: !Authenticated ? <Signup /> : <Navigate to="/home" />,
    },
  ]);

  return (
    <>
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={2000}
        toastClassName="glass-toast"
      />

      <RouterProvider router={router} />
    </>
  );
}

export default App;
