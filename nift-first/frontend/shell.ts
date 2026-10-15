// Static pages need no React. This small enhancement owns theme, tab context and app links.
const note = document.querySelector<HTMLInputElement>("[data-session-note]");
try {
  const p = JSON.parse(localStorage.getItem("pulse-preferences") || "null");
  if (p?.theme) document.documentElement.dataset.theme = p.theme;
  if (note) {
    note.value = sessionStorage.getItem("pulse-note") || "";
    note.addEventListener("input", () =>
      sessionStorage.setItem("pulse-note", note.value),
    );
  }
} catch {}
// Only the embedded workspace uses Router navigation. Static site transitions are documents.
if (location.pathname.startsWith("/app")) {
  // Freeze Nift-resolved header URLs before Router changes the document URL.
  for (const a of document.querySelectorAll<HTMLAnchorElement>("header a"))
    a.href = new URL(a.href).href;
  document.querySelector("header")?.addEventListener("click", (e) => {
    const a = (e.target as Element).closest("a");
    const url = a && new URL(a.href);
    if (
      url?.pathname.startsWith("/app") &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.shiftKey &&
      !e.altKey &&
      e.button === 0
    ) {
      e.preventDefault();
      window.dispatchEvent(
        new CustomEvent("pulse-navigate", { detail: url.pathname }),
      );
    }
  });
}
