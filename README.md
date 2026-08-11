<div align="center">

# ⚡ SHAPEMASTER
### **Professional After Effects ExtendScript Suite**

[![Version](https://img.shields.io/badge/Version-2.2-00E5FF?style=for-the-badge&logo=adobeaftereffects)](https://github.com/FramEmpire/FE-Scripts-AfterEffects)
[![AE Version](https://img.shields.io/badge/After_Effects-CC_2015_--_2026+-FF007F?style=for-the-badge&logo=adobe)](https://www.framempire.com)
[![Brand](https://img.shields.io/badge/Powered_by-FramEmpire-7C4DFF?style=for-the-badge&logo=vercel)](https://www.framempire.com)

<br/>

> **ShapeMaster.jsx** is a single-file, release-ready dockable ExtendScript UI Panel for Adobe After Effects designed to automate vector stroke scaling, motion graphics keyframing, path morphing, responsive background boxes, and 9-point anchor alignment.

<br/>

---

### 📦 Quick Download Options

| Package | Direct Link | Contents |
| :--- | :--- | :--- |
| **Complete ZIP Suite** | 📥 **[Download ShapeMaster.zip](https://github.com/FramEmpire/FE-Scripts-AfterEffects/raw/main/ShapeMaster.zip)** | `ShapeMaster.jsx` + `README.txt` (User Manual) |
| **Raw JSX File** | 📄 **[View ShapeMaster.jsx Source](https://github.com/FramEmpire/FE-Scripts-AfterEffects/blob/main/ShapeMaster.jsx)** | Single-File ExtendScript Panel |

---

</div>

<br/>

## 💎 Features & Modules

<div align="center">
  <table>
    <tr>
      <td width="33%" align="center">
        <h3>⚡ STROKES & FIXES</h3>
        <p><b>Freeze Stroke Width</b><br/>Inverse scale engine for constant thickness</p>
        <p><b>Unfreeze Stroke</b><br/>Restores native scale behavior</p>
        <p><b>Fix Non-Uniform Scale</b><br/>Asymmetric X/Y distortion fix</p>
      </td>
      <td width="33%" align="center">
        <h3>🎬 MOTION & PATHS</h3>
        <p><b>1-Click Multi-Trim Paths</b><br/>Auto-animator with Easy Ease</p>
        <p><b>1-Click Wipe Trim Paths</b><br/>4-Keyframe delayed line wipe</p>
        <p><b>Equalize Path Points</b><br/>Vertex morphing preparation</p>
      </td>
      <td width="33%" align="center">
        <h3>🎯 AUTO LAYOUT</h3>
        <p><b>Smart Auto-Background Box</b><br/>Real-time responsive text boxes</p>
        <p><b>9-Point Anchor Matrix</b><br/>Instant visual anchor snapping</p>
        <p><b>Stagger Offset Engine</b><br/>Customizable frame delays</p>
      </td>
    </tr>
  </table>
</div>

<br/>

> [!TIP]
> ### 🎨 Glass Card System & Module Breakdown

---

### ⚡ Module 1: Strokes & Fixes

> [!NOTE]
> **Vector Stroke Locking Engine**
> Automatically crawls nested shape groups (`ADBE Vector Stroke Width`, `ADBE Vector Grad Stroke Width`) to inject scale-compensating expressions.

```javascript
// Injected Inverse Scale Expression
var baseWidth = value;
var s = transform.scale;
var scaleFactor = (s[0] + s[1]) / 2 / 100;
scaleFactor != 0 ? baseWidth / scaleFactor : baseWidth;
```

- **`Freeze Stroke Width`**: Locks stroke thickness in exact pixels during layer expansion/contraction.
- **`Unfreeze Stroke`**: Clears expressions and restores native After Effects behavior.
- **`Fix Non-Uniform Scale`**: Geometric mean scale calculation counteracting asymmetric X/Y stretch distortion.

---

### 🎬 Module 2: Motion & Paths

> [!IMPORTANT]
> **Motion Graphics & Keyframe Automation**
> Instantly adds Trim Paths, sets Easy-Eased 0%->100% keyframes, and equalizes path vertices across shapes.

- 🪄 **`1-Click Multi-Trim Paths`**: Auto-animates `End` property (0% -> 100% in 30 frames with `KeyframeEase`) and staggers layer timing.
- 🌊 **`1-Click Wipe Trim Paths`**: Injects a 4-keyframe line wipe (`End`: 0%->100% at 30f, `Start`: 0%->100% delayed by 10f).
- 🧬 **`Equalize Path Points`**: Subdivides vector vertices across selected shapes so vertex counts match for smooth shape morphing.

---

### 🎯 Module 3: Auto Layout & Anchor Matrix

> [!NOTE]
> **Responsive Layout & Alignment Grid**
> Automatically resizes shape backgrounds around text layers and snaps layer anchor points in 9 positions.

- 📐 **`Smart Auto-Background Box`**: Injects `sourceRectAtTime()` expressions onto shape size & position to create responsive text cards.
- 🎯 **`9-Point Anchor Point Matrix`**:
  ```
  +-----------------------------------+
  |  [ ◤ TL ]  |  [ ▲ TC ]  |  [ ◥ TR ] |  (Top)
  |------------+------------+-----------|
  |  [ ◀ ML ]  |  [ ●  C ]  |  [ ▶ MR ] |  (Middle)
  |------------+------------+-----------|
  |  [ ◣ BL ]  |  [ ▼ BC ]  |  [ ◢ BR ] |  (Bottom)
  +-----------------------------------+
  ```

---

## 🚀 Installation & Setup

> [!CAUTION]
> Make sure After Effects is closed or workspace is reloaded after installation.

1. Download **[`ShapeMaster.zip`](https://github.com/FramEmpire/FE-Scripts-AfterEffects/raw/main/ShapeMaster.zip)** and extract `ShapeMaster.jsx`.
2. Copy `ShapeMaster.jsx` into your ScriptUI Panels folder:
   - **macOS**: `/Applications/Adobe After Effects <version>/Scripts/ScriptUI Panels/`
   - **Windows**: `C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\ScriptUI Panels\`
3. Restart After Effects.
4. Launch from top menu: **Window > ShapeMaster.jsx** and dock it anywhere!

---

<div align="center">

### 🌐 Powered by **FramEmpire**
**[www.framempire.com](https://www.framempire.com)**

</div>
