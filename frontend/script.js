const formElement = document.getElementById("upload-video-form");
const videoElement = document.getElementById("video");
const videoElementTrack = document.getElementById("video-track");

const uploadVideoInput = document.getElementById("upload-video");
const uploadVideoLabel = document.getElementById("upload-video-label");

const submitAudioButton = document.getElementById("submit");

const hiddenLogs = document.getElementById("hidden-logs");
const detailsContainer = document.getElementById("details-container");

const selectModel = document.getElementById("select-model");
const demoButton = document.getElementById("demo-button");

const DEMO_URL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/191332/tina.mp4";
const BASE_URL = "/whisper";

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
    selectModel.disabled = true;
    submitAudioButton.innerHTML = "Carregando...";

    const response = await fetch(BASE_URL, options);
    const data = await response.json();

    if (response.ok) {
      hiddenLogs.innerHTML = "Sucesso:\n" + JSON.stringify(data, null, 2);
      createDownloadSubtitleButton(data.base64_content);
      setVideoTrack(data.base64_content);
    }
  } catch (e) {
    hiddenLogs.innerHTML = "Erro: " + e.message;
  } finally {
    detailsContainer.open = true;
    submitAudioButton.innerHTML = "Enviar";
    submitAudioButton.disabled = false;
    selectModel.disabled = false;
  }
});
function base64ToWebVTT(base64Data) {
  const decodedText = atob(base64Data);

  const blob = new Blob([decodedText], { type: "text/vtt" });

  const blobUrl = URL.createObjectURL(blob);

  return blobUrl;
}

function createDownloadSubtitleButton(base64Content) {
  const fileName = "subtitle.vtt";
  const downloadLink = document.getElementById("downloadLink");
  // Create and tridownloadLinkgger download anchor
  downloadLink.style.display = "block";

  downloadLink.href = generateBlobUrlForTrack(base64Content);
  downloadLink.download = fileName;
}
function setVideoTrack(base64Content) {
  // Set track subtitle with the blob generated
  videoElementTrack.src = generateBlobUrlForTrack(base64Content);
}

function generateBlobUrlForTrack(base64Content) {
  const blobUrl = base64ToWebVTT(base64Content);
  return blobUrl;
}

selectModel.addEventListener("change", (event) => {
  
  const startMessage =
    "You've selected the {{model}} model, which requires {{quantity}} of VRAM";

  const replaceMessageWithModel = ({ startMessage }) => {
    return startMessage.replace("{{model}}", event.target.value);
  };

  const replaceRequiredVRAMBasedOnModel = ({ finalMessage, model }) => {
    const models = {
      tiny: "1GB",
      base: "1GB",
      small: "2GB",
      medium: "5GB",
      large: "10GB",
    };
    return finalMessage.replace("{{quantity}}", models[model]);
  };

  const startMessageWithModel = replaceMessageWithModel({ startMessage });

  const finalMessageModelAndRequiredVRAM = replaceRequiredVRAMBasedOnModel({
    finalMessage: startMessageWithModel,
    model: event.target.value,
  });

  document.getElementById("model-info").innerHTML =
    finalMessageModelAndRequiredVRAM;
  document.getElementById("myModal").showModal();
    
});

uploadVideoInput.addEventListener("change", (event) => {
  if (event.target.files && event.target.files[0]) {
    uploadVideoLabel.innerHTML = event.target.files[0].name ?? "File ready";
    videoElement.src = URL.createObjectURL(event.target.files[0]);
  }
});

demoButton.addEventListener("click", () => {
  videoElement.src = DEMO_URL;
});

function toggleWhisper() {
  const el = document.getElementById("showwhispercontainer");
  const backBtn = document.getElementById("back__button");
  const mainGp = document.getElementById("maingroup");

  if (el.classList.contains("hideblock")) {
    el.classList.add("showblock");
    mainGp.classList.add("hideblock");
    backBtn.classList.remove("hideblock");
    el.classList.remove("hideblock");
  } else {
    el.classList.remove("showblock");
    backBtn.classList.add("hideblock");
    mainGp.classList.remove("hideblock");

    el.classList.add("hideblock");
  }
}
