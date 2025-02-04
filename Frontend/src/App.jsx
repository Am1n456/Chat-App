import { useEffect } from "react";
import { Loader } from "lucide-react";
import Navbar from "./Components/Navbar.jsx";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import SettingsPage from "./Pages/SettingsPage.jsx";
import SignupPage from "./Pages/SignupPage.jsx";
import { useAuthStore } from "./store/useAuthStore.js";
import {useThemeStore} from "./store/useThemeStore.js"
import { Navigate } from "react-router-dom";
import {Toaster} from "react-hot-toast"

function App() {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore();
  const {theme} = useThemeStore()

  console.log(onlineUsers)
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  //console.log({authUser})

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
