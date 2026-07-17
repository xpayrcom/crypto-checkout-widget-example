const XPAYR_ORIGIN = "https://xpayr.com";
const modeButtons = [...document.querySelectorAll("[data-mode]")];
const launch = document.querySelector("#launch");
const status = document.querySelector("#status");
const preview = document.querySelector("#preview");
let mode = "popup";

modeButtons.forEach((button) => button.addEventListener("click", () => {
  mode = button.dataset.mode;
  modeButtons.forEach((candidate) => candidate.setAttribute("aria-pressed", String(candidate === button)));
}));

launch.addEventListener("click", async () => {
  launch.disabled = true;
  status.textContent = "Creating a server-side session...";
  try {
    const response = await fetch("/api/session", { method: "POST", headers: { Accept: "application/json" } });
    const session = await response.json();
    if (!response.ok) throw new Error(session.error || "Session creation failed");
    status.textContent = `Session ${session.payment_id} created. Completion must be confirmed server-side.`;
    if (mode === "redirect") window.location.assign(session.payment_url);
    if (mode === "popup") window.open(session.payment_url, "xpayr-checkout", "popup,width=520,height=760,noopener,noreferrer");
    if (mode === "embed") {
      const frame = document.createElement("iframe");
      frame.title = "XPayr checkout";
      frame.src = session.payment_url;
      frame.referrerPolicy = "strict-origin";
      frame.setAttribute("sandbox", "allow-forms allow-scripts allow-same-origin allow-popups");
      preview.replaceChildren(frame);
    }
  } catch (error) {
    status.textContent = error.message;
  } finally {
    launch.disabled = false;
  }
});

window.addEventListener("message", (event) => {
  if (event.origin !== XPAYR_ORIGIN) return;
  // Browser messages are UX signals only. Verify final state through your backend.
  if (event.data?.source === "xpayr-checkout") status.textContent = "Checkout activity received. Waiting for server verification.";
});
