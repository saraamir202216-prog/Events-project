const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const User = require("./models/User");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    // Ensure a default admin exists
    (async () => {
        try {
            const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
            const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

            const existing = await User.findOne({ email: adminEmail });
            if (!existing) {
                // Create user with plain password so model pre-save hook hashes it once
                await User.create({ email: adminEmail, password: adminPassword, role: "admin" });
                console.log(`Default admin created: ${adminEmail}`);
            }
        } catch (err) {
            console.error("Error creating default admin", err);
        }
    })();
})
.catch(err => {
    console.log(err);
});

app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});