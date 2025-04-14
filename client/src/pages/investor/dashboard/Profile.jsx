import React from "react";

function Profile() {
  const investor = JSON.parse(localStorage.getItem("investor"));
  const firstName = investor?.firstName || "Investor"; // fallback if data is missing

  const currentHour = new Date().getHours();

  let greeting;
  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <div className="flex flex-col  ">
      <h2>{`${greeting}, ${firstName}`}</h2>
    </div>
  );
}

export default Profile;
