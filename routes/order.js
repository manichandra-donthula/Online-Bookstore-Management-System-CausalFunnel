const express = require("express");
const { placeOrder, getAllOrders } = require("../controllers/order");
const { verifyToken, verifyRole } = require("../middleware/auth.js");

const router = express.Router();

router.post("/", verifyToken, verifyRole("customer"), placeOrder);
router.get("/", verifyToken, verifyRole("admin"), getAllOrders);

module.exports = router;
