import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of your leave applications and balance
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div
          onClick={() => navigate("/dashboard/new-leave")}
          className="bg-gradient-to-br from-blue-500 to-blue-600 
                     text-white p-6 rounded-2xl shadow-lg 
                     cursor-pointer hover:-translate-y-1 
                     hover:shadow-2xl transition-all duration-300"
        >
          <p className="text-sm opacity-80">Total Leave</p>
          <h2 className="text-4xl font-bold mt-2">30 days</h2>
          <p className="mt-6 text-sm opacity-80">
            Annual allocation
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 
                        text-white p-6 rounded-2xl shadow-lg">
          <p className="text-sm opacity-80">Used Leave</p>
          <h2 className="text-4xl font-bold mt-2">8 days</h2>
          <p className="mt-6 text-sm opacity-80">
            26.7% utilized
          </p>
        </div>

        <div
          onClick={() => navigate("/dashboard/new-leave")}
          className="bg-gradient-to-br from-green-500 to-green-600 
                     text-white p-6 rounded-2xl shadow-lg 
                     cursor-pointer hover:-translate-y-1 
                     hover:shadow-2xl transition-all duration-300"
        >
          <p className="text-sm opacity-80">Remaining Leave</p>
          <h2 className="text-4xl font-bold mt-2">22 days</h2>
          <p className="mt-6 text-sm opacity-80">
            Available to use
          </p>
        </div>

      </div>

      {/* Leave Usage */}
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Leave Usage
          </h2>
          <p className="text-gray-500 text-sm">
            Your leave consumption for the year
          </p>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-orange-600 font-medium">
            8 days used
          </span>
          <span className="text-green-600 font-medium">
            22 days remaining
          </span>
        </div>

        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-[27%]"></div>
        </div>
      </div>

      {/* Leave Applications */}
      <div className="bg-white p-6 rounded-2xl shadow-md space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Leave Applications
            </h2>
            <p className="text-gray-500 text-sm">
              All your leave applications and their status
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/new-leave")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg 
                       shadow hover:bg-blue-700 transition"
          >
            Apply Leave
          </button>
        </div>

        <div
          onClick={() => navigate("/dashboard/new-leave")}
          className="border rounded-xl p-5 space-y-4 
                     cursor-pointer hover:shadow-lg 
                     transition duration-200"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">
                Sick Leave
              </h3>
              <p className="text-sm text-gray-500">
                Medical treatment required
              </p>
            </div>

            <span className="bg-green-100 text-green-600 
                             px-3 py-1 rounded-full 
                             text-sm font-medium">
              Approved
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Start Date</p>
              <p className="font-medium">10/03/2026</p>
            </div>
            <div>
              <p className="text-gray-500">End Date</p>
              <p className="font-medium">12/03/2026</p>
            </div>
            <div>
              <p className="text-gray-500">Duration</p>
              <p className="font-medium">3 days</p>
            </div>
            <div>
              <p className="text-gray-500">Applied On</p>
              <p className="font-medium">05/03/2026</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;