const express = require("express");
const client = require("../claude");

const router = express.Router();

const SYSTEM_PROMPT =
  "Tu es un assistant d'orientation pour des etudiants etrangers en France. " +
  "Tu aides sur deux volets : educatif (choix d'ecoles/formations, alternance, stages) " +
  "et administratif (titre de sejour, aides disponibles, droit au travail etudiant). " +
  "Reponds de maniere claire et concise, et precise quand une demarche doit etre verifiee " +
  "aupres d'une source officielle (prefecture, CROUS, etc.).";

// POST /api/chatbot/message  { messages: [{ role: "user" | "assistant", content: string }] }
router.post("/message", async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages est requis" });
  }

  try {
    const response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages,
    });

    const textBlock = response.content.find((block) => block.type === "text");

    res.json({ reply: textBlock ? textBlock.text : "" });
  } catch (error) {
    console.error("Erreur chatbot:", error);
    res.status(502).json({ error: "Le service de chat est momentanement indisponible" });
  }
});

module.exports = router;
