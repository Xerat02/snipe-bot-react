import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "././styles.css";
import Menu from "./Components/Nav";
import Snipes from "./Snipes";
import Stats from "./Stats";
import Servers from "./Servers";
import Footer from "./Components/Footer";
import Home from "./Home";

function App() {
  return (
    <>
      <Router>
        <div className="flex mx-auto w-11/12 lg:w-9/12 flex-col">
          <Menu />
          <Routes>
            <Route path="/snipes" element={<Snipes />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/" element={<Home />} />
            <Route path="/servers" element={<Servers />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
