import "./style.css";
import { initThemeToggle } from "./theme.js";

initThemeToggle();

const BOOKS = [
  {
    title: "From Third World to First",
    author: "Lee Kuan Yew",
    cover: "/books/third-world-to-first.jpg",
    spine: "#1f4d6e",
    goodreads: "https://www.goodreads.com/book/show/144409.From_Third_World_to_First",
    summary:
      "Singapore’s founding prime minister on how a resource-poor island became a first-world state — discipline, pragmatism, and nation-building without romance.",
  },
  {
    title: "Behave",
    author: "Robert Sapolsky",
    cover: "/books/behave.jpg",
    spine: "#8b3a2a",
    goodreads: "https://www.goodreads.com/book/show/31170723-behave",
    summary:
      "A tour of human behavior from neurons to culture — why we do what we do, seconds to centuries before the act.",
  },
  {
    title: "The Book of Life",
    author: "J. Krishnamurti",
    cover: "/books/book-of-life.jpg",
    spine: "#2f5d3a",
    goodreads: "https://www.goodreads.com/book/show/143880.The_Book_of_Life",
    summary:
      "Daily teachings on attention, fear, love, and freedom — less self-help, more noticing how the mind actually works.",
  },
  {
    title: "Enshittification",
    author: "Cory Doctorow",
    cover: "/books/enshittification.jpg",
    spine: "#c45c26",
    goodreads: "https://www.goodreads.com/book/show/222376640-enshittification",
    summary:
      "How platforms decay — bait users, squeeze business customers, then extract until nothing’s left. A field guide to fighting it.",
  },
  {
    title: "Based on a True Story",
    author: "Norm Macdonald",
    cover: "/books/based-on-a-true-story.jpg",
    spine: "#222222",
    goodreads: "https://www.goodreads.com/book/show/28686959-based-on-a-true-story",
    summary:
      "A fake memoir that’s somehow truer than most real ones — gambling, comedy, and Norm’s deadpan war on sincerity.",
  },
  {
    title: "Seveneves",
    author: "Neal Stephenson",
    cover: "/books/seveneves.jpg",
    spine: "#0d3b5c",
    goodreads: "https://www.goodreads.com/book/show/22816087-seveneves",
    summary:
      "The moon blows up; humanity has two years to get off Earth. Hard SF about survival, orbital engineering, and what five thousand years later looks like.",
  },
];

/* ——— Bookshelf (featured cover + spine stack → Inspect) ——— */
const shelfStage = document.getElementById("shelf-stage");
const shelfStack = document.getElementById("shelf-stack");
const shelfTicks = document.getElementById("shelf-ticks");
const shelfCounter = document.getElementById("shelf-counter");
const shelfTitle = document.getElementById("shelf-title");
const shelfAuthor = document.getElementById("shelf-author");
const shelfInspectBtn = document.getElementById("shelf-inspect");
const shelfLeft = document.getElementById("shelf-left");
const shelfRight = document.getElementById("shelf-right");
const inspectView = document.getElementById("shelf-inspect-view");
const inspectBack = document.getElementById("inspect-back");
const inspectBook = document.getElementById("inspect-book");
const inspectCover = document.getElementById("inspect-cover");
const inspectTitle = document.getElementById("inspect-title");
const inspectAuthor = document.getElementById("inspect-author");
const inspectSummary = document.getElementById("inspect-summary");
const inspectGoodreads = document.getElementById("inspect-goodreads");
const booksFallback = document.getElementById("books-fallback");

let index = 0;
let orbitX = 12;
let orbitY = -18;
let zoom = 1;
let orbiting = false;
let lastPointer = { x: 0, y: 0 };

function pad(n) {
  return String(n).padStart(2, "0");
}

function renderFallback() {
  if (!booksFallback) return;
  booksFallback.innerHTML = BOOKS.map(
    (b) =>
      `<li>${b.title} <span class="author">— ${b.author}</span></li>`,
  ).join("");
}

