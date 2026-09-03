const express = require("express");
const prisma = require("../prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/admin/checklist — checklist de l'utilisateur connecte
router.get("/checklist", requireAuth, async (req, res) => {
  const items = await prisma.checklistItem.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "asc" },
  });

  res.json(items);
});

// POST /api/admin/checklist — ajoute une etape pour l'utilisateur connecte
router.post("/checklist", requireAuth, async (req, res) => {
  const { label, description, category } = req.body;

  const item = await prisma.checklistItem.create({
    data: { label, description, category, userId: req.userId },
  });

  res.status(201).json(item);
});

// PATCH /api/admin/checklist/item/:id  { done: true|false }
router.patch("/checklist/item/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;

  // updateMany + verification du userId : empeche un utilisateur de modifier
  // une etape qui ne lui appartient pas, meme en devinant un id valide.
  const { count } = await prisma.checklistItem.updateMany({
    where: { id, userId: req.userId },
    data: { done },
  });

  if (count === 0) {
    return res.status(404).json({ error: "Etape introuvable" });
  }

  const item = await prisma.checklistItem.findUnique({ where: { id } });
  res.json(item);
});

// GET /api/admin/aids?category=logement
router.get("/aids", async (req, res) => {
  const { category } = req.query;

  const aids = await prisma.aid.findMany({
    where: category ? { category } : undefined,
    orderBy: { name: "asc" },
  });

  res.json(aids);
});

module.exports = router;
