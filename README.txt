================================================================================
  SHAPEMASTER v2.2 - AFTER EFFECTS EXTENDSCRIPT SUITE
  Powered by FramEmpire | www.framempire.com
================================================================================

Thank you for downloading ShapeMaster! 
ShapeMaster is a professional, dockable ExtendScript UI Panel for Adobe After Effects
designed to streamline shape layer management, vector stroke scaling, motion graphics 
keyframing, and responsive layout workflows.

--------------------------------------------------------------------------------
1. QUICK INSTALLATION GUIDE
--------------------------------------------------------------------------------

To install ShapeMaster in Adobe After Effects:

1. Extract 'ShapeMaster.jsx' from this ZIP folder.
2. Copy 'ShapeMaster.jsx' into your After Effects ScriptUI Panels directory:

   * macOS:
     /Applications/Adobe After Effects <version>/Scripts/ScriptUI Panels/

   * Windows:
     C:\Program Files\Adobe\Adobe After Effects <version>\Support Files\Scripts\ScriptUI Panels\

3. Restart Adobe After Effects (or click Window > Workspace > Reload).
4. Open the panel from the top menu bar:
   Window > ShapeMaster.jsx
5. Dock the panel anywhere in your After Effects workspace.


--------------------------------------------------------------------------------
2. USER MANUAL & FEATURE BREAKDOWN
--------------------------------------------------------------------------------

================================================================================
TAB 1: [ ⚡ STROKES & FIXES ]
================================================================================

- FREEZE STROKE WIDTH
  Recursively crawls all shape groups (ADBE Vector Stroke) inside selected Shape 
  Layers and injects an inverse scale expression. Your stroke width stays 
  constant in exact pixels regardless of layer scaling.

- UNFREEZE STROKE
  Clears injected expressions from stroke properties, restoring native After 
  Effects scaling behavior.

- FIX NON-UNIFORM SCALE
  Applies an advanced geometric mean scale expression to compensate for 
  asymmetric X/Y scaling and parent layer scale hierarchies, preventing stroke 
  distortion.


================================================================================
TAB 2: [ 🎬 MOTION & PATHS ]
================================================================================

- 1-CLICK MULTI-TRIM PATHS
  Iterates through selected shape layers, inserts Trim Paths if not present, 
  and injects 0% -> 100% End keyframes (30 frames duration) with Easy Ease 
  curves. Automatically staggers layer start times by the specified frame delay.

- 1-CLICK WIPE TRIM PATHS
  Applies an automatic 4-keyframe line wipe animation:
  * End Property: 0% at current time -> 100% at +30 frames.
  * Start Property: 0% at +10 frames -> 100% at +40 frames.
  All 4 keyframes are automatically Easy-Eased with optional layer staggering.

- STAGGER TRIM PATHS
  Offsets existing Trim Paths keyframes across selected shape layers by a 
  customizable frame delay (default: 2 frames).

- EQUALIZE PATH POINTS (MORPH PREP)
  Scans selected vector paths and subdivides vertices so all shapes match the 
  same maximum vertex count. Essential for glitch-free shape morphing!


================================================================================
TAB 3: [ 🎯 AUTO LAYOUT ]
================================================================================

- SMART AUTO-BACKGROUND BOX
  Select a Text Layer (or Text + Shape Layer). Injects sourceRectAtTime() 
  expressions into shape size & position so the background box automatically 
  resizes and pads around your text in real time as you type!

- 9-POINT ANCHOR POINT MATRIX
  Interactive 3x3 alignment grid:
  [ ◤ TL ] [ ▲ TC ] [ ◥ TR ]  (Top-Left, Top-Center, Top-Right)
  [ ◀ ML ] [ ●  C ] [ ▶ MR ]  (Middle-Left, Center, Middle-Right)
  [ ◣ BL ] [ ▼ BC ] [ ◢ BR ]  (Bottom-Left, Bottom-Center, Bottom-Right)
  Snaps layer anchor points to exact visual coordinates without canvas jump.


--------------------------------------------------------------------------------
3. BRAND & SUPPORT
--------------------------------------------------------------------------------
Developed & Maintained by FramEmpire
Website: https://www.framempire.com
================================================================================
