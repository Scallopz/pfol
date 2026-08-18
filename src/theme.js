export function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }

  themeToggle?.addEventListener("click", () => {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
  });
}
