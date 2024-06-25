const express = require("express");
const router = express.Router();

const {handleGetRoom} = require("../controllers/room");

router.get("/", handleGetRoom);

module.exports = router;
