require("express-async-errors");
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

const kantinRoutes = require("./routes/kantinRoutes");
const menuRoutes = require("./routes/menuRoutes"); // TODO C2
const errorHandler = require("./middlewares/errorHandler"); // TODO D2

app.use(cors());
app.use(express.json());

app.use("/kantin", kantinRoutes);
app.use("/menu", menuRoutes); // TODO C3

// TODO D3: harus menjadi middleware paling akhir
app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Terhubung ke MongoDB");

    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Gagal terhubung ke MongoDB:", err.message);
    process.exit(1);
  });