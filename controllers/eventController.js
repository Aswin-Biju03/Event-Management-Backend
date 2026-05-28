const mongoose = require("mongoose");
const events = require("../models/eventModel");

exports.getAllEventsController = async (req, res) => {
  try {
    const allEvents = await events.find().sort({ date: 1 });
    res.status(200).json(allEvents);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getEventByIdController = async (req, res) => {
  try {
    const event = await events.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createEventController = async (req, res) => {
  try {
    const { title, description, date, location, price, totalTickets, category, image } = req.body;
    if (!title || !date || !location || !totalTickets) {
      return res.status(400).json({ message: "Required fields missing" });
    }
    const event = await events.create({
      title,
      description,
      date,
      location,
      price: price || 0,
      totalTickets,
      category,
      image,
    });
    res.status(201).json({ message: "Event created", event });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateEventController = async (req, res) => {
  try {
    const event = await events.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    const updated = await events.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: false } 
    );
    res.status(200).json({ message: "Event updated", event: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEventController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid event ID format" });
    }
    const result = await events.collection.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};