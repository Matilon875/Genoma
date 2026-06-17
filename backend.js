import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🤖 OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// 🧠 NPC SYSTEM PROMPTS
function getSystemPrompt(npc) {
  return `
Eres un experto en genética y biología molecular.

Explica genes, ADN, cromosomas y enfermedades genéticas de forma sencilla para estudiantes y público general.

Evita tecnicismos innecesarios.

Máximo 5 frases.
`;
}
// 🌐 ENDPOINT IA
app.post("/chat", async (req, res) => {
  try {
    const { message, npc } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Falta el mensaje"
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 220,
      messages: [
        {
          role: "system",
          content: getSystemPrompt(npc)
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      reply: response.choices[0].message.content
    });

  } catch (error) {
    console.error("Error IA:", error);

    res.status(500).json({
      reply: "Error interno en la API"
    });
  }
});

// 🚀 RAILWAY PORT FIX
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en puerto ${PORT}`);
});
