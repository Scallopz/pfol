import "./style.css";
import { initThemeToggle } from "./theme.js";
import { CASE_STUDIES, tagsMarkup } from "./case-studies.js";

initThemeToggle();
initShare();
initNextCaseStudy();
renderCaseTags();

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

function initNextCaseStudy() {
  const links = document.querySelectorAll("[data-next-case]");
  if (!links.length) return;

  const currentId =
    document.querySelector("[data-case-study]")?.dataset.caseStudy || "";
  const index = CASE_STUDIES.findIndex((study) => study.id === currentId);
  if (index === -1 || CASE_STUDIES.length < 2) return;

  const next = CASE_STUDIES[(index + 1) % CASE_STUDIES.length];

  links.forEach((link) => {
    link.href = next.href;
    link.setAttribute("aria-label", `Read next case study: ${next.title}`);
  });
}

function renderCaseTags() {
  const host = document.querySelector("[data-case-tags]");
  if (!host) return;

  const currentId =
    document.querySelector("[data-case-study]")?.dataset.caseStudy || "";
  const study = CASE_STUDIES.find((item) => item.id === currentId);
  if (!study) return;

  host.outerHTML = tagsMarkup(study.tags);
}
