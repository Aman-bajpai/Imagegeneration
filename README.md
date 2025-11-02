🚀 Project Workflows
This project features two main workflows:

#1. Text Input Workflow
A user enters a text prompt (e.g., "a tiger").

The app first calls the Hugging Face API to perform a sentiment analysis on the text.

After the user clicks "Approve & Generate," the app sends the prompt to the Stability.ai API (Text-to-Image) to generate a new image from scratch.

#2. Image Input Workflow
A user uploads an image from their computer.

The app simulates an "analysis" step to prepare for generation.

The user's original uploaded image is sent along with a simple prompt to the Stability.ai Image-to-Image API to generate a new, stylized variation of the original.

🛠️ Tech Stack & APIs Used
Frontend: React (Vite), JavaScript, CSS3

Hosting: Netlify

API Integrations:

Hugging Face: Used for the text analysis (cardiffnlp/twitter-roberta-base-sentiment).

Stability.ai: Used for both Text-to-Image (stable-diffusion-v1-5) and Image-to-Image (stable-diffusion-xl-1024-v1-0) generation.

⚙️ Local Setup and Installation
To run this project on your local machine:

Clone the repository:

Bash

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
Install dependencies:

Bash

npm install
Set up Environment Variables: Create a file named .env.local in the root of the project. You must get API keys from both Hugging Face and Stability.ai.

VITE_HF_API_TOKEN="hf_YOUR_HUGGINGFACE_KEY"
VITE_STABILITY_API_TOKEN="sk-YOUR_STABILITY_AI_KEY"
Run the project:

Bash

npm run dev


⚠️ Important Notes & Challenges


API Unreliability: A significant challenge during development was the unreliability of the Hugging Face free-tier Inference API. Many models (especially for text generation and image captioning) were frequently "unloaded" and returned 404 Not Found errors. The final implementation was simplified to use the most reliable and available API endpoints to meet the core requirements of the assignment.
