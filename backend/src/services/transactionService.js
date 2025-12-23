const { Prisma } = require("@prisma/client");
const prisma = require("../utils/prisma");

const { Decimal } = Prisma;

const SUCCESS_STATUS = "SUCCESS";

async function transferFunds({ senderId, receiverId, amount }) {
  const value = new Decimal(amount);

  if (value.lte(0)) {
    const error = new Error("Amount must be greater than zero");
    error.statusCode = 400;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    const sender = await tx.user.findUnique({
      where: { id: senderId },
      select: { balance: true },
    });

    if (!sender) {
      const error = new Error("Sender not found");
      error.statusCode = 404;
      throw error;
    }

    if (sender.balance.lt(value)) {
      const error = new Error("Insufficient balance");
      error.statusCode = 400;
      throw error;
    }

    const receiver = await tx.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    });

    if (!receiver) {
      const error = new Error("Receiver not found");
      error.statusCode = 404;
      throw error;
    }

    const [updatedSender, updatedReceiver, auditLog] = await Promise.all([
      tx.user.update({
        where: { id: senderId },
        data: { balance: { decrement: value } },
        select: { id: true, balance: true, name: true },
      }),
      tx.user.update({
        where: { id: receiverId },
        data: { balance: { increment: value } },
        select: { id: true, balance: true, name: true },
      }),
      tx.auditLog.create({
        data: {
          senderId,
          receiverId,
          amount: value,
          status: SUCCESS_STATUS,
        },
        select: {
          id: true,
          senderId: true,
          receiverId: true,
          amount: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return { auditLog, updatedSender, updatedReceiver };
  });
}

async function getHistory(userId) {
  return prisma.auditLog.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      senderId: true,
      receiverId: true,
      amount: true,
      status: true,
      createdAt: true,
      sender: { select: { name: true } },
      receiver: { select: { name: true } },
    },
  });
}

async function getBalance(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, balance: true, name: true },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
}

module.exports = {
  transferFunds,
  getHistory,
  getBalance,
};

