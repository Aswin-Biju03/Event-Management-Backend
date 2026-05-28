require("dotenv").config();
const express = require("express");
const cors = require("cors");
require("./config/db");
const routes = require("./routes/allRoutes");

const server = express();

server.use(cors());
server.use(express.json());
server.use(routes);

server.get("/", (req, res) => {
  res.status(200).send(`<h1>Server Started and waiting for Requests</h1>`);
});

// ✅ Error handler must be LAST and return proper JSON
server.use((err, req, res, next) => {
  console.log("Global Error Handler:", err.message); // ← now you'll see the real error
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log("Server Started....");
});