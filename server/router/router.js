const express = require("express");
const router = express.Router();

// AUTH ENDPOINTS
const { signup } = require("../controller/Signup");
const { login } = require("../controller/Login");
const { getAllLeaves } = require("../controller/Leave");
const { auth } = require("../middleware/auth");

// FILE ENDPOINTS
const { imageUpload } = require("../controller/File");
const { getAllFiles } = require("../controller/File");

// LEAVE ENDPOINTS
const { createLeave } = require("../controller/Leave");

// AUTH ROUTES
router.post("/signup", signup);
router.post("/login", login);
router.get("/dashboard", auth, getAllLeaves);

// FILE ROUTES
router.post("/imageUpload", imageUpload);
router.get("/getAllimage", getAllFiles);

// LEAVE ROUTES
router.post("/createLeave", auth, createLeave);
module.exports = router;
