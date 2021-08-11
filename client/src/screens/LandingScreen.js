import React from "react";
import { Link } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
Aos.init({
  duration: 2000,
});

function LandingScreen() {
  return (
    <div className="row landing justify-content-center">
      <div
        className="col-md-9 text-center my-auto"
        style={{ borderRight: "5px solid white" }}
      >
        <h2 data-aos="zoom-in" style={{ color: "white", fontSize: "400%" }}>
          PayRooms
        </h2>
        <h1 data-aos="zoom-out" style={{ color: "white" }}>
          There is only one boss. The Guest.
        </h1>
        <Link to="/home">
          <button className="btn btn-primary landing-btn">Get Started</button>
        </Link>
      </div>
    </div>
  );
}

export default LandingScreen;
