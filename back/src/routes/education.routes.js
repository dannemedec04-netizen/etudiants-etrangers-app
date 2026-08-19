const express = require("express");
const prisma = require("../prisma");

const router = express.Router();

// GET /api/education/formations?field=Informatique&city=Lyon&type=alternance
router.get("/formations", async (req, res) => {
  const { field, city, type } = req.query;

  const formations = await prisma.formation.findMany({
    where: {
      ...(field ? { field } : {}),
      ...(type ? { type } : {}),
      ...(city ? { school: { city: { contains: city, mode: "insensitive" } } } : {}),
    },
    include: { school: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(formations);
});

// GET /api/education/offers?field=Informatique&type=stage
router.get("/offers", async (req, res) => {
  const { field, type } = req.query;

  const offers = await prisma.jobOffer.findMany({
    where: {
      ...(field ? { field } : {}),
      ...(type ? { type } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  res.json(offers);
});

module.exports = router;
