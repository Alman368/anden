const carnetData = {
  course: "",
  liveClock: true,
  expiresAt: "",
  name: "",
  dni: "",
  niu: "",
  role: "Estudiante",
  photoSrc: "./assets/images/photo-placeholder.svg",
  photoAlt: "Foto del carnet",
  qrSeed: "",
};

const elements = {
  flipButton: document.getElementById("flipButton"),
  flipButtonLabel: document.getElementById("flipButtonLabel"),
  inlineFrontFlip: document.getElementById("inlineFrontFlip"),
  inlineFrontFlipLabel: document.getElementById("inlineFrontFlipLabel"),
  inlineBackFlip: document.getElementById("inlineBackFlip"),
  inlineBackFlipLabel: document.getElementById("inlineBackFlipLabel"),
  frontFace: document.getElementById("frontFace"),
  backFace: document.getElementById("backFace"),
  phoneShell: document.getElementById("phoneShell"),
  toolbar: document.getElementById("toolbar"),
  cardFront: document.getElementById("cardFront"),
  cardBack: document.getElementById("cardBack"),
  courseTitle: document.getElementById("courseTitle"),
  backCourseTitle: document.getElementById("backCourseTitle"),
  studentName: document.getElementById("studentName"),
  backStudentName: document.getElementById("backStudentName"),
  studentDni: document.getElementById("studentDni"),
  backStudentDni: document.getElementById("backStudentDni"),
  studentNiu: document.getElementById("studentNiu"),
  backStudentNiu: document.getElementById("backStudentNiu"),
  rolePill: document.getElementById("rolePill"),
  backRolePill: document.getElementById("backRolePill"),
  expiryDate: document.getElementById("expiryDate"),
  backExpiry: document.getElementById("backExpiry"),
  frontTimestamp: document.getElementById("frontTimestamp"),
  backTimestamp: document.getElementById("backTimestamp"),
  frontQr: document.getElementById("frontQr"),
  backQr: document.getElementById("backQr"),
  frontPortrait: document.getElementById("frontPortrait"),
  backPortrait: document.getElementById("backPortrait"),
};

const setupElements = {
  screen: document.getElementById("setupScreen"),
  name: document.getElementById("setupName"),
  dni: document.getElementById("setupDni"),
  niu: document.getElementById("setupNiu"),
  photoInput: document.getElementById("setupPhotoInput"),
  photoImg: document.getElementById("setupPhotoImg"),
  submit: document.getElementById("setupSubmit"),
};

const state = {
  showingBack: false,
  toolbarVisible: false,
};

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return { hours, minutes, seconds };
}

function getDisplayDate() {
  return new Date();
}

function computeAcademicMeta(date) {
  const year = date.getFullYear();
  const octoberFirst = new Date(year, 9, 1);

  if (date < octoberFirst) {
    return {
      course: `${year - 1}/${year}`,
      expiresAt: `30/09/${year}`,
    };
  }

  return {
    course: `${year}/${year + 1}`,
    expiresAt: `30/09/${year + 1}`,
  };
}

function updateClock() {
  const displayDate = getDisplayDate();
  const { hours, minutes, seconds } = formatTime(displayDate);
  const timestampHtml = `${hours}:${minutes}:<strong>${seconds}</strong><br>${formatDate(displayDate)}`;
  const timestampText = `${hours}:${minutes}:${seconds} · ${formatDate(displayDate)}`;

  elements.frontTimestamp.innerHTML = timestampHtml;
  elements.backTimestamp.textContent = timestampText;
}

function renderPseudoQr(canvas, seedInput) {
  const isBack = canvas.classList.contains("qr-code--back");
  const size = isBack ? 180 : 75;
  canvas.innerHTML = "";
  new QRCode(canvas, {
    text: isBack ? seedInput : "UMA-" + carnetData.niu,
    width: size,
    height: size,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.L,
  });
}

function applyData() {
  const academicMeta = computeAcademicMeta(new Date());
  carnetData.course = academicMeta.course;
  carnetData.expiresAt = academicMeta.expiresAt;
  carnetData.qrSeed = `UMA|${carnetData.name.replace(/ /g, "-")}|${carnetData.niu}|${carnetData.course}|${carnetData.expiresAt}`;
  const courseLabel = `Curso ${carnetData.course}`;

  elements.courseTitle.textContent = courseLabel;
  elements.backCourseTitle.textContent = courseLabel;
  elements.studentName.textContent = carnetData.name;
  elements.backStudentName.textContent = carnetData.name;
  elements.studentDni.textContent = `DNI: ${carnetData.dni}`;
  elements.backStudentDni.textContent = carnetData.dni;
  elements.studentNiu.textContent = `NIU: ${carnetData.niu}`;
  elements.backStudentNiu.textContent = carnetData.niu;
  elements.rolePill.textContent = carnetData.role;
  elements.backRolePill.textContent = carnetData.role;
  elements.expiryDate.textContent = carnetData.expiresAt;
  elements.backExpiry.textContent = `Valido hasta: ${carnetData.expiresAt}`;
  elements.frontPortrait.src = carnetData.photoSrc;
  elements.backPortrait.src = carnetData.photoSrc;
  elements.frontPortrait.alt = carnetData.photoAlt;
  elements.backPortrait.alt = carnetData.photoAlt;

  renderPseudoQr(elements.frontQr, carnetData.qrSeed);
  renderPseudoQr(elements.backQr, `${carnetData.qrSeed}|ESC`);
  updateClock();
}

