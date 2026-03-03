import React from "react";

const Dashboard = () => {
  return (
    <div style={{ padding: "60px" }}>
      <h1 style={{ fontSize: "80px", color: "red", fontWeight: "bold" }}>
        TEST DASHBOARD
      </h1>

      <p style={{ fontSize: "28px", marginTop: "20px" }}>
        If you can see this red text,
        this file is correctly connected to /dashboard.
      </p>

      <div
        style={{
          marginTop: "40px",
          padding: "30px",
          backgroundColor: "#f3f4f6",
          borderRadius: "12px",
          fontSize: "22px"
        }}
      >
        Dashboard routing test successful.
      </div>
    </div>
  );
};

export default Dashboard;