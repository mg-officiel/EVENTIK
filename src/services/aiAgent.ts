import axios from "axios";

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;
const API_URL = "https://api.deepseek.com/chat/completions";

const agents = {
  visitorAgent: {
    role: "assistant",
    persona: `Tu es un agent IA qui informe les visiteurs sur les événements,
    répond aux questions générales, explique comment utiliser la plateforme,
    et donne des réponses simples et rapides.`
  },

  eventBuilderAgent: {
    role: "assistant",
    persona: `Tu es un agent IA expert en organisation d'événements.
    Tu aides l'utilisateur à créer son event, lui proposes des idées, des titres,
    des structures, des visuels, et l'accompagnes étape par étape.`
  }
};

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function askAI(
  agent: keyof typeof agents,
  messages: Message[]
) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "deepseek-chat",
        messages: [
          { role: "system", content: agents[agent].persona },
          ...messages
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.VITE_DEEPSEEK_API_KEY}`
        }
      }
    );


    
    if (!response.data?.choices?.[0]?.message?.content) {
  throw new Error("Réponse IA invalide");
}

return response.data.choices[0].message.content;

    /*const content =
      response.data?.choices?.[0]?.message?.content ??
      "Réponse invalide de l'IA.";

    return content;*/

  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Erreur venant de la réponse de l'API (ex: 401, 404, 500)
      console.error(
        "Erreur API DeepSeek:",
        error.response?.status,
        error.response?.data
      );
    } else {
      // Erreur de réseau ou autre
      console.error("Erreur inattendue:", error);
    }

    return "L'agent IA a rencontré une erreur.";
  }
}
