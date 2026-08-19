const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

// GET /api/admin/checklist/:userId
router.get("/checklist/:userId", async (req, res) => {
  const { userId } = req.params;

  const items = await prisma.checklistItem.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  res.json(items);
});

// POST /api/admin/checklist/:userId
router.post("/checklist/:userId", async (req, res) => {
  const { userId } = req.params;
  const { label, category } = req.body;

  const item = await prisma.checklistItem.create({
    data: { label, category, userId },
  });

  res.status(201).json(item);
});

// PATCH /api/admin/checklist/item/:id
router.patch("/checklist/item/:id", async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;

  const item = await prisma.checklistItem.update({
    where: { id },
    data: { done },
  });

  res.json(item);
});

module.exports = router;
