const transactionService = require("../services/transactionService");

const DEFAULT_SENDER_ID = 1;

async function postTransfer(req, res) {
  try {
    const senderId = DEFAULT_SENDER_ID;
    const { receiverId, amount } = req.body;

    if (!receiverId || amount === undefined) {
      return res.status(400).json({ message: "receiverId and amount are required" });
    }

    const parsedReceiverId = Number(receiverId);
    const parsedAmount = Number(amount);

    if (Number.isNaN(parsedReceiverId) || Number.isNaN(parsedAmount)) {
      return res.status(400).json({ message: "receiverId and amount must be numbers" });
    }

    const { auditLog, updatedSender, updatedReceiver } =
      await transactionService.transferFunds({
        senderId,
        receiverId: parsedReceiverId,
        amount: parsedAmount,
      });

    return res.status(201).json({
      message: "Transfer successful",
      auditLog,
      balances: {
        sender: updatedSender,
        receiver: updatedReceiver,
      },
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message || "Internal server error" });
  }
}

async function getHistory(req, res) {
  try {
    const { userId } = req.params;
    const parsedUserId = Number(userId);

    if (Number.isNaN(parsedUserId)) {
      return res.status(400).json({ message: "userId must be a number" });
    }

    const history = await transactionService.getHistory(parsedUserId);
    return res.json({ history });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message || "Internal server error" });
  }
}

async function getBalance(req, res) {
  try {
    const { userId } = req.params;
    const parsedUserId = Number(userId);

    if (Number.isNaN(parsedUserId)) {
      return res.status(400).json({ message: "userId must be a number" });
    }

    const balance = await transactionService.getBalance(parsedUserId);
    return res.json({ balance });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({ message: error.message || "Internal server error" });
  }
}

module.exports = {
  postTransfer,
  getHistory,
  getBalance,
};

