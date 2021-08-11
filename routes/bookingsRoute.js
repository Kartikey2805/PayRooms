const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const moment = require("moment");
const Room = require("../models/room");
const stripe = require("stripe")(
  "sk_test_51JKMAaSJhbsXoJeQDQXBVdtXGUxiKIWHLaHzoFfcNiyTUzoGMUq8QugqgLhTLhIG3J0ZKmPlhvoc5DrU3nniOhI100i8t9lPL5"
);
const { v4: uuidv4 } = require("uuid");

router.post("/bookroom", async (req, res) => {
  const { room, userid, fromdate, todate, totalamount, totaldays, token } =
    req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });
    const payment = await stripe.charges.create(
      {
        amount: totalamount * 100,
        customer: customer.id,
        currency: "inr",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );
    if (payment) {
      const newbooking = new Booking({
        room: room.name,
        roomid: room._id,
        userid,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        totalamount,
        totaldays,
        transactionid: "1234",
      });

      const booking = await newbooking.save();

      const roomtemp = await Room.findOne({ _id: room._id });

      roomtemp.currentbookings.push({
        bookingid: booking._id,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        userid: userid,
        status: booking.status,
      });

      await roomtemp.save();
    }
    res.send("Payment Successful, You Room is booked");
  } catch (err) {
    res.status(400).json({ error });
  }
});

router.post("/getbookingsbyuserid", async (req, res) => {
  const userid = req.body.userid;
  try {
    const bookings = await Booking.find({ userid: userid });
    res.send(bookings);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.post("/cancelbooking", async (req, res) => {
  try {
    const { bookingid, roomid } = req.body;
    const booking = await Booking.findOne({ _id: bookingid });
    booking.status = "cancelled";
    // booking.save()
    const room = await Room.findOne({ _id: roomid });
    const bookings = room.currentbookings;
    const temp = bookings.filter((b) => b.bookingid.toString() !== bookingid);
    room.currentbookings = temp;
    await booking.save();
    await room.save();
    res.send("Your booking cancelled successfully");
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.get("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (err) {
    return res.status(400).json({ message: err });
  }
});

module.exports = router;
