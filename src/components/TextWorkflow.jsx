import React, { useState } from 'react';
import { queryHF } from '../api/huggingFace';
import LoadingSpinner from './LoadingSpinner';

function TextWorkflow() {
  const [prompt, setPrompt] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisDone, setAnalysisDone] = useState(false); // New state

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setImageUrl("");
    setAnalysisDone(false);

    try {
      // 1. Analyze Tone (Text Classification)
      // Trying the original model again now that your key is fixed.
      const analysisRes = await queryHF(
        "cardiffnlp/twitter-roberta-base-sentiment",
        { inputs: prompt }
      );
      setAnalysis(analysisRes[0]); // e.g., [{ label: 'Positive', score: 0.9 }]
      setAnalysisDone(true); // Show the "Generate" button

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setIsLoading(false);
  };

  const handleGenerateImage = async () => {
    setIsLoading(true);
    setError(null);
    setImageUrl("");

    // Get the new API key from the .env file
    const stabilityApiKey = import.meta.env.VITE_STABILITY_API_TOKEN;
    const engineId = "stable-diffusion-xl-1024-v1-0";
    
    try {
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
            text_prompts: [{ text: prompt }],
            cfg_scale: 7,
            // XL models must be 1024x1024
            height: 1024,
            width: 1024,
            steps: 30,
            samples: 1,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Stability.ai request failed: ${response.status} ${errorText}`);
      }

      const responseJSON = await response.json();
      
      // Stability.ai returns the image as a base64 string
      const base64Image = responseJSON.artifacts[0].base64;
      
      // We must add this prefix for the browser to display a base64 image
      setImageUrl(`data:image/png;base64,${base64Image}`);

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="workflow-box">
      <h3>Text Input Workflow</h3>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt, e.g., 'a cat sitting on a windowsill'"
      />
      <button onClick={handleAnalyze} disabled={isLoading || !prompt}>
        Analyze Prompt
      </button>

      {isLoading && <LoadingSpinner />}
      {error && <p className="error-message">{error}</p>}

      <div className="results-section">
        {analysis && (
          <p>
            <strong>Tone Analysis:</strong> {analysis[0].label} (Score: {analysis[0].score.toFixed(2)})
          </p>
        )}
        
        {analysisDone && !imageUrl && (
          <div>
            <button onClick={handleGenerateImage} disabled={isLoading}>
              Approve & Generate Image
            </button>
          </div>
        )}

        {imageUrl && (
          <div>
            <h4>Generated Image:</h4>
            <img src={imageUrl} alt="Generated from text prompt" />
          </div>
        )}
      </div>
    </div>
  );
}

export default TextWorkflow;