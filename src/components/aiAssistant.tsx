import { useState } from "react";
//import { generateEventInfo } from "../services/aiAgent";
import { X } from "lucide-react";

export default function FloatingAIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const data = await generateEventInfo(input);
      setResult(data);
    } catch (err) {
      console.error("Erreur IA:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-black text-white shadow-xl flex items-center justify-center text-lg"
      >
        IA
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed bottom-0 right-0 w-full sm:w-96 h-[80%] bg-white shadow-2xl p-4 z-50 transform transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold">Assistant IA</h2>
          <button onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          Décris ton événement. Je génère un titre, description et prix suggéré.
        </p>

        {/* Prompt */}
        <textarea
          className="w-full h-24 border rounded p-2 text-sm mb-2 resize-none"
          placeholder="Ex: concert afro à Douala, 300 places..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          className="w-full bg-black text-white py-2 rounded text-sm"
        >
          Générer
        </button>

        {/* Loading */}
        {loading && (
          <div className="mt-4 animate-pulse text-sm text-gray-500">
            L’IA réfléchit…
          </div>
        )}

        {/* Résultat */}
        {result && (
          <div className="mt-4 bg-gray-50 border rounded p-3 space-y-3">
            <div>
              <p className="text-xs text-gray-600">Titre</p>
              <p className="font-medium">{result.title}</p>
            </div>

            <div>
              <p className="text-xs text-gray-600">Description</p>
              <p className="text-sm whitespace-pre-line">
                {result.description}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600">Prix suggéré</p>
              <p className="text-sm">{result.suggestedPrice} FCFA</p>
            </div>

            <button
              className="w-full bg-blue-600 text-white py-2 rounded text-sm"
              onClick={() => alert("Appliqué au formulaire")}
            >
              Appliquer au formulaire
            </button>
          </div>
        )}
      </div>
    </>
  );
}
