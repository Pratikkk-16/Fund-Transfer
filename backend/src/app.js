const express = require("express");
const cors = require("cors");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", transactionRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;
