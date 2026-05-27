const mongoose = require("mongoose");
const events = require("../models/eventModel");

// GET ALL EVENTS
exports.getAllEventsController = async (req, res) => {
  try {
    const allEvents = await events.find().sort({ date: 1 });
    res.status(200).json(allEvents);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE EVENT
exports.getEventByIdController = async (req, res) => {
  try {
    const event = await events.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE EVENT
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
      createdBy: req.payload, // Uses payload from verified adminMiddleware
    });
    res.status(201).json({ message: "Event created", event });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE EVENT (Already working!)
exports.updateEventController = async (req, res) => {
  try {
    const event = await events.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const updated = await events.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ message: "Event updated", event: updated });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE EVENT (Fixed & Simplified)
exports.deleteEventController = async (req, res) => {
  try {
    const { id } = req.params;

    // Direct deletion query bypasses extra lookup steps to prevent method crashes
    const deletedEvent = await events.findByIdAndDelete(id);
    
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found in database" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    console.log("Delete Controller Error:", err);
    res.status(500).json({ message: "Server error running delete loop" });
  }
};