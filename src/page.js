import "./style.css";
import { initThemeToggle } from "./theme.js";

const CASE_STUDIES = [
  {
    id: "winning-100cr-order",
    href: "/work/winning-100cr-order.html",
    title: "Winning a ₹100Cr order with no paid marketing",
  },
  {
    id: "vida-self-serve",
    href: "/work/vida-self-serve.html",
    title: "Turning a service into a product enterprises actually use",
  },
  {
    id: "slice-credit-card",
    href: "/work/slice-credit-card.html",
    title: "Turning a credit card into a shareable product experience",
  },
  {
    id: "prodigy-authoring",
    href: "/work/prodigy-authoring.html",
    title: "Cutting math question production time from 5 minutes to 1",
  },
];

initThemeToggle();
initShare();
initNextCaseStudy();

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
  const options = CASE_STUDIES.filter((study) => study.id !== currentId);
  if (!options.length) return;

  const pick = options[Math.floor(Math.random() * options.length)];

  links.forEach((link) => {
    link.href = pick.href;
    link.setAttribute("aria-label", `View next case study: ${pick.title}`);
  });
}
