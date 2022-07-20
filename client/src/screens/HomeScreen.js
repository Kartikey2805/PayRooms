import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { DatePicker, Space } from "antd";
import moment from "moment";
import "antd/dist/antd.css";
const { RangePicker } = DatePicker;

export default function HomeScreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fromdate, setfromdate] = useState("");
  const [todate, settodate] = useState("");
  const [duplicaterooms, setduplicaterooms] = useState([]);
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("currentUser")) {
      window.location.href = "/login";
    }

    async function getAll() {
      try {
        setLoading(true);
        const data = await axios.get("/api/rooms/getallrooms");
        const allrooms = data.data;
        setRooms(allrooms);
        setduplicaterooms(allrooms);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setError(true);
      }
    }
    getAll();
  }, []);

  function filterByDate(dates) {
    setfromdate(moment(dates[0]).format("DD-MM-YYYY"));
    settodate(moment(dates[1]).format("DD-MM-YYYY"));
    let temprooms = [];
    for (const room of duplicaterooms) {
      let availibility = true;
      if (room.currentbookings.length > 0) {
        for (let booking of room.currentbookings) {
          if (
            !moment(moment(dates[0]).format("DD-MM-YYYY")).isBetween(
              booking.fromdate,
              booking.todate
            ) &&
            !moment(moment(dates[1]).format("DD-MM-YYYY")).isBetween(
              booking.fromdate,
              booking.todate
            )
          ) {
            if (
              moment(dates[0].format("DD-MM-YYYY")) !== booking.fromdate &&
              moment(dates[0].format("DD-MM-YYYY")) !== booking.todate &&
              moment(dates[1].format("DD-MM-YYYY")) !== booking.fromdate &&
              moment(dates[1].format("DD-MM-YYYY")) !== booking.todate
            ) {
              availibility = true;
            } else {
              availibility = false;
              break;
            }
          } else {
            availibility = false;
            break;
          }
        }
      }
      if (availibility === true) {
        temprooms.push(room);
      }
    }
    setRooms(temprooms);
  }

  function filterBySearch() {
    const temprooms = duplicaterooms.filter((room) =>
      room.name.toLowerCase().includes(searchKey.toLowerCase())
    );
    setRooms(temprooms);
  }

  function filterByType(e) {
    if (e !== "all") {
      const temprooms = duplicaterooms.filter(
        (room) => room.type.toLowerCase() === e.toLowerCase()
      );
      setRooms(temprooms);
    } else setRooms(duplicaterooms);
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            value={searchKey}
            placeholder="search rooms"
            onChange={(e) => {
              setSearchKey(e.target.value);
            }}
            onKeyUp={filterBySearch}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            onChange={(e) => filterByType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="delux">Delux</option>
            <option value="non-delux">Non-Delux</option>
          </select>
        </div>
      </div>
      <div className="row justify-content-center mt-5">
        {loading === true ? (
          <h1>
            <Loader />
          </h1>
        ) : (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            {rooms.map((room) => {
              return (
                <div className="col-md-9 mt-2">
                  <Room
                    key={room._id}
                    room={room}
                    fromdate={fromdate}
                    todate={todate}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
