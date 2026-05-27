const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    ticketUuid: {
      type: String,
      required: true,
      unique: true, // Guarantees no two passes on earth ever match
    },
    attended: {
      type: Boolean,
      default: false, // Flips to true when scanned
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("bookings", bookingSchema);