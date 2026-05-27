const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    totalTickets: {
      type: Number,
      required: true,
    },
    ticketsSold: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

const events = mongoose.model("events", eventSchema);

module.exports = events;