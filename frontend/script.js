const formElement = document.getElementById("upload-video-form");
const videoElement = document.getElementById("video");
const videoElementTrack = document.getElementById("caption-track");

const uploadVideoInput = document.getElementById("upload-video");
const uploadVideoLabel = document.getElementById("upload-video-label");

const generateCaptionButton = document.getElementById("generateCaptionBtn");

const hiddenLogs = document.getElementById("subtitle-output");
const downloadLink = document.getElementById("downloadSubtitleBtn");

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

    generateCaptionButton.disabled = true;
    selectModel.disabled = true;
    generateCaptionButton.innerHTML = "Carregando...";

    uploadVideoLabel.classList.add("pointer-events-none");

    const response = await fetch(BASE_URL, options);
    const data = await response.json();

    if (response.ok) {
      setSubtitleMessage(data);
      createDownloadSubtitleButton(data.base64_content);
      setVideoTrack(data.base64_content);
    }
  } catch (e) {
    setSubtitleMessage(e.message);
  } finally {
    generateCaptionButton.innerHTML = "Generate caption";
    generateCaptionButton.disabled = false;
    selectModel.disabled = false;
    uploadVideoLabel.classList.remove("pointer-events-none");
  }
});

function setSubtitleMessage(messageToParse) {
  try {
    hiddenLogs.innerHTML = JSON.stringify(messageToParse, null, 2).replaceAll(
      '"',
      " "
    );
  } catch (e) {
    hiddenLogs.innerHTML = "Unecpected error";
  }
}

function base64ToWebVTT(base64Data) {
  const decodedText = atob(base64Data);

  const blob = new Blob([decodedText], { type: "text/vtt" });

  const blobUrl = URL.createObjectURL(blob);

  return blobUrl;
}

function createDownloadSubtitleButton(base64Content) {
  const fileName = "subtitle.vtt";

  // Create and tridownloadLinkgger download anchor
  downloadLink.style.display = "block";

  downloadLink.href = generateBlobUrlForTrack(base64Content);
  downloadLink.download = fileName;
}
function setVideoTrack(base64Content) {
  // Set track subtitle with the blob generated
  videoElementTrack.src = generateBlobUrlForTrack(base64Content);
}
function setVideoSRC(url) {
  // Set track subtitle with the blob generated
  videoElement.src = url;
}

function transformDemoURLToFile(url) {
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => new File([blob], "video.mp4", { type: blob.type }));
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
  setVideoSRC(DEMO_URL);

  transformDemoURLToFile(DEMO_URL).then((file) => {
    const dataTransfer = new DataTransfer();

    const newFile = new File([file], "demo.mp4", {
      type: file.type, // mantém o tipo original
      lastModified: file.lastModified, // Preserva a data original, se necessário
    });

    dataTransfer.items.add(newFile);

    uploadVideoInput.files = dataTransfer.files;
  });
});