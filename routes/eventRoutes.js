const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
    getEvents,
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

router.get("/", getEvents);
router.post("/", auth, createEvent);
router.get("/:id", getEventById);
router.put("/:id", auth, updateEvent);
router.delete("/:id", auth, deleteEvent);

module.exports = router;