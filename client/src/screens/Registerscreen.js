import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Success from "../components/Success";

function Registerscreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  async function register() {
    if (password === cpassword) {
      const user = {
        name,
        email,
        password,
        cpassword,
      };
      try {
        setLoading(true);
        const result = (await axios.post("/api/users/register", user)).data;
        setLoading(false);
        setSuccess(true);
      } catch (err) {
        setLoading(false);
        setError(true);
      }
    } else {
      alert("Password do not match");
    }
    setName("");
    setEmail("");
    setPassword("");
    setCpassword("");
  }

  return (
    <div>
      {loading && <Loader />}
      {error && <Error />}
      {success && <Success message="Registration successfull" />}
      <div className="row justify-content-center mt-5">
        <div className="col-md-5">
          <div className="bs">
            <h2>Register</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="form-control"
              placeholder="name"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="form-control"
              placeholder="email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="form-control"
              placeholder="password"
            />
            <input
              type="password"
              value={cpassword}
              onChange={(e) => {
                setCpassword(e.target.value);
              }}
              className="form-control"
              placeholder="confirm password"
            />
            <button className="btn btn-primary mt-3" onClick={register}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Registerscreen;
