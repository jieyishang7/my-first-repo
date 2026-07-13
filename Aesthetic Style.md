# Aesthetic Style Guide

## Style Direction

This website uses a **Synthwave / cyberpunk city** aesthetic. The visual direction is inspired by retrofuturistic cityscapes, neon horizons, arcade interfaces, electronic music visuals, and the Synthwave references collected on the Aesthetics Wiki:

https://aesthetics.fandom.com/wiki/Synthwave

The page is designed as a project archive floating inside a digital night city. Instead of using a plain academic layout, the site combines readable project information with a cinematic neon environment, glowing typography, a cyberpunk skyline, and a perspective grid.

## Design Concept

The main concept is to present **computational design as a journey through a synthetic digital cityscape**. The website acts like a translucent interface panel placed over a larger virtual landscape. The central panel holds the project content, while the surrounding background creates depth, atmosphere, and movement.

The design connects to computational design through:

- perspective grids that suggest coordinate systems, digital space, and spatial logic
- layered background and foreground elements that create depth
- glowing interface details that reference futuristic control panels
- structured typography that keeps the project archive readable
- a cyberpunk skyline that turns the page into an immersive scene rather than a flat document

The goal is to balance **clarity** and **atmosphere**. The page should still function as a readable project archive, but it should also feel visually memorable and connected to speculative digital environments.

## Visual Elements

### Background

The background uses a dark blue, violet, magenta, and cyan gradient to create a Synthwave night-sky atmosphere. A subtle scanline texture sits on top of the gradient, giving the page a screen-like quality.

The current version uses `assets/cyberpunk-city-foreground.png` as the foreground city and grid layer. This image sits between the gradient background and the central interface panel, allowing the skyline and grid to be adjusted independently from the rest of the page.

### Central Panel

The main content is placed inside a dark translucent panel. The panel has a bright magenta border and glow, making it feel like a floating screen or interface window inside the larger neon environment.

The panel background is intentionally dark and semi-transparent. This preserves readability while still allowing some of the surrounding color atmosphere to influence the page.

### Retrosun

A striped Synthwave-style sun appears inside the panel as a decorative background element. It uses yellow, orange, and magenta tones, with reduced opacity toward the bottom so it sits behind the title without overpowering the text.

### Skyline and Grid

The cyberpunk skyline reinforces the futuristic city setting. The perspective grid suggests depth, motion, and computational structure. Together, the skyline and grid make the archive feel like it exists inside a constructed digital world.

## Current Image Assets

| Asset | Role | Notes |
| --- | --- | --- |
| `assets/cyberpunk-city-foreground.png` | Active foreground image | The image currently used by the website for the city skyline and grid layer. |
| `assets/cyberpunk-city-foreground-preview.png` | Preview/reference image | A checkerboard preview used to inspect the transparent foreground asset. |
| `assets/cyberpunk-city-foreground-before-side-copy.png` | Backup image | A previous version kept as a fallback while testing skyline duplication. |
| `assets/synthwave-city-background.png` | Alternate background test | A full background image kept for reference, but not used by the current CSS. |

## Color Palette

| Color Name | Hex Code | Usage | Rationale |
| --- | --- | --- | --- |
| Midnight Black | `#050510` | Main dark base, panel depth | Creates strong contrast and allows neon colors to glow. |
| Deep Space Blue | `#0B1026` | Background depth and shadow | Supports the night-city atmosphere. |
| Neon Magenta | `#FF2BD6` | Panel border, glow, accents | Gives the site its strongest Synthwave identity. |
| Electric Cyan | `#00E5FF` | Links, grid highlights, secondary glow | Adds a digital, futuristic contrast to the magenta. |
| Laser Violet | `#7A35FF` | Button gradient and atmospheric glow | Bridges the blue and magenta palette with arcade energy. |
| Sunset Orange | `#FF8A00` | Year label and sun accents | Adds warmth and references the retro sunset motif. |
| Soft Neon White | `#F6F7FF` | Main title and readable text | Keeps content bright and legible while maintaining a luminous style. |
| Dim Lavender Gray | `#A7A4C8` | Subtitle and paragraph text | Creates softer hierarchy for supporting information. |

## Typography

| Typeface | Usage | Rationale |
| --- | --- | --- |
| Audiowide | Main project title and header identity | Creates a retrofuturistic, arcade-like visual presence. |
| Orbitron | Navigation, metadata, buttons, section labels | Adds a geometric sci-fi tone that fits the computational theme. |
| Roboto | Paragraphs and supporting copy | Keeps longer text readable and balances the decorative display fonts. |

The typography system uses display fonts for identity and atmosphere, while relying on Roboto for readability. This keeps the page expressive without making the content difficult to scan.

## Layout and Composition

The layout is centered around a single dark content panel. This panel acts as the main reading surface, while the surrounding city and grid provide visual context.

Key layout decisions:

- The header stays clean and symmetrical.
- The main panel is centered and framed by a glowing magenta border.
- The title is large and luminous, becoming the visual anchor of the page.
- The interactive demo area remains simple and readable.
- Background layers stay behind the content so they support the page without interrupting usability.

## UI Details

Interface treatments include:

- magenta glow around the main panel
- cyan text for links and section labels
- violet-to-magenta button gradient
- subtle scanline texture across the page
- glowing hover state on the button
- translucent message display area

These effects create a screen-like interface while keeping the page functional.

## AI-Assisted Process

This website was developed through an iterative collaboration with AI. The process involved testing different visual directions, adjusting CSS step by step, and refining the relationship between the background, central content panel, sun, skyline, and grid.

AI assisted with:

- translating the Synthwave reference into practical CSS design choices
- selecting and documenting a neon color palette
- refining the typography hierarchy
- generating and editing the transparent PNG used for the city and grid layer
- testing different ways to place the skyline, grid, sun, and panel together
- adjusting opacity, borders, glow, and layering based on visual feedback
- documenting the final design logic in this style guide

The collaboration was useful because it made the design process iterative. Instead of applying one finished style all at once, each visual element was tested, revised, removed, or restored based on how it affected the overall website.

## Source Reference

- Aesthetics Wiki, "Synthwave": https://aesthetics.fandom.com/wiki/Synthwave
