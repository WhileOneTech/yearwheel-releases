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
> release notes, and the download website. The application source
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

Or grab a specific installer from the [Releases page](https://github.com/WhileOneTech/yearwheel-releases/releases).
Platforms don't always ship together, so the newest build for your system may be in a release
other than the one marked *Latest* — the download page always picks the newest one for you.

| Platform | File | Notes |
| --- | --- | --- |
| **Windows** | `…_x64_en-US.msi` | Recommended installer. Also available as `…_x64-setup.exe`. |
| **macOS** (Apple Silicon & Intel) | `…-macOS-universal.zip` | Recommended: the app, an install script and an installation guide. A `.dmg` is also provided. |
| **Linux** | `…_amd64.AppImage` | Portable — `chmod +x` and run. `.deb` and `.rpm` also provided. |

> YearWheel targets **Windows** first, but is built and tested on macOS and Linux too.

## Updating

YearWheel doesn't update itself yet. To get a new version, download it from the
[download page](https://whileonetech.github.io/yearwheel-releases/) and install it over the one
you have, the same way you installed it the first time. Your plans are ordinary `.yearwheel`
files on your computer, so they stay exactly where they are.

## Installation notes

<details>
<summary><strong>Windows</strong></summary>

Run the `…_x64-setup.exe` installer. Because the app may not yet be registered with Microsoft
SmartScreen, Windows might show a *"Windows protected your PC"* prompt — click **More info →
Run anyway** to continue. Prefer a system-wide MSI deployment? Use the `.msi` asset.
</details>

<details>
<summary><strong>macOS</strong></summary>

YearWheel isn't notarised by Apple yet, so macOS blocks a downloaded copy or calls it
*"damaged"*. The `…-macOS-universal.zip` download takes care of this; it runs on both Apple
Silicon and Intel Macs.

1. Double-click the zip in Downloads to unpack it.
2. Open **Terminal**, type `bash ` (with a space after it) and drag `install-yearwheel.command`
   from the unpacked folder into the window, then press Return.
3. The script copies YearWheel to Applications, clears the download block, and opens the app.

The zip also contains an installation guide (PDF, Swedish and English) with the same steps and
an alternative for when you'd rather double-click the script. To update, do the same with the
new version.
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
