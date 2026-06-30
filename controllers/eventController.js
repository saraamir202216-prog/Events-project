const Event = require("../models/Event");

const getEvents = async (req, res) => {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
};

const createEvent = async (req, res) => {
    const event = new Event(req.body);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
};

const updateEvent = async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(updatedEvent);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const deleteEvent = async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);

        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEventById = async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
};

module.exports = {
    getEvents,
    createEvent,
    getEventById,
    updateEvent,
    deleteEvent
};