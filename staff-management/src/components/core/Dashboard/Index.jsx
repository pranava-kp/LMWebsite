import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-14">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          Overview
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Overview of your leave applications and balance
        </p>
      </div>

      {/* Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >

        {/* Total Leave */}
        <div
          onClick={() => navigate("new-leave")}
          className="bg-gradient-to-br from-blue-500 to-blue-600 
                     text-white p-8 rounded-3xl shadow-xl 
                     cursor-pointer hover:-translate-y-2 
                     hover:scale-[1.02]
                     hover:shadow-blue-200/50
                     transition-all duration-300"
        >
          <div className="flex justify-between items-center">
            <FiCalendar size={28} />
            <span className="text-sm opacity-80">
              Annual allocation
            </span>
          </div>

          <h2 className="text-5xl font-bold mt-6">30</h2>
          <p className="mt-2 text-lg opacity-90">Total Leave</p>
        </div>

        {/* Used Leave */}
        <div
          className="bg-gradient-to-br from-orange-500 to-orange-600 
                     text-white p-8 rounded-3xl shadow-xl
                     hover:shadow-orange-200/50
                     transition-all duration-300"
        >
          <div className="flex justify-between items-center">
            <FiTrendingUp size={28} />
            <span className="text-sm opacity-80">
              26.7% utilized
            </span>
          </div>

          <h2 className="text-5xl font-bold mt-6">8</h2>
          <p className="mt-2 text-lg opacity-90">Used Leave</p>
        </div>

        {/* Remaining Leave */}
        <div
          onClick={() => navigate("new-leave")}
          className="bg-gradient-to-br from-green-500 to-green-600 
                     text-white p-8 rounded-3xl shadow-xl 
                     cursor-pointer hover:-translate-y-2 
                     hover:scale-[1.02]
                     hover:shadow-green-200/50
                     transition-all duration-300"
        >
          <div className="flex justify-between items-center">
            <FiCheckCircle size={28} />
            <span className="text-sm opacity-80">
              Available to use
            </span>
          </div>

          <h2 className="text-5xl font-bold mt-6">22</h2>
          <p className="mt-2 text-lg opacity-90">Remaining Leave</p>
        </div>

      </motion.div>

      {/* Leave Usage Section */}
      <div className="bg-white p-8 rounded-3xl shadow-lg space-y-6">

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Leave Usage
          </h2>
          <p className="text-gray-500 mt-1">
            Your leave consumption for the year
          </p>
        </div>

        <div className="flex justify-between text-base font-medium">
          <span className="text-orange-600">8 days used</span>
          <span className="text-green-600">22 days remaining</span>
        </div>

        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: "27%" }}
          ></div>
        </div>
      </div>

      {/* Leave Applications */}
      <div className="bg-white p-8 rounded-3xl shadow-lg space-y-8">

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Leave Applications
            </h2>
            <p className="text-gray-500 mt-1">
              All your leave applications and their status
            </p>
          </div>

          <button
            onClick={() => navigate("new-leave")}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl 
                       font-semibold shadow-lg hover:bg-blue-700 
                       hover:shadow-xl transition-all duration-300"
          >
            Apply Leave
          </button>
        </div>

        {/* Application Card */}
        <div
          onClick={() => navigate("new-leave")}
          className="bg-gray-50 border border-gray-100 rounded-3xl p-8 
                     hover:shadow-xl transition-all duration-300 
                     cursor-pointer space-y-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                Sick Leave
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Medical treatment required
              </p>
            </div>

            <span className="bg-green-100 text-green-600 
                             px-5 py-2 rounded-full 
                             text-sm font-semibold shadow-sm">
              Approved
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="text-gray-500">Start Date</p>
              <p className="font-medium text-gray-800">10/03/2026</p>
            </div>
            <div>
              <p className="text-gray-500">End Date</p>
              <p className="font-medium text-gray-800">12/03/2026</p>
            </div>
            <div>
              <p className="text-gray-500">Duration</p>
              <p className="font-medium text-gray-800">3 days</p>
            </div>
            <div>
              <p className="text-gray-500">Applied On</p>
              <p className="font-medium text-gray-800">05/03/2026</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;