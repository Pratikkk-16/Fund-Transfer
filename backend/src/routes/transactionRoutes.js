const express = require("express");
const controller = require("../controllers/transactionController");

const router = express.Router();

router.post("/transfer", controller.postTransfer);
router.get("/history/:userId", controller.getHistory);
router.get("/balance/:userId", controller.getBalance);

module.exports = router;

