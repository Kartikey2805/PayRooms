import React from "react";
import Navbar from "./components/Navbar";
import HomeScreen from "./screens/HomeScreen";
import { BrowserRouter, Link, Route } from "react-router-dom";
import BookingScreen from "./screens/BookingScreen";
import Registerscreen from "./screens/Registerscreen";
import Loginscreen from "./screens/Loginscreen";
import ProfileScreen from "./screens/ProfileScreen";
import AdminScreen from "./screens/AdminScreen";
import LandingScreen from "./screens/LandingScreen";
export default function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Route path="/home" exact component={HomeScreen} />
        <Route
          path="/book/:roomid/:fromdate/:todate"
          exact
          component={BookingScreen}
        />
        <Route path="/register" exact component={Registerscreen} />
        <Route path="/login" exact component={Loginscreen} />
        <Route path="/profile" exact component={ProfileScreen} />
        <Route path="/admin" exact component={AdminScreen} />
        <Route path="/" exact component={LandingScreen} />
      </BrowserRouter>
    </div>
  );
}
