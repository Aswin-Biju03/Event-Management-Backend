const express = require("express");
const router = express.Router();

const eventController = require("../controllers/eventController");
const userController = require("../controllers/userController");
const bookingController = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// AUTH ENDPOINTS
router.post("/register", userController.registerController);
router.post("/login", userController.loginController);

// USER EVENT VIEW
router.get("/events", eventController.getAllEventsController);

// USER PROTECTED TICKETING 
if (bookingController && bookingController.createBookingController) {
  router.post("/bookings", authMiddleware, bookingController.createBookingController);
}
if (bookingController && bookingController.getUserBookingsController) {
  router.get("/bookings/user/:userId", authMiddleware, bookingController.getUserBookingsController);
}

// ADMIN METRICS PLATFORM LOOKUP 
if (bookingController && bookingController.getAllBookingsController) {
  router.get("/admin/bookings", adminMiddleware, bookingController.getAllBookingsController);
}

// ADMIN ACTIONS
router.post("/events", adminMiddleware, eventController.createEventController);
router.put("/events/:id", adminMiddleware, eventController.updateEventController);
router.delete("/events/:id", adminMiddleware, eventController.deleteEventController);

if (bookingController && bookingController.verifyTicketController) {
  router.patch("/bookings/verify/:ticketUuid", adminMiddleware, bookingController.verifyTicketController);
}

router.get("/events/:id", eventController.getEventByIdController);

module.exports = router;