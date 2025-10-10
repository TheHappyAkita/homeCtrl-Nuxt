# AKITA CTRL Nuxt App

This Nuxt 4 app is a migration of the original React UI (homeCtrl-UI) and backend utilities. The UI, images, PWA, and server endpoints have been migrated.

## What was migrated
- UI views and components (Vue SFCs under app/components)
- Static assets: fonts, icons, and header images are under public/
- PWA: configured via @vite-pwa/nuxt with a manifest matching the original app
- Server API: endpoints under server/api mirror the original Nest backend (dns, nas, dev, shutdown, services, etc.)

## Setup

Install dependencies:

```bash
npm install
```

## Development Server

Start the dev server on http://localhost:3000:

```bash
npm run dev
```

PWA service worker is enabled in dev via vite-pwa devOptions; you will see it register in the devtools Application tab.

## Production

Build the application for production and preview it locally:

```bash
npm run build
npm run preview
```

On first load in production build, the service worker will install and precache assets; updates are applied automatically (registerType: 'autoUpdate').

## Styles
- Core layout and component styles are inlined within the Vue SFCs (app/app.vue and components under app/components).
- Public assets are available under public/ (e.g., fonts, icons, header images). The header uses /header_2/header.png.

## Notes
- If you change icons or manifest, update either public/manifest.json or the pwa.manifest in nuxt.config.ts (current config uses the inline manifest).
- The server API endpoints are implemented under server/api and call shell utilities similar to the original backend.

## Backend resources (shell scripts)
The original backend used shell scripts located under a home directory path. This Nuxt server keeps the same contract:
- Default workDir: $HOME/homeCtrl
- Expected script files in workDir:
  - dnsEntryProvider.sh
  - nasWol.sh, nasPing.sh, nasShutdown.sh, nasShutdownCancel.sh, nasShutdownInfo.sh, nasUpdateState.sh
  - devWol.sh, devPing.sh, devShutdown.sh, devShutdownCancel.sh, devShutdownInfo.sh, devUpdateState.sh, devServices.sh

You can override the workDir using the environment variable NUXT_HOMECTRL_WORKDIR. Example:

NUXT_HOMECTRL_WORKDIR=/opt/homeCtrl npm run dev

or for production, set it in your process manager or hosting env.

A simple health endpoint is available at GET /api to validate the server is up (returns "Hello World!").
