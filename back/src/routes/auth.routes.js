const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

const router = express.Router();

const TOKEN_TTL = "7d";

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: TOKEN_TTL });
}

function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

// POST /api/auth/register  { email, password, firstName, lastName, country? }
router.post("/register", async (req, res) => {
  const { email, password, firstName, lastName, country } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: "email, password, firstName et lastName sont requis" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "Le mot de passe doit contenir au moins 8 caracteres" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Un compte existe deja avec cet email" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, firstName, lastName, country },
  });

  res.status(201).json({ token: signToken(user.id), user: toPublicUser(user) });
});

// POST /api/auth/login  { email, password }
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "email et password sont requis" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user && (await bcrypt.compare(password, user.passwordHash));

  if (!valid) {
    return res.status(401).json({ error: "Email ou mot de passe incorrect" });
  }

  res.json({ token: signToken(user.id), user: toPublicUser(user) });
});

module.exports = router;
