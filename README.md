# Cyberfiction scroll study (2023)

A project I built in September 2023 while learning GSAP and scroll-driven animation. It recreates the Cyberfiction website's character scroll: as you scroll, 300 pre-rendered frames of a 3D character play on a full-screen canvas, so the character appears to turn.

> **Archived.** This is where I started with scroll animation. The idea grew into [Turntable Studio](https://github.com/KunalwritesCode/turntable-studio), which generates original 3D characters and frames instead of reusing them.

## Credits

The design, the copy and the 3D character frames (`0001.png` to `0300.png`) come from the Cyberfiction website. They are not my work and are not licensed for reuse. The HTML, CSS and JavaScript were written as a learning exercise.

## How it works

- **Smooth scrolling:** Locomotive Scroll handles scrolling, and `ScrollTrigger.scrollerProxy` keeps GSAP in sync with it.
- **Frame scrubbing:** a GSAP tween maps scroll progress to a frame number (0–299). Each update draws that frame on the canvas, scaled to cover the viewport.
- **Pinning:** ScrollTrigger pins the canvas while the frames play, then pins each text section for one screen.

## Run it locally

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. GSAP, Locomotive Scroll and the Urbanist font load from CDNs.

## Fixes made in November 2026

- The frame animation's ScrollTrigger pointed at `#section1>canvas`, which doesn't exist (`section1` is a class). It only worked by accident; it now targets `.section1>canvas`.
- The 300 hard-coded file names are now generated, which also fixes an off-by-one: frame 0 used to load the page itself, and `0300.png` never loaded.
- `0292.png` is missing from the frame set. The canvas now keeps the previous frame on screen instead of trying to draw a broken image.
- Smaller fixes: page title, loading the Urbanist font, a CSS typo (`font: size`), an unclosed `<p>` and a few copy typos.

## What I'd do differently now

- **Weight:** 300 PNGs (63 MB) load at once with no loading state. WebP at 1280 px would cut each frame from about 212 KB to about 32 KB.
- **Assets:** use original frames instead of another studio's. That's what Turntable Studio does.
- **Dependencies:** Locomotive Scroll v3 with a scroller proxy is an old pattern; native scrolling with ScrollTrigger is simpler.
