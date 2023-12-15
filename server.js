const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const rootRouter = require("./src/routers/rootRouter");

const app = express();
const PORT = process.env.PORT || 8888;

// middelware
app.use(express.json());
app.use(cors());

// directory
app.use(express.static("."));

// route
app.use(rootRouter);

app.listen(PORT, (req, res) => {
  console.log(`Server is running on PORT ${PORT}`);
});
