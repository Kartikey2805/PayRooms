import React, { useState, useEffect } from "react";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import Swal from "sweetalert2";

function BookingScreen({ match }) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalamount, settotalamount] = useState(0);
  const roomid = match.params.roomid;
  const fromdate = moment(match.params.fromdate, "DD-MM-YYYY");
  const todate = moment(match.params.todate, "DD-MM-YYYY");

  const totaldays = moment.duration(todate.diff(fromdate)).asDays() + 1;

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      window.location.href = "/login";
    }
    async function getAll() {
      try {
        setLoading(true);
        const data = await axios.post("/api/rooms/getroombyid", {
          roomid: match.params.roomid,
        });
        const roomData = data.data;
        setRoom(roomData);
        const amount = totaldays * roomData.rentperday;
        settotalamount(amount);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError(true);
        setLoading(false);
      }
      setLoading(false);
    }
    getAll();
  }, []);

  async function onToken(token) {
    console.log(token);
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate,
      todate,
      totalamount,
      totaldays,
      token,
    };
    try {
      setLoading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      setLoading(false);
      Swal.fire(
        "Congratulations",
        "Your room booked successfully",
        "success"
      ).then((result) => (window.location.href = "/home"));
    } catch (err) {
      setLoading(false);
      Swal.fire("Oops!", "something went wrong, please try again", "success");
    }
  }

  return (
    <div className="container m-5 ">
      <div className="row justify-content-center mt-5">
        {loading === true ? (
          <h1>
            <Loader />
          </h1>
        ) : room !== null ? (
          <div>
            <div className="row bs">
              <div className="col-md-7">
                <h1>{room.name}</h1>
                <img src={room.imageurls[0]} className="bigimg" />
              </div>
              <div className="col-md-5">
                <div style={{ textAlign: "right" }}>
                  <h1>Booking Details</h1>
                  <hr />
                  <b>
                    <p>
                      Name :{" "}
                      {JSON.parse(localStorage.getItem("currentUser")).name}
                    </p>
                    <p>From Date : {match.params.fromdate} </p>
                    <p>To Date : {match.params.todate}</p>
                    <p>Max Count : {room.maxcount}</p>
                  </b>
                </div>

                <div style={{ textAlign: "right" }}>
                  <b>
                    <h1>Amount</h1>
                    <hr />
                    <p>Total days : {totaldays}</p>
                    <p>Rent per day : {room.rentperday}</p>
                    <p>Total Amount : {totalamount}</p>
                  </b>
                </div>

                <div style={{ float: "right" }}>
                  <StripeCheckout
                    amount={totalamount * 100}
                    token={onToken}
                    currency="INR"
                    stripeKey="pk_test_51JKMAaSJhbsXoJeQSrIeGpQVkYeR6nXzB3eeTiPQuAz4tDrti6tAMA7UURcxnI2rJA1z1n5nTFAk8sqBkLfoiVb100MRawD4xx"
                  >
                    <button className="btn btn-primary">Pay Now</button>
                  </StripeCheckout>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <h1>
            {" "}
            <Error />
          </h1>
        )}
      </div>
    </div>
  );
}

export default BookingScreen;