function renderTicks() {
  if (!shelfTicks) return;
  shelfTicks.innerHTML = BOOKS.map(
    (_, i) =>
      `<button type="button" class="shelf-tick${i === index ? " is-active" : ""}" data-i="${i}" aria-label="Book ${i + 1}" role="tab" aria-selected="${i === index}"></button>`,
  ).join("");
  shelfTicks.querySelectorAll(".shelf-tick").forEach((tick) => {
    tick.addEventListener("click", () => {
      index = Number(tick.dataset.i);
      renderShelf();
    });
  });
}

function bookMesh(book, { spineOnly = false } = {}) {
  if (spineOnly) {
    return `<div class="book3d"><div class="book3d-face book3d-spine">${book.title}</div></div>`;
  }
  return `<div class="book3d">
    <div class="book3d-face book3d-cover"><img src="${book.cover}" alt="" /></div>
    <div class="book3d-face book3d-spine">${book.title}</div>
    <div class="book3d-face book3d-pages" aria-hidden="true"></div>
    <div class="book3d-face book3d-back" aria-hidden="true"></div>
  </div>`;
}

function renderShelf() {
  if (!shelfStack) return;
  const total = BOOKS.length;
  index = ((index % total) + total) % total;

  shelfStack.innerHTML = '<div class="shelf-floor" aria-hidden="true"></div>';

  // Featured on left of center, spines continue to the right — whole cluster centered
  const spineStep = 2.85; // rem
  const featuredWidth = 12.5;
  const visibleSpines = Math.min(4, total - 1);
  const clusterWidth = featuredWidth + visibleSpines * spineStep;
  const featuredLeft = -clusterWidth / 2; // rem from center

  BOOKS.forEach((book, i) => {
    const el = document.createElement("button");
    el.type = "button";
    el.className = "shelf-book";
    el.style.setProperty("--spine", book.spine);
    el.dataset.index = String(i);
    el.setAttribute("aria-label", `${book.title} by ${book.author}`);

    const relative = (i - index + total) % total;
    el.dataset.relative = String(relative);

    if (relative === 0) {
      el.classList.add("is-active");
      el.innerHTML = bookMesh(book);
      el.style.zIndex = "30";
      el.style.marginLeft = "0";
      el.style.transform = `translateX(${featuredLeft}rem)`;
    } else if (relative <= visibleSpines) {
      el.classList.add("is-behind");
      el.innerHTML = bookMesh(book, { spineOnly: true });
      el.style.zIndex = String(20 - relative);
      const x = featuredLeft + featuredWidth + 0.35 + (relative - 1) * spineStep;
      el.style.transform = `translateX(${x}rem)`;
    } else {
      el.classList.add("is-hidden");
      el.hidden = true;
    }

    el.addEventListener("click", (event) => {
      if (shelfMoved) {
        event.preventDefault();
        return;
      }
      event.stopPropagation();
      if (relative === 0) {
        openInspect();
      } else {
        index = i;
        renderShelf();
      }
    });

    shelfStack.appendChild(el);
  });

  const current = BOOKS[index];
  if (shelfCounter) {
    shelfCounter.textContent = `${pad(index + 1)} / ${pad(total)}`;
  }
  if (shelfTitle) shelfTitle.textContent = current.title;
  if (shelfAuthor) shelfAuthor.textContent = current.author;
  renderTicks();
}

function openInspect() {
  const book = BOOKS[index];
  if (!inspectView || !shelfStage) return;
  shelfStage.hidden = true;
  inspectView.hidden = false;

  if (inspectCover) {
    inspectCover.src = book.cover;
    inspectCover.alt = book.title;
  }
  const spine = document.getElementById("inspect-spine");
  if (spine) spine.textContent = book.title;
  if (inspectBook) inspectBook.style.setProperty("--spine", book.spine);
  if (inspectTitle) inspectTitle.textContent = book.title;
  if (inspectAuthor) inspectAuthor.textContent = book.author;
  if (inspectSummary) inspectSummary.textContent = book.summary;
  if (inspectGoodreads) inspectGoodreads.href = book.goodreads;

  orbitX = 14;
  orbitY = -32;
  zoom = 1;
  applyOrbit();
  inspectBack?.focus();
}

