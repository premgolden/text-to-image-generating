// Replace with your Hugging Face API token
const token = "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";

// Query function for Hugging Face API
async function query(data) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const result = await response.blob();
    return result;
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to generate the image. Please try again.");
    return null;
  }
}

// DOM references
const inputTxt = document.getElementById("inputTxt");
const image = document.getElementById("generatedImage");
const generateBtn = document.getElementById("btn");
const loadingSpinner = document.getElementById("loadingSpinner");
const loadingMessage = document.getElementById("loadingMessage");
const timerElement = document.getElementById("timer");
const downloadButton = document.getElementById("downloadButton");

// Button click event to generate the image
generateBtn.addEventListener("click", async () => {
  const userInput = inputTxt.value;
  if (!userInput) {
    alert("Please enter a description!");
    return;
  }

  // Show loading state and start timer
  loadingSpinner.style.display = "block";
  loadingMessage.style.display = "block";
  image.style.display = "none";
  downloadButton.style.display = "none";

  let seconds = 0;
  timerElement.innerText = `Time: ${seconds}s`;
  const timerInterval = setInterval(() => {
    seconds++;
    timerElement.innerText = `Time: ${seconds}s`;
  }, 1000);

  const data = { inputs: userInput };

  // Call the Hugging Face model and retrieve the image
  const generatedImage = await query(data);

  clearInterval(timerInterval);

  if (generatedImage) {
    const imageUrl = URL.createObjectURL(generatedImage);
    image.src = imageUrl;
    image.style.display = "block";
    downloadButton.style.display = "inline-block";
    downloadButton.href = imageUrl;
    loadingSpinner.style.display = "none";
    loadingMessage.style.display = "none";
  }
});
