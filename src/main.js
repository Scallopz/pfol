import "./style.css";

const HELP_COPY = {
  design:
    "End-to-end product design for complex buyers — self-serve platforms, design systems, and UX that enterprises actually adopt.",
  brand:
    "Positioning, identity, and narrative that hold up in a procurement room and on a timeline. Buyer and audience, designed as two different problems.",
  growth:
    "Zero-to-one marketing engines, field evangelism, and organic moments that compound without paid spend.",
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

/* ——— Bookshelf ——— */
const shelf = document.getElementById("bookshelf");
const shelfRail = document.getElementById("shelf-rail");
const shelfLeft = document.getElementById("shelf-left");
const shelfRight = document.getElementById("shelf-right");
const bookOpen = document.getElementById("book-open");
const bookOpenBack = document.getElementById("book-open-back");
const bookOpenCover = document.getElementById("book-open-cover");
const bookOpenCoverWrap = document.getElementById("book-open-cover-wrap");
const bookOpenTitle = document.getElementById("book-open-title");
const bookOpenAuthor = document.getElementById("book-open-author");
const books = shelfRail ? [...shelfRail.querySelectorAll(".book")] : [];

let shelfOffset = 0;
const SHELF_STEP = 72;

function clampShelf() {
  if (!shelfRail || !shelf) return;
  const max = Math.max(0, shelfRail.scrollWidth - shelf.clientWidth + 24);
  shelfOffset = Math.min(0, Math.max(-max, shelfOffset));
  shelfRail.style.transform = `translateX(${shelfOffset}px)`;
}

shelfLeft?.addEventListener("click", () => {
  shelfOffset += SHELF_STEP * 2;
  clampShelf();
});

shelfRight?.addEventListener("click", () => {
  shelfOffset -= SHELF_STEP * 2;
  clampShelf();
});

/* drag to browse */
let dragging = false;
let dragStartX = 0;
let dragStartOffset = 0;
let moved = false;

shelfRail?.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".book") && event.pointerType === "mouse") {
    // allow click; still track mild drag on shelf empty space
  }
  dragging = true;
  moved = false;
  dragStartX = event.clientX;
  dragStartOffset = shelfOffset;
  shelfRail.setPointerCapture(event.pointerId);
  shelfRail.classList.add("is-dragging");
});

shelfRail?.addEventListener("pointermove", (event) => {
  if (!dragging) return;
  const dx = event.clientX - dragStartX;
  if (Math.abs(dx) > 4) moved = true;
  shelfOffset = dragStartOffset + dx;
  clampShelf();
});

function endDrag(event) {
  if (!dragging) return;
  dragging = false;
  shelfRail?.classList.remove("is-dragging");
  try {
    shelfRail?.releasePointerCapture(event.pointerId);
  } catch {
    /* ignore */
  }
}

shelfRail?.addEventListener("pointerup", endDrag);
shelfRail?.addEventListener("pointercancel", endDrag);

/* open book */
let tiltX = 0;
let tiltY = 0;
let tilting = false;

function openBook(book) {
  if (!bookOpen || !bookOpenCover) return;
  shelf?.setAttribute("hidden", "");
  bookOpen.hidden = false;
  bookOpenCover.src = book.dataset.cover || "";
  bookOpenCover.alt = book.dataset.title || "";
  if (bookOpenTitle) bookOpenTitle.textContent = book.dataset.title || "";
  if (bookOpenAuthor) bookOpenAuthor.textContent = book.dataset.author || "";
  tiltX = 0;
  tiltY = 0;
  applyTilt();
  bookOpenBack?.focus();
}

function closeBook() {
  if (!bookOpen) return;
  bookOpen.hidden = true;
  shelf?.removeAttribute("hidden");
}

function applyTilt() {
  if (!bookOpenCoverWrap) return;
  bookOpenCoverWrap.style.transform = `rotateY(${tiltY}deg) rotateX(${-tiltX}deg)`;
}

books.forEach((book) => {
  book.addEventListener("click", (event) => {
    if (moved) {
      event.preventDefault();
      return;
    }
    openBook(book);
  });
});

bookOpenBack?.addEventListener("click", closeBook);

bookOpenCoverWrap?.addEventListener("pointerdown", (event) => {
  tilting = true;
  bookOpenCoverWrap.setPointerCapture(event.pointerId);
});

bookOpenCoverWrap?.addEventListener("pointermove", (event) => {
  if (!tilting) return;
  const rect = bookOpenCoverWrap.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  tiltY = ((event.clientX - cx) / rect.width) * 36;
  tiltX = ((event.clientY - cy) / rect.height) * 24;
  applyTilt();
});

bookOpenCoverWrap?.addEventListener("pointerup", (event) => {
  tilting = false;
  try {
    bookOpenCoverWrap.releasePointerCapture(event.pointerId);
  } catch {
    /* ignore */
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (helpView?.classList.contains("is-open")) {
      closeHelp();
      return;
    }
    if (bookOpen && !bookOpen.hidden) {
      closeBook();
    }
  }
});

window.addEventListener("resize", clampShelf);
