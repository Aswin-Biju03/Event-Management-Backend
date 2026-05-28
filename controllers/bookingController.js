const Booking = require("../models/bookingModel");
const { v4: uuidv4 } = require("uuid"); 

exports.createBookingController = async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    if (!eventId || !userId) {
      return res.status(400).json({ message: "Required booking properties are missing." });
    }

    const secureUuid = uuidv4();

    const newBooking = await Booking.create({
      eventId,
      userId,
      ticketUuid: secureUuid, 
    });

    res.status(201).json({ 
      message: "Booking confirmed!", 
      booking: newBooking 
    });
  } catch (err) {
    console.error("Booking Controller Crash:", err);
    res.status(500).json({ message: "Internal server error saving booking details." });
  }
};

exports.getUserBookingsController = async (req, res) => {
  try {
    const { userId } = req.params;

    const userTickets = await Booking.find({ userId }).populate("eventId");
    res.status(200).json(userTickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to grab user ticket rows." });
  }
};

exports.verifyTicketController = async (req, res) => {
  try {
    const { ticketUuid } = req.params; // String sent by camera reader parameter route link

    const ticket = await Booking.findOne({ ticketUuid });

    if (!ticket) {
      return res.status(404).json({ message: "Access Denied! Invalid Pass Code." });
    }

    if (ticket.attended) {
      return res.status(400).json({ message: "Duplicate Entry! This ticket pass has already been checked in." });
    }

    ticket.attended = true;
    await ticket.save();

    res.status(200).json({ message: "Access Granted! Entry authorized successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gate attendance checking runtime failure." });
  }
};

exports.getAllBookingsController = async (req, res) => {
  try {
    const allBookings = await Booking.find().populate("eventId");
    res.status(200).json(allBookings);
  } catch (err) {
    console.error("Admin Global Bookings Error:", err);
    res.status(500).json({ message: "Internal server error reading platform metrics repository." });
  }
};