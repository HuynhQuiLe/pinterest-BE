const express = require("express");
const tokenMajors = require("../../config/jwt");
const userControllers = require("../../controllers/user/userControllers");
const upload = require("../../config/upload");

const userRouter = express.Router();

userRouter
  .route("/get-user")
  .get(tokenMajors.verifyToken, userControllers.getUser);

userRouter
  .route("/edit")
  .put(
    tokenMajors.verifyToken,
    upload.single("avatar"),
    userControllers.editUser
  );

module.exports = userRouter;
