# VOLTERRA — Project Summary

**Project:** VOLTERRA
**Type:** Premium Interactive Automotive Web Experience

**Core technologies:** React · TypeScript · Framer Motion · Tailwind CSS · Vite

**Key capabilities**

- Interactive vehicle showcase: studio cards that tilt in perspective and catch the light under the pointer
- Vehicle configurator: model, paint (live recolouring), wheels and interior, an estimated price, saved selections and a request form
- Cinematic scroll experience: masked image reveals, parallax and line-by-line headline animation
- Automotive model showcase: `/models` and a page per model, all from one data source
- Responsive design from 390px to 1440px, with mobile step controls
- Performance-focused rendering: code-split routes, responsive WebP images and reduced-motion support

**Routes:** `/` · `/models` · `/models/volterra-{x,gt,s}` · `/configure` · 404 fallback

**Live demo:** https://volterra-showroom.netlify.app

**Deploy:** static Vite build (`npm run build` → `dist/`). The SPA fallback for Netlify is in `public/_redirects`.
