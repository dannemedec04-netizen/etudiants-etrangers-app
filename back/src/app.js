const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const educationRoutes = require("./routes/education.routes");
const adminRoutes = require("./routes/admin.routes");
const chatbotRoutes = require("./routes/chatbot.routes");

const app = express();

// CORS_ORIGIN : liste d'origines separees par des virgules (ex: https://mon-app.vercel.app).
// Si absent (dev local), on autorise toutes les origines.
const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim());
app.use(cors({ origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : true }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chatbot", chatbotRoutes);

module.exports = app;
