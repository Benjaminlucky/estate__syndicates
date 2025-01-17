import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Project from "./pages/project/Project";
import Howitworks from "./pages/howitworks/Howitworks";
import Reachus from "./pages/reach/Reach";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import Topheader from "./components/topHeader/Topheader";
import Company from "./pages/company/Company";

function App() {
  return (
    <Router>
      <Topheader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company" element={<Company />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/how-it-works" element={<Howitworks />} />
        <Route path="/reach-us" element={<Reachus />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
