# 🌊 The Ocean Dive: Tanie's Interactive Portfolio

> Live at [tanie.me](https://tanie.me)

An immersive, interactive web experience built to take visitors on a physical and visual dive into the deep ocean. As you scroll, you descend from the sunny, reflective surface waters into the dark, silent abyssal depths, mirroring the process of diving deep into code, design, and projects.

---

## 🎨 The Creative Process & Concept

Most portfolio websites are flat, linear lists. The concept behind this site was to build a space with physical presence—an environment that feels alive, reactive, and atmospheric. 

### 1. The Submarine Scroll Experience
The core mechanic is the **depth-based scroll**. Instead of traditional paging, scrolling acts as a depth controller (from `0.0` at the surface to `1.0` in the deep ocean). 
* As you descend, the camera angle sinks under the water plane.
* The ambient light shifts, and the water color changes from a bright, sunny cyan to a dark, deep navy.
* Volunteers of light (caustics) and floating particles emerge to simulate physical underwater volume.

### 2. Crafting the Water Shader
To make the ocean surface look dynamic yet performant, I built custom vertex and fragment shaders in Three.js:
* **Normal Mapping**: Multiple 2D normal maps are blended and animated at different speeds to create the illusion of organic, crawling ripples.
* **Light Attenuation**: The shader dynamically computes the camera's Z/Y position relative to the water surface, creating a smooth fading transition as you submerge.
* **Refraction & Edge Noise**: Added wave highlights and edge noise formulas to make the boundary between air and water look organic and fluid.

### 3. Volumetric Depth Stages
The site layout is divided into three distinct depth zones:
* **The Sunlight Zone (Surface to Mid)**: Bright, clean, featuring the main introduction and interactive projects.
* **The Twilight Zone (Mid to Deep)**: Medium-depth blue waters, home to client experiences and testimonials.
* **The Abyssal Zone (Deep)**: Midnight blue, dark sky accents, housing the QnA bot and contact form.

### 4. Interactive QnA Assistant
To make the site dialogue-driven, I integrated an interactive chat bot powered by a secure server-side Gemini API proxy, designed as a submarine control panel to help users ask questions about my background, skills, or projects.

### 5. Performance Tuning (60 FPS Goal)
Creating realistic water and particles on web browsers can easily lag mobile GPUs. I addressed this by:
* Detecting mobile viewports to scale down the plane geometry grid resolution.
* Capping the maximum active particle count on mobile.
* Reusing Three.js materials and geometries to prevent memory leaks during page navigation.

---

## 🛠️ Tech Stack
* **Core**: React, TypeScript, Vite
* **3D Rendering**: Three.js (WebGL)
* **Smooth Scrolling**: Lenis
* **Animations**: Framer Motion
* **Styling**: Tailwind CSS & Vanilla CSS

---

## 🎨 Colors & Palette
The interface color system transitions dynamically down the HSL spectrum:
* **Surface Sky**: `#b8dcff` (sunny highlights) / `#020617` (deep contrast text)
* **Twilight Blue**: `#5f7e96` (transitional blue)
* **Abyssal Dark**: `#020617` (abyssal black) / `#0d2334` (ocean depth shadow)

---

## 📦 Open Source Assets & Libraries
This project is built using these incredible open-source assets and libraries:
* **Three.js** (WebGL 3D engine)
* **Lenis** (High-performance smooth scroll library)
* **Framer Motion** (Micro-animations and interface transitions)
* **Google Fonts**:
  * *Bodoni Moda* (Elegant serif for display headings)
  * *Manrope* (Clean geometric sans-serif for body content)
  * *Inter* (Sleek sans-serif for interface UI)
