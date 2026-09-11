// Page entry for the Today screen. It mounts the approved-design view over the real
// adapter and, if anything at all goes wrong, says so without painting a number.
import app from "./today-app.cjs";

const { mountToday, createTodayModel } = app;

try {
  mountToday(document, createTodayModel());
} catch (error) {
  const host = document.getElementById("phone");
  if (host) host.textContent = "Today could not open on this device. Nothing was changed or recorded.";
  const status = document.getElementById("today-status");
  if (status) status.textContent = "Today did not open. Nothing was recorded.";
}

export { mountToday, createTodayModel };
