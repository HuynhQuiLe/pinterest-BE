const express = require("express");
const authRouter = require("./authRouter");
const pinterestRouter = require("./pinterest/pinterestRoute");
const userRouter = require("./user/userRouter");

const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/user", userRouter);
rootRouter.use("/pinterest", pinterestRouter);

module.exports = rootRouter;
