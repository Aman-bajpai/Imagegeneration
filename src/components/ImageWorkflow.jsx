import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

function ImageWorkflow() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [caption, setCaption] = useState(""); // We will set this manually
  const [variationUrl, setVariationUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCaption(""); // Reset old results
      setVariationUrl("");
    }
  };

  // This function is now just for show. It "analyzes" by setting a fake caption.
  const handleAnalyzeImage = () => {
    if (!selectedFile) return;
    setError(null);
    setCaption("A new variation of the uploaded image."); // Set a simple prompt
  };

  const handleGenerateVariation = async () => {
    if (!caption || !selectedFile) return;

    setIsLoading(true);
    setError(null);
    setVariationUrl("");

    const stabilityApiKey = import.meta.env.VITE_STABILITY_API_TOKEN;
    const engineId = "stable-diffusion-xl-1024-v1-0"; // Use the XL engine

    try {
      // 1. Create FormData to send the image file
      const formData = new FormData();
      formData.append('init_image', selectedFile); // Append the image
      formData.append('init_image_mode', "IMAGE_STRENGTH");
      formData.append('image_strength', 0.35); // How much to change the image (0.0 = total change, 1.0 = no change)
      formData.append('text_prompts[0][text]', caption); // Use the caption as the prompt
      formData.append('text_prompts[0][weight]', 1);
      formData.append('cfg_scale', 7);
      formData.append('samples', 1);
      formData.append('steps', 30);

      // 2. Call the Stability.ai Image-to-Image API
      const response = await fetch(
        `https://api.stability.ai/v1/generation/${engineId}/image-to-image`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${stabilityApiKey}`,
            // Do NOT set "Content-Type": "application/json",
            // The browser will automatically set it to "multipart/form-data"
          },
          body: formData, // Send the form data
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Stability.ai request failed: ${response.status} ${errorText}`);
      }

      const responseJSON = await response.json();
      const base64Image = responseJSON.artifacts[0].base64;
      setVariationUrl(`data:image/png;base64,${base64Image}`);

    } catch (err) {
      console.error(err);
      setError(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="workflow-box">
      <h3>Image Input Workflow</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      
      {previewUrl && (
        <img src={previewUrl} alt="Selected preview" style={{width: 200, marginBottom: 10}} />
      )}

      {/* This button now just shows the "Generate Variation" button */}
      <button onClick={handleAnalyzeImage} disabled={isLoading || !selectedFile}>
        Analyze Image
      </button>

      {isLoading && <LoadingSpinner />}
      {error && <p className="error-message">{error}</p>}

      <div className="results-section">
        {caption && (
          <div>
            <h4>Analysis Complete. Ready to vary.</h4>
            <blockquote>{caption}</blockquote>
            <button onClick={handleGenerateVariation} disabled={isLoading}>
              Generate Variation
            </button>
          </div>
        )}

        {variationUrl && (
          <div>
            <h4>Generated Variation:</h4>
            <img src={variationUrl} alt="Generated variation from image" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageWorkflow;