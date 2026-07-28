import { installBeacon, report } from "./beacon.js";
import { createRoot } from "react-dom/client";
import PrepLedger from "./app.jsx";

// First line of the bundle, before React exists: from here on, a fault has
// somewhere to go. See src/beacon.js for why this is the only way an
// iOS-Safari-only failure ever reaches a future session.
installBeacon();

try {
  createRoot(document.getElementById("root"), {
    // React swallows anything an error boundary catches — TabGuard included —
    // so window.onerror never sees it. These three hooks are how those faults
    // reach the beacon without touching app.jsx at all.
    onUncaughtError: (error, info) => report(error, "react-uncaught", info && info.componentStack),
    onCaughtError: (error, info) => report(error, "react-caught", info && info.componentStack),
    onRecoverableError: (error, info) => report(error, "react-recoverable", info && info.componentStack),
  }).render(<PrepLedger />);
} catch (e) {
  // A mount failure is the worst case: a blank screen and no error boundary to
  // catch it. Record it, then rethrow so nothing else changes.
  report(e, "mount-failed", "");
  throw e;
}
