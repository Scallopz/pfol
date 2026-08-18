import "./style.css";
import { initThemeToggle } from "./theme.js";

initThemeToggle();
initShare();

function initShare() {
  const buttons = document.querySelectorAll("[data-share]");
  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const title =
        document.querySelector("h1")?.textContent?.trim() || document.title;
      const url = window.location.href;
      const label = button.dataset.label || "Share";

      try {
        if (navigator.share) {
          await navigator.share({ title, text: title, url });
          return;
        }
      } catch (error) {
        if (error?.name === "AbortError") return;
      }

      try {
        await navigator.clipboard.writeText(url);
        button.textContent = "Link copied";
        button.classList.add("is-copied");
        window.setTimeout(() => {
          button.textContent = label;
          button.classList.remove("is-copied");
        }, 1800);
      } catch {
        window.prompt("Copy this link:", url);
      }
    });
  });
}
