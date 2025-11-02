// This function queries the Hugging Face API
// It smartly handles both JSON (for text) and Blob (for images) data.

export async function queryHF(model, data) {
  const apiToken = import.meta.env.VITE_HF_API_TOKEN;
  const apiUrl = `https://api-inference.huggingface.co/models/${model}`;

  // Prepare headers and body
  const headers = {
    Authorization: `Bearer ${apiToken}`,
  };

  let body;

  // Check if data is raw bytes (for image upload) or JSON
  if (data instanceof ArrayBuffer || data instanceof Blob) {
    body = data;
  } else {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }

  // Make the API request
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: body,
  });

  // Handle errors
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
  }

  // Check content type to decide how to parse the response
  const contentType = response.headers.get('content-type');

  if (contentType.includes('application/json')) {
    return await response.json(); // For text analysis, text-gen
  } else if (contentType.includes('image')) {
    return await response.blob(); // For text-to-image
  } else {
    // Fallback for unexpected content types
    return await response.text();
  }
}