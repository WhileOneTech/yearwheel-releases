# Changelog

All notable changes to YearWheel are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!--
How to cut a release:

1. Move everything under [Unreleased] into a new `## [x.y.z] - YYYY-MM-DD` section.
2. Copy the same notes into `releases/notes/vx.y.z.md` (used as the GitHub Release body).
3. Tag the commit `vx.y.z` and push — the Release workflow publishes the build + updater manifest.
4. Add a fresh, empty [Unreleased] section and update the link references at the bottom.

Each release groups changes under: Added, Changed, Deprecated, Removed, Fixed, Security.
-->

## [Unreleased]

### Added

### Changed

### Fixed

## [2026.10.11] - 2026-10-11

First macOS release (Apple Silicon and Intel). macOS only; Windows and Linux stay on 2026.6.4.
Automatic updates not yet enabled.

### Added

- macOS build: a universal app shipped as a zip with an install script and a Swedish/English
  installation guide, plus a `.dmg`.
- Rolling time window: centre the wheel on any date and show 6, 12, 18 or 24 months, with
  New Year marked and named on each side; step through time with a slider or the scroll wheel.
- Remove duplicates: the item table offers to remove repeated items, with confirmation and undo.

### Changed

- Year Line redrawn as the wheel laid flat: thin lanes per ring, items in their own colours,
  today and New Year across every lane.
- The view switcher, time window and status filters stay visible while scrolling.
- The whole interface is translated to Swedish and English, including labels on the wheel.
- Better dark-mode contrast, keyboard focus and screen-reader labels.

### Fixed

- Numerous smaller fixes to buttons and panels from a review of the whole interface.
- The sample plan no longer shows behind dialogs on the Home screen.

## [2026.6.4] - 2026-06-04

First public release. Windows only; automatic updates not yet enabled.

### Added

- Initial public release of YearWheel — plan and visualise the year on a circular calendar.
- Colour-coded rings and categories for organising events.
- Windows installers: NSIS (`…_x64-setup.exe`) and MSI (`…_x64_en-US.msi`).

[Unreleased]: https://github.com/WhileOneTech/yearwheel-releases/compare/v2026.10.11...HEAD
[2026.10.11]: https://github.com/WhileOneTech/yearwheel-releases/releases/tag/v2026.10.11
[2026.6.4]: https://github.com/WhileOneTech/yearwheel-releases/releases/tag/v2026.6.4
