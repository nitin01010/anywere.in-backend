const express = require("express");
const router = express.Router();
const { tokenVerifyControllers } = require("../controllers/tokenVerifyControllers");

router.get("/tokenVerify", tokenVerifyControllers);

module.exports = router;