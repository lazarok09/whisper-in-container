const formElement = document.getElementById("audio-form");
const track = document.getElementById("track");
const logsTextArea = document.getElementById("logs");
const submitAudioButton = document.getElementById("submit");
const base64Input = document.getElementById("base64Input");
const copyBase64Button = document.getElementById("copyBase64Button");

const converToVttButton = document.getElementById("convertButton");

const BASE_URL = "/whisper";

copyBase64Button.disabled = true;
converToVttButton.disabled = true;

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
    copyBase64Button.disabled = false;
    converToVttButton.disabled = false;

    if (response.ok) {
      logsTextArea.innerHTML = "Sucesso:\n" + JSON.stringify(data, null, 2);
      base64Input.value = data.base64_content;
    } else {
      logsTextArea.innerHTML = "Erro:\n" + JSON.stringify(data, null, 2);
    }
  } catch (e) {
    logsTextArea.innerHTML = "Erro: " + e;
  }
});

function base64ToWebVTT(base64Data) {
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

copyBase64Button.addEventListener("click", () => {
  var copyText = base64Input;

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);
});

converToVttButton.addEventListener("click", () => {
  if (base64Input.value?.length > 1) {
    const fileName = "subtitle.vtt";
    const downloadLink = document.getElementById("downloadLink");
    const blobUrl = base64ToWebVTT(base64Input.value);
    // Create and tridownloadLinkgger download anchor
    downloadLink.style.display = "block";
  
    downloadLink.href = blobUrl;
    downloadLink.download = fileName;

    // Set track subtitle with the blob generated
    track.src = blobUrl;
  }
});
