import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Swal from "sweetalert2";
import { Tag, Divider } from "antd";

const { TabPane } = Tabs;

function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("currentUser"));
    if (!userData) {
      window.location.href = "/login";
    } else setUser(userData);
    setLoading(false);
  }, []);

  return (
    <div className="ml-3 mt-3">
      {console.log("return")}
      {loading === true ? (
        <Loader />
      ) : (
        <Tabs defaultActiveKey="1">
          <TabPane tab="Profile" key="1">
            <h1>My Profile</h1>
            <br />
            <h1>Name : {user.name}</h1>
            <h1>Email : {user.email}</h1>
            <h1>isAdmin : {user.isAdmin ? "True" : "False"}</h1>
          </TabPane>
          <TabPane tab="Bookings" key="2">
            <MyBookings user={user} />
          </TabPane>
        </Tabs>
      )}
    </div>
  );
}

export default ProfileScreen;

function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    try {
      const rooms = (
        await axios.post("/api/bookings/getbookingsbyuserid", {
          userid: user._id,
        })
      ).data;
      setBookings(rooms);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }, []);

  async function cancelBooking(bookingid, roomid) {
    try {
      setLoading(true);
      const result = (
        await axios.post("/api/bookings/cancelbooking", { bookingid, roomid })
      ).data;
      setLoading(false);
      Swal.fire(
        "Congratulations",
        "Your booking has been cancelled",
        "success"
      ).then((result) => window.location.reload());
    } catch (err) {
      console.log(err);
      setLoading(false);
      Swal.fire("Oops!", "something went wrong, please try again", "success");
    }
  }

  return (
    <div className="row">
      <div className="col-md-6">
        {loading === true ? (
          <div>
            <Loader />
          </div>
        ) : (
          <div>
            {bookings &&
              bookings.map((booking) => {
                return (
                  <div className="bs">
                    <h1>
                      <b>{booking.room}</b>
                    </h1>
                    <p>BookingId : {booking._id}</p>
                    <p>CheckIn : {booking.fromdate}</p>
                    <p>CheckOut : {booking.todate}</p>
                    <p>Amount : {booking.totalamount}</p>
                    <p>
                      Status :{" "}
                      {booking.status === "booked" ? (
                        <Tag color="green">CONFIRMED</Tag>
                      ) : (
                        <Tag color="orange">CANCELLED</Tag>
                      )}
                    </p>
                    <div className="text-right">
                      {booking.status !== "cancelled" && (
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            cancelBooking(booking._id, booking.roomid)
                          }
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
