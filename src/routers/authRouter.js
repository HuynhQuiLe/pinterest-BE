const express = require("express");
const authControllers = require("../controllers/authControllers");

const authRouter = express.Router();

authRouter.route("/login").post(authControllers.login);
authRouter.route("/register").post(authControllers.register);
authRouter.route("/logout").post(authControllers.logout);
authRouter.route("/refresh-token").post(authControllers.refreshToken);

module.exports = authRouter;
