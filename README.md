# ShapeMaster for Adobe After Effects

Official After Effects ExtendScript UI Panel powered by **FramEmpire** ([www.framempire.com](https://www.framempire.com)).

---

## 📥 Download ShapeMaster.jsx

- **[View & Download ShapeMaster.jsx on GitHub](https://github.com/FramEmpire/FE-Scripts-AfterEffects/blob/main/ShapeMaster.jsx)**  
  *(Click `ShapeMaster.jsx` in the repository list above, then click the **Download raw file** button at the top right of the file view).*

---

## 🛠 Features & Modules (`ShapeMaster.jsx`)

`ShapeMaster.jsx` is a single-file, release-ready After Effects ExtendScript UI Panel built with native dark theme aesthetics (`#232323`) and tabbed navigation:

### ⚡ Tab 1: `Strokes & Fixes`
- **Freeze Stroke Width**: Inversely scales stroke width relative to layer scale so stroke thickness remains constant.
- **Unfreeze Stroke**: Removes scaling expressions from stroke properties.
- **Fix Non-Uniform Scale**: Compensates for asymmetric X/Y scale distortion across layer parent hierarchies.

### 🎬 Tab 2: `Motion & Paths`
- **1-Click Multi-Trim Paths**: Automatically adds Trim Paths, animates `End` property (0% -> 100% in 30 frames with Easy Ease), and staggers timing across layers.
- **1-Click Wipe Trim Paths**: Injects 4-keyframe Wipe animation (`End` 0%->100%, `Start` 0%->100% delayed by 10 frames + Easy Ease).
- **Stagger Trim Paths**: Offsets Trim Paths keyframes across selected shape layers by a user-specified frame delay.
- **Equalize Path Points (Morph Prep)**: Subdivides path vertices across shape layers so vertex counts match for smooth morphing animations.

### 🎯 Tab 3: `Auto Layout`
- **Smart Auto-Background Box**: Creates a responsive shape background box that dynamically resizes around a text layer using `sourceRectAtTime()`.
- **9-Point Anchor Point Matrix**: Snaps layer anchor point to 9 positions (`TL`, `TC`, `TR`, `ML`, `Center`, `MR`, `BL`, `BC`, `BR`) without canvas position jump.

---

## 🚀 Installation Guide

1. Download **[`ShapeMaster.jsx`](https://github.com/FramEmpire/FE-Scripts-AfterEffects/blob/main/ShapeMaster.jsx)**.
2. Copy `ShapeMaster.jsx` into your After Effects **ScriptUI Panels** directory:
   - **macOS**: `/Applications/Adobe After Effects <version>/Scripts/ScriptUI Panels/`
   - **Windows**: `C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\ScriptUI Panels\`
3. Restart Adobe After Effects.
4. Open the panel from **Window > ShapeMaster.jsx** and dock it anywhere in your workspace.

---

## 🌐 Brand & Support
Powered by **FramEmpire** | [www.framempire.com](https://www.framempire.com)
