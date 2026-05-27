const Booking = require("../models/bookingModel");
const { v4: uuidv4 } = require("uuid"); // Generates standard secure string tokens

// 1. CREATE BOOKING & GENERATE SECURE UUID (Payment success callback triggers this)
exports.createBookingController = async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    if (!eventId || !userId) {
      return res.status(400).json({ message: "Required booking properties are missing." });
    }

    // Generate a secure, unique 36-character alphanumeric string layout
    const secureUuid = uuidv4();

    const newBooking = await Booking.create({
      eventId,
      userId,
      ticketUuid: secureUuid, // Saved securely in database
    });

    res.status(201).json({ 
      message: "Booking confirmed!", 
      booking: newBooking // Contains the generated UUID string sent back to frontend
    });
  } catch (err) {
    console.error("Booking Controller Crash:", err);
    res.status(500).json({ message: "Internal server error saving booking details." });
  }
};

// 2. FETCH TICKETS WITH POPULATED DATA FOR THE USER DASHBOARD
exports.getUserBookingsController = async (req, res) => {
  try {
    const { userId } = req.params;

    // Pulls bookings and uses 'eventId' reference pointer to populate title/venue text parameters
    const userTickets = await Booking.find({ userId }).populate("eventId");
    res.status(200).json(userTickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to grab user ticket rows." });
  }
};

// 3. ADMIN GATE VERIFICATION (MATCHES SCANNER TEXT VALUE AGAINST TICKET UUID)
exports.verifyTicketController = async (req, res) => {
  try {
    const { ticketUuid } = req.params; // String sent by camera reader parameter route link

    // Search database directly matching the custom string field layout
    const ticket = await Booking.findOne({ ticketUuid });

    if (!ticket) {
      return res.status(404).json({ message: "Access Denied! Invalid Pass Code." });
    }

    if (ticket.attended) {
      return res.status(400).json({ message: "Duplicate Entry! This ticket pass has already been checked in." });
    }

    // Authenticated! Modify status state flags directly
    ticket.attended = true;
    await ticket.save();

    res.status(200).json({ message: "Access Granted! Entry authorized successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gate attendance checking runtime failure." });
  }
};

// 🌟 4. NEW: FETCH ALL PLATFORM BOOKINGS FOR ADMIN METRICS & FINANCIAL REVENUE
exports.getAllBookingsController = async (req, res) => {
  try {
    // Finds all booking instances across the platform and cross-references event pricing
    const allBookings = await Booking.find().populate("eventId");
    res.status(200).json(allBookings);
  } catch (err) {
    console.error("Admin Global Bookings Error:", err);
    res.status(500).json({ message: "Internal server error reading platform metrics repository." });
  }
};