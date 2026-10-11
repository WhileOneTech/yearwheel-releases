// Download page logic for the YearWheel release site.
//
// Pulls the published GitHub Releases via the public API (CORS-enabled), detects the visitor's OS,
// and wires up the primary "Download" button plus the full per-platform list. Platforms don't
// always ship together, so each one is served from the newest release that has a build for it
// (e.g. macOS from a newer release while Windows stays on the previous one). Everything degrades
// gracefully to the Releases page if the API is unavailable.

const REPO = "WhileOneTech/yearwheel-releases";
const RELEASES_LATEST = `https://github.com/${REPO}/releases/latest`;
const API_RELEASES = `https://api.github.com/repos/${REPO}/releases?per_page=30`;

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
  if (n.endsWith(".msi")) return { os: "windows", kind: "Installer (.msi)", weight: 1 };
  if (n.endsWith("-setup.exe")) return { os: "windows", kind: "Installer (.exe)", weight: 2 };
  // The macOS zip holds the app plus an install script that takes care of Gatekeeper for
  // builds that aren't notarised yet, so it's the recommended Mac download.
  if (n.endsWith(".zip") && /macos/.test(n)) {
    return { os: "macos", kind: "App + install script (.zip) · Apple Silicon & Intel", weight: 0 };
  }
  if (n.endsWith(".dmg")) {
    const arch = /universal/.test(n) ? "universal" : /(aarch64|arm64)/.test(n) ? "aarch64" : /(x64|x86_64|intel)/.test(n) ? "x64" : "";
    const archLabels = { universal: "Apple Silicon & Intel", aarch64: "Apple Silicon", x64: "Intel" };
    return { os: "macos", arch, kind: `Disk image (.dmg)${arch ? " · " + archLabels[arch] : ""}`, weight: arch === "x64" ? 2 : 1 };
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
  const secondaryDownload = document.getElementById("secondary-download");

  let releases;
  try {
    const res = await fetch(API_RELEASES, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    releases = (await res.json())
      .filter((r) => !r.draft && !r.prerelease)
      .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    if (releases.length === 0) throw new Error("No published releases");
  } catch (err) {
    osNote.textContent = "Couldn't load the latest release automatically.";
    primaryLabel.textContent = "Go to downloads";
    list.innerHTML = `<li class="muted">Open the <a href="${RELEASES_LATEST}">latest release on GitHub</a> to pick a build.</li>`;
    return;
  }

  // For each platform, take its builds from the newest release that has any.
  const assets = [];
  const releaseFor = {};
  for (const release of releases) {
    const classified = (release.assets || [])
      .map((a) => ({ ...a, info: classify(a.name), tag: release.tag_name }))
      .filter((a) => a.info && !releaseFor[a.info.os]);
    for (const os of new Set(classified.map((a) => a.info.os))) releaseFor[os] = release;
    assets.push(...classified);
  }
  const release = releaseFor[me.os] || releases[0];

  // Version pill: the version this visitor will get.
  if (release.tag_name) {
    versionPill.textContent = release.tag_name;
    versionPill.hidden = false;
  }

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
    const exe = me.os === "windows"
      ? forMe.find((a) => a.name.toLowerCase().endsWith("-setup.exe"))
      : null;
    primaryBtn.href = best.browser_download_url;
    primaryLabel.textContent = me.os === "windows" ? "Download MSI for Windows" : `Download for ${me.label}`;
    osNote.textContent = `Detected ${me.label}. ${best.info.kind}${best.size ? " · " + fmtSize(best.size) : ""}.`;
    if (best.name.toLowerCase().endsWith(".zip")) {
      osNote.textContent += " Unzip it and double-click install-yearwheel.command.";
    }
    if (exe && secondaryDownload) {
      secondaryDownload.innerHTML = `Need the EXE instead? <a href="${exe.browser_download_url}">Download EXE</a>.`;
      secondaryDownload.hidden = false;
    }
  } else {
    primaryBtn.href = release.html_url || RELEASES_LATEST;
    primaryLabel.textContent = "Choose a download";
    osNote.textContent = `No automatic match for ${me.label} — pick a build below.`;
  }

  // Full list, grouped by OS. Say which version each build is when they differ.
  const mixedVersions = new Set(assets.map((a) => a.tag)).size > 1;
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
      <span class="dl-meta">${mixedVersions ? a.tag + " · " : ""}${fmtSize(a.size)}</span>`;
    li.appendChild(link);
    list.appendChild(li);
  }
}

init();
