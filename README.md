<div align="center">

<img src="docs/assets/wheel-mark.svg" alt="YearWheel logo" width="120" />

# YearWheel

### Plan and visualise your entire year on a single circular calendar.

[![Latest release](https://img.shields.io/github/v/release/WhileOneTech/yearwheel-releases?label=latest&sort=semver&color=4f46e5)](https://github.com/WhileOneTech/yearwheel-releases/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/WhileOneTech/yearwheel-releases/total?color=16a34a)](https://github.com/WhileOneTech/yearwheel-releases/releases)
[![Release date](https://img.shields.io/github/release-date/WhileOneTech/yearwheel-releases?color=0ea5e9)](https://github.com/WhileOneTech/yearwheel-releases/releases/latest)
![Platforms](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-555)

**[⬇️ Download](https://whileonetech.github.io/yearwheel-releases/) · [📋 Changelog](CHANGELOG.md) · [🐞 Report an issue](https://github.com/WhileOneTech/yearwheel-releases/issues)**

</div>

---

> [!NOTE]
> This is the **public release repository** for YearWheel. It hosts the downloadable installers,
> the auto-update manifest, release notes, and the download website. The application source
> code lives in a separate, private repository.

## What is YearWheel?

YearWheel lays your whole year out as a **circular calendar** — a "year wheel" — so you can see
seasons, projects, campaigns, holidays, and recurring events at a glance instead of scrolling
through twelve separate months. It's built for annual planning: marketing calendars, school years,
production schedules, personal goals, and anything else that benefits from the big-picture view.

<!-- TODO: drop a real screenshot/GIF here once available -->
<!-- ![YearWheel screenshot](docs/assets/screenshot.png) -->

## Download

The easiest way to get the right build for your machine is the download page, which detects your
operating system automatically:

### 👉 **https://whileonetech.github.io/yearwheel-releases/**

Or grab a specific installer directly from the [latest release](https://github.com/WhileOneTech/yearwheel-releases/releases/latest):

| Platform | File | Notes |
| --- | --- | --- |
| **Windows** | `…_x64-setup.exe` | Recommended installer (NSIS). Also available as `.msi`. |
| **macOS (Apple Silicon)** | `…_aarch64.dmg` | For M1/M2/M3/M4 Macs. |
| **macOS (Intel)** | `…_x64.dmg` | For older Intel Macs. |
| **Linux** | `…_amd64.AppImage` | Portable — `chmod +x` and run. `.deb` also provided. |

> YearWheel targets **Windows** first, but is built and tested on macOS and Linux too.

## Automatic updates

YearWheel updates itself. The app periodically checks the updater manifest published with each
release and, when a newer version is available, downloads and installs it on the next restart —
no manual reinstall needed.

- **Update feed:** [`releases/latest/download/latest.json`](https://github.com/WhileOneTech/yearwheel-releases/releases/latest/download/latest.json)
- Built on the [Tauri v2 updater](https://v2.tauri.app/plugin/updater/); update packages are
  cryptographically signed and verified before they are applied.

## Installation notes

<details>
<summary><strong>Windows</strong></summary>

Run the `…_x64-setup.exe` installer. Because the app may not yet be registered with Microsoft
SmartScreen, Windows might show a *"Windows protected your PC"* prompt — click **More info →
Run anyway** to continue. Prefer a system-wide MSI deployment? Use the `.msi` asset.
</details>

<details>
<summary><strong>macOS</strong></summary>

Open the `.dmg` and drag **YearWheel** to your Applications folder. If macOS reports the app
*"cannot be opened because the developer cannot be verified"*, right-click the app → **Open**,
or allow it under **System Settings → Privacy & Security**. Pick the `aarch64` build for Apple
Silicon and the `x64` build for Intel Macs.
</details>

<details>
<summary><strong>Linux</strong></summary>

**AppImage:** make it executable and run it.

```bash
chmod +x YearWheel_*_amd64.AppImage
./YearWheel_*_amd64.AppImage
```

**Debian/Ubuntu:** install the `.deb`.

```bash
sudo apt install ./yearwheel_*_amd64.deb
```
</details>

## Releases & versioning

- Every published version is listed on the [Releases page](https://github.com/WhileOneTech/yearwheel-releases/releases)
  with its installers and notes.
- A consolidated history lives in [`CHANGELOG.md`](CHANGELOG.md).
- YearWheel follows [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`.

## Support

Found a bug or have a feature request? Please [open an issue](https://github.com/WhileOneTech/yearwheel-releases/issues).
Include your OS, the YearWheel version (**Help → About**), and steps to reproduce.

---

<div align="center">
<sub>YearWheel is developed by <a href="https://github.com/WhileOneTech">WhileOneTech</a>. The application source is closed-source; this repository contains release artifacts and the download site only.</sub>
</div>
