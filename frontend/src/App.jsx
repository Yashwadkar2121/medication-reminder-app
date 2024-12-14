import "./App.css";
import Navbar from "./components/Navbar";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddMedicine from "./components/AddMedicine";
import AdminDashBoard from "./components/AdminDashBoard";
function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/add" element={<AddMedicine />} />
          <Route path="/dash" element={<AdminDashBoard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
