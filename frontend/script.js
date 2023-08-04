const formElement = document.getElementById("audio-form");
const track = document.getElementById("track");
const logsTextArea = document.getElementById("logs");
const submitAudioButton = document.getElementById("submit");
const BASE_URL = "http://backend:5000/whisper";

formElement.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();

    const form = new FormData(event.target);
    form.append("model", "base");

    const options = {
      method: "POST",
      body: form,
    };

    submitAudioButton.disabled = true;
    submitAudioButton.innerHTML = "Carregando...";

    const response = await fetch(BASE_URL, options);
    const data = await response.json();

    submitAudioButton.innerHTML = "Enviar";
    submitAudioButton.disabled = false;

    if (response.ok) {
      logsTextArea.innerHTML = "Sucesso:\n" + JSON.stringify(data, null, 2);
    } else {
      logsTextArea.innerHTML = "Erro:\n" + JSON.stringify(data, null, 2);
    }
  } catch (e) {
    logsTextArea.innerHTML = "Erro: " + e;
  }
});


// Function to convert base64-encoded plain text to WebVTT format
function convertBase64ToWebVTT(base64Text) {
  // Decode base64 to plain text
  const plainText = atob(base64Text);

  const lines = plainText.trim().split("\n");
  const vttLines = [];

  for (let i = 0; i < lines.length; i++) {
    const startTime = (i * 2).toFixed(1); // Time in seconds
    const endTime = ((i + 1) * 2).toFixed(1); // Time in seconds

    const vttLine = `${startTime} --> ${endTime}\n${lines[i]}\n`;
    vttLines.push(vttLine);
  }

  return "WEBVTT\n\n" + vttLines.join("\n");
}
const base64PlainText =
  "V0VCVlRUCgowMDowMC4wMDAgLS0+IDAwOjAyLjAwMApJIGtub3cuCgowMDowNC4wMDAgLS0+IDAwOjA1LjAwMApXaG8gdGhlIGhlbGwgaXMgdGhhdD8KCjAwOjMwLjAwMCAtLT4gMDA6MzIuMDAwClllYWguCgo=";

const webVTTContent = convertBase64ToWebVTT(base64PlainText);

// Create a Blob containing the WebVTT content
const blob = new Blob([webVTTContent], { type: "text/vtt" });

// Set the src attribute of the track element to the URL of the Blob
track.src = URL.createObjectURL(blob);