function updateFaces() {
  elements.frontFace.classList.toggle("is-hidden", state.showingBack);
  elements.backFace.classList.toggle("is-hidden", !state.showingBack);
  elements.flipButtonLabel.textContent = state.showingBack ? "Anverso" : "Reverso";
  elements.inlineFrontFlipLabel.textContent = state.showingBack ? "Anverso" : "Reverso";
  elements.inlineBackFlipLabel.textContent = state.showingBack ? "Anverso" : "Reverso";
  elements.flipButton.setAttribute("aria-pressed", String(state.showingBack));
}

function updateToolbar() {
  elements.toolbar.classList.toggle("is-hidden", !state.toolbarVisible);
  elements.phoneShell.classList.toggle("toolbar-hidden", !state.toolbarVisible);
  elements.inlineFrontFlip.classList.toggle("is-hidden", state.toolbarVisible || state.showingBack);
  elements.inlineBackFlip.classList.toggle("is-hidden", state.toolbarVisible || !state.showingBack);
}

function toggleFaces() {
  state.showingBack = !state.showingBack;
  updateFaces();
  updateToolbar();
}

function toggleToolbar() {
  state.toolbarVisible = !state.toolbarVisible;
  updateToolbar();
}

function onCardTap(event) {
  if (event.target.closest("[data-no-toolbar-toggle]")) {
    return;
  }

  toggleToolbar();
}

/* --- Setup screen --- */

function loadSaved() {
  const saved = localStorage.getItem("carnetConfig");
  if (!saved) return null;
  return JSON.parse(saved);
}

function saveConfig(name, dni, niu, photoDataUrl) {
  localStorage.setItem("carnetConfig", JSON.stringify({ name, dni, niu, photoDataUrl }));
}

function showCarnet() {
  setupElements.screen.classList.add("is-hidden");
  elements.phoneShell.classList.remove("is-hidden");
  document.body.classList.add("carnet-active");
  applyData();
  updateFaces();
  updateToolbar();

  if (carnetData.liveClock) {
    window.setInterval(updateClock, 1000);
  }
}

function launchSetup(saved) {
  if (saved) {
    setupElements.name.value = saved.name;
    setupElements.dni.value = saved.dni;
    setupElements.niu.value = saved.niu;
    if (saved.photoDataUrl) {
      setupElements.photoImg.src = saved.photoDataUrl;
    }
  }
}

setupElements.photoInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    setupElements.photoImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

setupElements.submit.addEventListener("click", function () {
  const name = setupElements.name.value.trim().toUpperCase();
  const dni = setupElements.dni.value.trim().toUpperCase();
  const niu = setupElements.niu.value.trim().toUpperCase();

  if (!name || !dni || !niu) {
    alert("Por favor, rellena todos los campos.");
    return;
  }

  const photoDataUrl = setupElements.photoImg.src.startsWith("data:")
    ? setupElements.photoImg.src
    : null;

  carnetData.name = name;
  carnetData.dni = dni;
  carnetData.niu = niu;
  if (photoDataUrl) {
    carnetData.photoSrc = photoDataUrl;
  }

  saveConfig(name, dni, niu, photoDataUrl);
  showCarnet();
});

elements.flipButton.addEventListener("click", toggleFaces);
elements.inlineFrontFlip.addEventListener("click", toggleFaces);
elements.inlineBackFlip.addEventListener("click", toggleFaces);
elements.cardFront.addEventListener("click", onCardTap);
elements.cardBack.addEventListener("click", onCardTap);

/* --- Service Worker --- */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js").catch(function () {});
  });
}

/* --- Init --- */

const saved = loadSaved();
if (saved) {
  carnetData.name = saved.name;
  carnetData.dni = saved.dni;
  carnetData.niu = saved.niu;
  if (saved.photoDataUrl) {
    carnetData.photoSrc = saved.photoDataUrl;
  }
  showCarnet();
} else {
  launchSetup(null);
}
