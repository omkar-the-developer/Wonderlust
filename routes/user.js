const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { route } = require("./listing.js");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

//SignUp
router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signUp));

// Log In
router.route("/login")
    .get(userController.renderLogInForm)
    .post(
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    userController.logIn
);

//log out
router.get("/logout", userController.logOut);

module.exports = router;