# Releasing YearWheel

This repo publishes YearWheel builds, the auto-update manifest, and the download site.
Builds themselves are produced by Tauri in the private source repo (`WhileOneTech/yearwheel2`);
this repo turns those artifacts into a public, auto-updating release.

## One-time setup

### 1. Enable GitHub Pages
**Settings → Pages → Build and deployment → Source: _Deploy from a branch_ → Branch: `main` / `/docs`.**
The site deploys at `https://whileonetech.github.io/yearwheel-releases/` and rebuilds automatically
on every push to `docs/`. A `.nojekyll` file keeps the assets served as-is. The page reads the
latest release live via the GitHub API, so cutting a release needs **no** Pages redeploy.

### 2. Add the cross-repo token
The release workflow downloads the freshly built artifacts from the private source repo.
Create a token with **`contents: read`** on `WhileOneTech/yearwheel2` (a fine-grained PAT or a
GitHub App token) and add it here as the secret **`SOURCE_REPO_TOKEN`**
(*Settings → Secrets and variables → Actions*).

> If you'd rather attach the built artifacts to this repo's release directly (instead of pulling
> them cross-repo), you can drop the "Download build artifacts" step in
> [`.github/workflows/release.yml`](.github/workflows/release.yml) and skip this secret.

### 3. Configure the Tauri updater (in the source repo)
In `tauri.conf.json` of `yearwheel2`, point the updater at this repo's release feed and embed the
public half of your updater signing key:

```jsonc
{
  "plugins": {
    "updater": {
      "active": true,
      "pubkey": "<YOUR TAURI UPDATER PUBLIC KEY>",
      "endpoints": [
        "https://github.com/WhileOneTech/yearwheel-releases/releases/latest/download/latest.json"
      ]
    }
  }
}
```

Sign builds with the matching **private** key during `tauri build` (env vars
`TAURI_SIGNING_PRIVATE_KEY` and `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`). This produces the `.sig`
files this repo reads to build `latest.json`. Generate a keypair with
`npx @tauri-apps/cli signer generate`. **Keep the private key secret; losing it means clients can
no longer auto-update.**

The artifacts the updater needs, per platform:

| Platform | Updater bundle | Signature | `latest.json` key |
| --- | --- | --- | --- |
| Windows | `…_x64-setup.exe` (or `.msi`) | `…-setup.exe.sig` | `windows-x86_64` |
| macOS (arm) | `…aarch64.app.tar.gz` | `….app.tar.gz.sig` | `darwin-aarch64` |
| macOS (intel) | `…x64.app.tar.gz` | `….app.tar.gz.sig` | `darwin-x86_64` |
| Linux | `…amd64.AppImage` | `….AppImage.sig` | `linux-x86_64` |

## Cutting a release

1. **Write the notes.** Copy [`releases/notes/TEMPLATE.md`](releases/notes/TEMPLATE.md) to
   `releases/notes/vX.Y.Z.md` and fill it in. Move the same content from `[Unreleased]` into a
   dated section in [`CHANGELOG.md`](CHANGELOG.md). Commit to `main`.
2. **Build in the source repo.** Run the Tauri build there for the same version so its release
   `vX.Y.Z` holds the signed artifacts (the standard `tauri-apps/tauri-action` flow works well).
3. **Tag here.** From this repo:
   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
   The [Release workflow](.github/workflows/release.yml) then:
   - downloads the signed artifacts from the source repo,
   - generates `latest.json` ([`scripts/generate-latest-json.mjs`](scripts/generate-latest-json.mjs)),
   - publishes the GitHub Release with all assets + your notes.

   The download site picks up the new release automatically (it queries the API at load), so there's
   nothing else to deploy. Prefer not to tag from your machine? Run the workflow manually from the
   **Actions** tab and pass the tag as input.

### Alternative: publish directly with `gh` (no cross-repo token)

For a one-off — or when you already have the built installers locally — skip the workflow entirely:

```bash
gh release create vX.Y.Z \
  --repo WhileOneTech/yearwheel-releases \
  --title "YearWheel vX.Y.Z" \
  --notes-file releases/notes/vX.Y.Z.md \
  path/to/installer.exe path/to/installer.msi
```

If the build is signed, also generate and attach `latest.json`
(`node scripts/generate-latest-json.mjs --dir <folder> --tag vX.Y.Z`). This is how `v2026.6.4`
(Windows, installers-only) was published.

## Verifying a release

- `latest.json` is attached to the release and resolves at
  `https://github.com/WhileOneTech/yearwheel-releases/releases/latest/download/latest.json`.
- The [download page](https://whileonetech.github.io/yearwheel-releases/) shows the new version
  and serves the right installer per OS.
- An older installed build auto-updates to the new version on restart.

### Generating `latest.json` locally
Handy for debugging — point it at a folder of artifacts + `.sig` files:

```bash
node scripts/generate-latest-json.mjs --dir ./dist --tag v1.2.3 --out ./dist/latest.json
```

See [`examples/latest.json`](examples/latest.json) for the expected output shape.