function closeInspect() {
  if (!inspectView || !shelfStage) return;
  inspectView.hidden = true;
  shelfStage.hidden = false;
  shelfInspectBtn?.focus();
}

function applyOrbit() {
  if (!inspectBook) return;
  inspectBook.style.transform = `rotateX(${orbitX}deg) rotateY(${orbitY}deg) scale(${zoom})`;
}

shelfLeft?.addEventListener("click", () => {
  index -= 1;
  renderShelf();
});

shelfRight?.addEventListener("click", () => {
  index += 1;
  renderShelf();
});

shelfInspectBtn?.addEventListener("click", openInspect);
inspectBack?.addEventListener("click", closeInspect);

/* drag shelf horizontally — only after intentional drag, don't steal book clicks */
let draggingShelf = false;
let shelfStartX = 0;
let shelfMoved = false;
let shelfPointerId = null;

shelfStack?.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  // Allow starting a drag, but don't capture until moved
  draggingShelf = true;
  shelfMoved = false;
  shelfStartX = event.clientX;
  shelfPointerId = event.pointerId;
});

shelfStack?.addEventListener("pointermove", (event) => {
  if (!draggingShelf || event.pointerId !== shelfPointerId) return;
  const dx = event.clientX - shelfStartX;
  if (!shelfMoved && Math.abs(dx) < 28) return;
  if (!shelfMoved) {
    shelfMoved = true;
    try {
      shelfStack.setPointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
  }
  if (Math.abs(dx) > 40) {
    index += dx < 0 ? 1 : -1;
    shelfStartX = event.clientX;
    renderShelf();
  }
});

function endShelfDrag(event) {
  if (!draggingShelf || event.pointerId !== shelfPointerId) return;
  draggingShelf = false;
  try {
    shelfStack.releasePointerCapture(event.pointerId);
  } catch {
    /* ignore */
  }
  // Keep shelfMoved true through the synthetic click, then clear
  window.setTimeout(() => {
    shelfMoved = false;
  }, 0);
  shelfPointerId = null;
}

shelfStack?.addEventListener("pointerup", endShelfDrag);
shelfStack?.addEventListener("pointercancel", endShelfDrag);

/* inspect orbit + zoom */
inspectBook?.addEventListener("pointerdown", (event) => {
  orbiting = true;
  lastPointer = { x: event.clientX, y: event.clientY };
  inspectBook.setPointerCapture(event.pointerId);
  inspectBook.classList.add("is-dragging");
});

inspectBook?.addEventListener("pointermove", (event) => {
  if (!orbiting) return;
  const dx = event.clientX - lastPointer.x;
  const dy = event.clientY - lastPointer.y;
  lastPointer = { x: event.clientX, y: event.clientY };
  orbitY += dx * 0.45;
  orbitX -= dy * 0.35;
  orbitX = Math.max(-35, Math.min(35, orbitX));
  applyOrbit();
});

function endOrbit(event) {
  if (!orbiting) return;
  orbiting = false;
  inspectBook?.classList.remove("is-dragging");
  try {
    inspectBook?.releasePointerCapture(event.pointerId);
  } catch {
    /* ignore */
  }
}

inspectBook?.addEventListener("pointerup", endOrbit);
inspectBook?.addEventListener("pointercancel", endOrbit);

inspectBook?.addEventListener(
  "wheel",
  (event) => {
    if (inspectView?.hidden) return;
    event.preventDefault();
    zoom += event.deltaY > 0 ? -0.06 : 0.06;
    zoom = Math.max(0.75, Math.min(1.45, zoom));
    applyOrbit();
  },
  { passive: false },
);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (inspectView && !inspectView.hidden) {
      closeInspect();
      return;
    }
  }
  if (inspectView && !inspectView.hidden) return;
  if (!shelfStage || shelfStage.hidden) return;
  if (event.key === "ArrowLeft") {
    index -= 1;
    renderShelf();
  }
  if (event.key === "ArrowRight") {
    index += 1;
    renderShelf();
  }
});

renderFallback();
renderShelf();
