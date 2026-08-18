import "./style.css";

const HELP_COPY = {
  design:
    "[Placeholder — how you help with product design: discovery, UX, systems, shipping.]",
  brand:
    "[Placeholder — brand systems, narrative, visual identity, launch stories.]",
  growth:
    "[Placeholder — growth loops, marketing sites, campaigns, product-led GTM.]",
};

const themeToggle = document.getElementById("theme-toggle");
const mainView = document.getElementById("main-view");
const helpView = document.getElementById("help-view");
const helpOpen = document.getElementById("help-open");
const helpBack = document.getElementById("help-back");
const helpSubtitle = document.getElementById("help-subtitle");
const helpButtons = document.querySelectorAll(".help-btn");

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
}

themeToggle?.addEventListener("click", () => {
  const next =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(next);
});

function openHelp() {
  mainView.hidden = true;
  helpView.hidden = false;
  helpView.classList.add("is-open");
  helpBack?.focus();
}

function closeHelp() {
  helpView.classList.remove("is-open");
  helpView.hidden = true;
  mainView.hidden = false;
  helpOpen?.focus();
}

helpOpen?.addEventListener("click", openHelp);
helpBack?.addEventListener("click", closeHelp);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && helpView.classList.contains("is-open")) {
    closeHelp();
  }
});

helpButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const topic = button.dataset.topic;
    helpButtons.forEach((other) => {
      other.classList.toggle("active", other === button);
      other.setAttribute("aria-selected", other === button ? "true" : "false");
    });

    if (!helpSubtitle || !topic || !(topic in HELP_COPY)) return;

    helpSubtitle.classList.remove("is-visible");
    window.setTimeout(() => {
      helpSubtitle.textContent = HELP_COPY[topic];
      helpSubtitle.classList.add("is-visible");
    }, 120);
  });
});
