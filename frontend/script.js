const formElement = document.getElementById("audio-form");
const video = document.getElementById("video");
const track = document.getElementById("track");
const hiddenLogs = document.getElementById("hidden-logs");
const submitAudioButton = document.getElementById("submit");

const audioInput = document.getElementById("audio");

const converToVttButton = document.getElementById("convertButton");
const selectModel = document.getElementById("select-model");
const demoButton = document.getElementById("demo-button");
const detailsContainer = document.getElementById("details-container");

const DEMO_URL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/191332/tina.mp4";
const BASE_URL = "/whisper";

converToVttButton.disabled = true;

formElement.addEventListener("submit", async (event) => {
  try {
    event.preventDefault();

    const form = new FormData(event.target);
    form.append("model", form.get("models"));

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

    converToVttButton.disabled = false;

    if (response.ok) {
      hiddenLogs.innerHTML = "Sucesso:\n" + JSON.stringify(data, null, 2);
      // createDownloadSubtitleButton(data.base64_content);
    }
  } catch (e) {
    hiddenLogs.innerHTML = "Erro: " + e.message;
  }
});
export function base64ToWebVTT(base64Data) {
  // Convert Base64 to Blob
  const binaryData = atob(base64Data);
  const arrayBuffer = new ArrayBuffer(binaryData.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < binaryData.length; i++) {
    uint8Array[i] = binaryData.charCodeAt(i);
  }
  const blob = new Blob([arrayBuffer], { type: "text/vtt" });

  // Create Object URL
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
}

function createDownloadSubtitleButton(base64Subtitle) {
  const fileName = "subtitle.vtt";
  const downloadLink = document.getElementById("downloadLink");
  const blobUrl = base64ToWebVTT(base64Subtitle);
  // Create and tridownloadLinkgger download anchor
  downloadLink.style.display = "block";

  downloadLink.href = blobUrl;
  downloadLink.download = fileName;
  // Set track subtitle with the blob generated
  track.src = blobUrl;
}

selectModel.addEventListener("change", (event) => {
  switch (event.target.value) {
    case "tiny":
      alert(
        "você selecionou o modelo minúsculo, que consome cerca de 1GB de VRAM"
      );
      break;
    case "base":
      alert(
        "você selecionou o modelo padrão, que consome cerca de 1GB de VRAM"
      );
      break;
    case "small":
      alert(
        "você selecionou o modelo pequeno, que consome cerca de 2GB de VRAM"
      );
      break;
    case "medium":
      alert("você selecionou o modelo médio, que consome cerca de 5GB de VRAM");
      break;
  }
});

audioInput.addEventListener("change", (event) => {
  if (event.target.files && event.target.files[0]) {
    const label = document.getElementById("audio-label");
    label.innerHTML = event.target.files[0].name ?? "Arquivo pronto";
  }
});

demoButton.addEventListener("click", () => {
  video.src = DEMO_URL;
});
