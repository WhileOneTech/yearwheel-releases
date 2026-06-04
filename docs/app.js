// Download page logic for the YearWheel release site.
//
// Pulls the latest GitHub Release via the public API (CORS-enabled), detects the visitor's OS,
// and wires up the primary "Download" button plus the full per-platform list. Everything degrades
// gracefully to the Releases page if the API is unavailable.

const REPO = "WhileOneTech/yearwheel-releases";
const RELEASES_LATEST = `https://github.com/${REPO}/releases/latest`;
const API_LATEST = `https://api.github.com/repos/${REPO}/releases/latest`;

// --- OS / architecture detection -------------------------------------------------
function detectOS() {
  const ua = navigator.userAgent;
  const plat = navigator.platform || "";
  const isArm = /arm|aarch64/i.test(ua);
  if (/Win/i.test(ua) || /Win/i.test(plat)) return { os: "windows", label: "Windows" };
  if (/Mac/i.test(ua) || /Mac/i.test(plat)) {
    // Apple Silicon is hard to detect reliably; assume arm64 on modern Macs unless told otherwise.
    return { os: "macos", label: "macOS", arch: isArm ? "aarch64" : "unknown" };
  }
  if (/Linux/i.test(ua) || /Linux/i.test(plat)) return { os: "linux", label: "Linux" };
  return { os: "unknown", label: "your platform" };
}

// --- Classify a release asset by filename ----------------------------------------
function classify(name) {
  const n = name.toLowerCase();
  if (n.endsWith("-setup.exe")) return { os: "windows", kind: "Installer (.exe)", weight: 1 };
  if (n.endsWith(".msi")) return { os: "windows", kind: "Installer (.msi)", weight: 2 };
  if (n.endsWith(".dmg")) {
    const arch = /(aarch64|arm64)/.test(n) ? "aarch64" : /(x64|x86_64|intel)/.test(n) ? "x64" : "";
    return { os: "macos", arch, kind: `Disk image (.dmg)${arch ? " · " + (arch === "aarch64" ? "Apple Silicon" : "Intel") : ""}`, weight: arch === "aarch64" ? 1 : 2 };
  }
  if (n.endsWith(".appimage")) return { os: "linux", kind: "AppImage", weight: 1 };
  if (n.endsWith(".deb")) return { os: "linux", kind: "Debian package (.deb)", weight: 2 };
  if (n.endsWith(".rpm")) return { os: "linux", kind: "RPM package", weight: 3 };
  return null; // skip .sig, latest.json, .app.tar.gz, etc.
}

function fmtSize(bytes) {
  if (!bytes) return "";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

async function init() {
  const me = detectOS();
  const osNote = document.getElementById("os-note");
  const primaryBtn = document.getElementById("primary-download");
  const primaryLabel = document.getElementById("primary-download-label");
  const versionPill = document.getElementById("version-pill");
  const list = document.getElementById("downloads-list");

  let release;
  try {
    const res = await fetch(API_LATEST, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    release = await res.json();
  } catch (err) {
    osNote.textContent = "Couldn't load the latest release automatically.";
    primaryLabel.textContent = "Go to downloads";
    list.innerHTML = `<li class="muted">Open the <a href="${RELEASES_LATEST}">latest release on GitHub</a> to pick a build.</li>`;
    return;
  }

  // Version pill
  if (release.tag_name) {
    versionPill.textContent = release.tag_name;
    versionPill.hidden = false;
  }

  // Build classified asset list
  const assets = (release.assets || [])
    .map((a) => ({ ...a, info: classify(a.name) }))
    .filter((a) => a.info);

  if (assets.length === 0) {
    osNote.textContent = "";
    primaryBtn.href = release.html_url || RELEASES_LATEST;
    primaryLabel.textContent = "View latest release";
    list.innerHTML = `<li class="muted">No installers attached yet — see the <a href="${release.html_url || RELEASES_LATEST}">release page</a>.</li>`;
    return;
  }

  // Pick the best asset for the detected OS (lowest weight wins).
  const forMe = assets
    .filter((a) => a.info.os === me.os)
    .sort((a, b) => a.info.weight - b.info.weight);

  if (forMe.length > 0) {
    const best = forMe[0];
    primaryBtn.href = best.browser_download_url;
    primaryLabel.textContent = `Download for ${me.label}`;
    osNote.textContent = `Detected ${me.label}. ${best.info.kind}${best.size ? " · " + fmtSize(best.size) : ""}.`;
  } else {
    primaryBtn.href = release.html_url || RELEASES_LATEST;
    primaryLabel.textContent = "Choose a download";
    osNote.textContent = `No automatic match for ${me.label} — pick a build below.`;
  }

  // Full list, grouped by OS
  const order = { windows: 0, macos: 1, linux: 2 };
  const osLabels = { windows: "Windows", macos: "macOS", linux: "Linux" };
  assets.sort((a, b) =>
    (order[a.info.os] - order[b.info.os]) || (a.info.weight - b.info.weight)
  );

  list.innerHTML = "";
  for (const a of assets) {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = a.browser_download_url;
    link.innerHTML = `
      <span><strong>${osLabels[a.info.os]}</strong> — ${a.info.kind}</span>
      <span class="dl-meta">${fmtSize(a.size)}</span>`;
    li.appendChild(link);
    list.appendChild(li);
  }
}

init();
