const express = require("express");
const photoRouter = require("./photoRoute");

const pinterestRouter = express.Router();

pinterestRouter.use("/photo", photoRouter);

module.exports = pinterestRouter;
