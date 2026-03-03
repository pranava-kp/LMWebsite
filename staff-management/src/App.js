import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/Forgot";

import DashboardLayout from "./components/core/Dashboard/DashboardLayout";
import Dashboard from "./components/core/Dashboard/Index";

import OpenRoute from "./components/core/Auth/OpenRoute";
import PrivateRoute from "./components/core/Auth/PrivateRoute";
import { ACCOUNT_TYPE } from "./utils/constants";

import AddStaff from "./components/core/Dashboard/AddStaff/Index";
import MyProfile from "./components/core/Dashboard/MyProfile";
import NewLeave from "./components/core/Dashboard/NewLeave/Index";
import AllStaffs from "./components/core/Dashboard/AllStaffs/Index";
import Setting from "./components/core/Dashboard/Setting/Index";
import Staff from "./components/core/Dashboard/Staff/Index";

import Navbar from "./components/common/Navbar";
import "./App.css";

function App() {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith("/dashboard");

  // 🔥 Get token from Redux (important)
  const { token } = useSelector((state) => state.auth);

  const user = { accountType: ACCOUNT_TYPE.STAFF };

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboardRoute && <Navbar />}

      <Routes>
        {/* Root redirect — SMART redirect */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public routes */}
        <Route
          path="/login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />

        {/* Private dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* Default dashboard page */}
          <Route index element={<Dashboard />} />

          <Route path="my-profile" element={<MyProfile />} />
          <Route path="settings" element={<Setting />} />

          {user?.accountType === ACCOUNT_TYPE.STAFF && (
            <>
              <Route path="new-leave" element={<NewLeave />} />
              <Route path="staff" element={<Staff />} />
              <Route path="add-staff" element={<AddStaff />} />
              <Route path="all-staffs" element={<AllStaffs />} />
            </>
          )}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;