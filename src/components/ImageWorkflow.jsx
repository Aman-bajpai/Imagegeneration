import React, { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

// Convert image to Base64 (without prefix)
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });

function ImageWorkflow() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState("");
  const [variationUrl, setVariationUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const stabilityApiKey = import.meta.env.VITE_STABILITY_API_TOKEN;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCaption("");
      setVariationUrl("");
      setError(null);
    }
  };

  // STEP 1 — Analyze the uploaded image using Gemini 2.5 Flash
  const handleAnalyzeImage = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    setCaption("");

    try {
      const base64Image = await toBase64(selectedFile);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: "Describe this image in one detailed, creative sentence for an image generator." },
                  {
                    inline_data: {
                      mime_type: selectedFile.type,
                      data: base64Image,
                    },
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(`Gemini 2.5 Flash failed: ${err.error.message}`);
      }

      const data = await response.json();
      const description = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setCaption(description);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2 — Generate variation using Stability AI
  const handleGenerateVariation = async () => {
    if (!caption) return;
    setIsLoading(true);
    setError(null);
    setVariationUrl("");

    try {
      const engineId = "stable-diffusion-xl-1024-v1-0"; // best quality model

      const response = await fetch(
        `https://api.stability.ai/v1/generation/${engineId}/text-to-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${stabilityApiKey}`,
          },
          body: JSON.stringify({
            text_prompts: [{ text: caption }],
            cfg_scale: 7,
            height: 1024,
            width: 1024,
            steps: 30,
            samples: 1,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Stability AI failed: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      const base64Image = result?.artifacts?.[0]?.base64;
      if (!base64Image) throw new Error("No image data returned from Stability AI.");

      setVariationUrl(`data:image/png;base64,${base64Image}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">🖼️ Image Workflow (Gemini 2.5 Flash + Stability AI)</h3>

      <div className="mb-6">
        <label className="block mb-2">
          <span className="sr-only">Choose image</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
          />
        </label>
      </div>

      {previewUrl && (
        <img
          src={previewUrl}
          alt="Preview"
          className="w-48 h-48 object-cover rounded-lg mb-4 border-2 border-gray-200"
        />
      )}

      <button 
        onClick={handleAnalyzeImage} 
        disabled={isLoading || !selectedFile}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Analyze Image (Gemini 2.5 Flash)
      </button>

      {isLoading && <div className="my-4"><LoadingSpinner /></div>}
      {error && <p className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">{error}</p>}

      <div className="space-y-6">
        {caption && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">🧠 Generated Caption:</h4>
            <blockquote className="italic text-gray-700 border-l-4 border-blue-500 pl-4 mb-4">
              {caption}
            </blockquote>
            <button 
              onClick={handleGenerateVariation} 
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Variation (Stability AI)
            </button>
          </div>
        )}

        {variationUrl && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="text-xl font-semibold mb-3 text-gray-800">🎨 Generated Variation:</h4>
            <img
              src={variationUrl}
              alt="Generated variation"
              className="w-full rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageWorkflow;
