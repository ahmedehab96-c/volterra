# VOLTERRA

Premium interactive automotive experience built with React, TypeScript and Framer Motion.

> VOLTERRA is an interactive automotive web experience combining React, cinematic motion design, studio vehicle photography and a vehicle configurator into a premium digital showroom.

## Overview

VOLTERRA is a concept launch site for a fictional luxury performance-car marque. Studio-lit vehicles anchor every page, cinematic image reveals carry the story, and a full configurator lets visitors choose a model, paint, wheels and interior, see an estimated price, and send a request. Everything runs in the browser on local mock data; there is no backend.

## Features

- **Bilingual, Arabic first**: Arabic (RTL) is the default, with an AR/EN toggle saved per browser. All copy, car data and forms are translated, with IBM Plex Sans Arabic for Arabic text.
- **Interactive 3D cars**: when a `.glb` exists (`public/models/{slug}.glb`, `public/models/car.glb` or the API's `model_3d`), cards, model pages and the configurator show a 360° drag/touch viewer with idle auto-rotation. Otherwise they show the studio photo.

- **Studio showcase**: each model is presented on a spotlight that fades into the dark page, with crossfades between models.
- **Vehicle configurator** (`/configure`): four steps (exterior, wheels, interior, summary), live model preview, estimated price, selections saved across visits, and a validated request form.
- **Cinematic scroll animations**: masked image reveals, parallax and line-by-line text reveals.
- **Automotive model showcase**: `/models` and a detail page per model (`/models/volterra-x`, `-gt`, `-s`).
- **Responsive design** from 390px phones to 1440px desktops, including mobile step controls in the configurator.
- **Performance visualization**: count-up figures with horizontal bars, animated once on entry.
- **Interactive hotspots** on the exterior and the cockpit.
- **Mobile optimization**: 960px image variants, and touch-friendly controls.

## Tech Stack

- React
- TypeScript
- Vite
- Framer Motion
- Tailwind CSS
- Lucide React

## Architecture

```
src/
  pages/              Route pages: Home, ModelsPage, ModelDetail, ConfigurePage, NotFound
  sections/           Page sections reused across routes (Hero, Performance, Design, Interior, Configurator, RequestForm, …)
  components/layout/  Navbar, Footer, Logo/Wordmark
  components/ui/      Reusable UI: Button, CarStage, CinematicBand, ParallaxImage, SmartImage, Reveal, StaggerText, Counter, Preloader, …
  data/               cars.ts: the range (bilingual names, copy, specs, images, 3D path, colours); content.ts: site copy and options; images.ts: image size manifest
  i18n/               Tiny local translator (Arabic dictionary keyed by English), RTL/LTR switching
  state/              Small external stores: car configuration (persisted) and intro state
  hooks/ utils/       useMediaQuery; analytics integration point
  router.ts           Minimal History API router (no dependency)
public/
  assets/images/      hero/ exterior/ interior/ details/ models/ social/ (WebP, with 960px variants)
```

- **One data source.** Each model's performance record in `data/content.ts` drives the models page, model details, configurator and performance bars, through the `modelStats` and `modelSpecs` helpers.
- **One showcase component.** `StudioShot` presents every model photo (hero, model pages, configurators). The configuration store keeps every view in sync with the selected model and options.
- **Routing.** Plain `<a href>` links are intercepted for client-side navigation. Secondary routes are code-split with `React.lazy`.

## Performance

- **Lazy loading:** routes are code-split and images load lazily.
- **Optimized images:** WebP with 960px variants through `srcset`, intrinsic width and height to avoid layout shift, and a fade-in once loaded.
- **Reduced motion support:** parallax, magnetic buttons and CSS loops are disabled, and transitions are simplified.
- **Code splitting:** each secondary route ships as a separate chunk.

## Development

```bash
npm install
npm run dev
```

## API (optional)

The site runs on local mock data by default. To connect the [Laravel API](../volterra-api), copy `.env.example` to `.env.local` and set `VITE_API_URL` (for example `http://127.0.0.1:8000/api`).

- **Data:** `src/api/` reads the range (`GET /models`, `/models/{slug}`), saves builds (`POST /configurations`) and sends requests (`POST /inquiries`).
- **Fallback:** local data renders first and API data replaces it when it arrives. If the API is unreachable, pages fall back to the local range and the form shows a friendly retry message.

### Server pricing and 3D

With the API connected, the server catalog (`GET /options`, `GET /models`) supplies option prices and availability, so inactive options are greyed out. The estimate comes from `POST /configurations/calculate`, and the local values are used only until it responds or when the API is offline.

A model with a `model_3d` (`.glb`/`.gltf`) shows an interactive 3D viewer on its page and in the configurator. `@google/model-viewer` is lazy-loaded only in that case. Without a 3D file, or if loading fails, the studio photo is shown.

## Admin

`/admin` is a separate, lazy-loaded admin app. It uses none of the public site's chrome and is marked `noindex`. Staff with the `admin` or `editor` role sign in at `/admin/login` (Sanctum bearer token) to manage:

- **Models:** create, edit, activate or deactivate, soft-delete, and manage the image gallery (upload, reorder, delete) and 3D path
- **Configuration options:** paints, wheels and interiors, with prices and status
- **Inquiries:** search, filter by status and model, view full details, update status, add internal notes

The dashboard shows totals at a glance. The admin needs `VITE_API_URL`.

## Production

```bash
npm run build
```

The output goes to `dist/`. `public/_redirects` provides the SPA fallback on Netlify. On other hosts, rewrite all routes to `/index.html`.

## Demo

**Live:** https://volterra-showroom.netlify.app (static demo on local data)

**Backend:** [ahmedehab96-c/volterra-api](https://github.com/ahmedehab96-c/volterra-api) (Laravel 13, MySQL, Sanctum)

## Screenshots

| Arabic (RTL) | English (LTR) |
| ------------ | ------------- |
| ![Hero, Arabic](docs/screenshots/01-hero-ar.jpg) | ![Hero, English](docs/screenshots/02-hero-en.jpg) |
| ![Configurator, Arabic](docs/screenshots/06-configurator-ar.jpg) | ![Configurator, English](docs/screenshots/07-configurator-en.jpg) |
| **Models** | **Model details** |
| ![Models](docs/screenshots/04-models-ar.jpg) | ![Model details](docs/screenshots/05-model-detail-ar.jpg) |
| **Performance** | **Mobile** |
| ![Performance](docs/screenshots/03-performance-ar.jpg) | ![Mobile](docs/screenshots/08-mobile-ar.jpg) |
| **Admin dashboard** | **Admin inquiry details** |
| ![Admin dashboard](docs/screenshots/09-admin-dashboard.jpg) | ![Admin inquiry](docs/screenshots/10-admin-inquiry.jpg) |

## Credits

Photography from [Unsplash](https://unsplash.com). Vehicles of real manufacturers appear in the photos; VOLTERRA itself is fictional.
