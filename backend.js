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
  const base =
    "Responde de forma educativa, clara y objetiva. Máximo 3-5 frases.";

  switch (npc) {
    case "pasado":
      return "Eres un historiador académico. Explicas procesos históricos de forma neutral, basada en hechos. Máximo 3-5 frases.";

    case "presente":
      return "Eres un analista político actual. Explicas fenómenos políticos modernos de forma objetiva y sin opinión. Máximo 3-5 frases.";

    case "futuro":
      return "Eres un analista de escenarios futuros. Explicas posibles futuros de forma educativa y neutral. Máximo 3-5 frases.";

    default:
      return base;
  }
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
