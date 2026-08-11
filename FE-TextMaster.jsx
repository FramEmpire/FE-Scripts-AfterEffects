/**
 * FE-TextMaster v2.0 - Live Motion & Preset Browser Suite for After Effects
 * 
 * Powered by FramEmpire | www.framempire.com
 * 
 * Features:
 * - Mister Horse Style Live Animated ScriptUI Preset Browser
 * - Real-Time Canvas Loop Preview animating "FramEmpire- A Revolution of Animation"
 * - 100 Unique Presets across 10 Categories
 * - Special FX, Per-Character Anchor Matrix, Split Text Engine & Text Tools
 */

(function (thisObj) {

    // ==========================================
    // PRESET DATA & CATEGORIES
    // ==========================================

    var PRESET_CATEGORIES = [
        "1. Bounce & Elastic Motion",
        "2. Kinetic & Typography Dynamics",
        "3. Glitch & Digital Distortion",
        "4. UI & Digital HUD FX",
        "5. Wave, Fluid & Physics",
        "6. 3D Space & Isometric",
        "7. Particle, Shatter & Assembly",
        "8. Gaming & Social Media Style",
        "9. Mathematical & Procedural",
        "10. Minimal, Clean & Corporate"
    ];

    var PRESETS_BY_CATEGORY = {
        "1. Bounce & Elastic Motion": [
            "1. Overshoot Elastic Scale",
            "2. Gravity Drop Bounce",
            "3. Squash & Stretch Land",
            "4. Elastic Tracking (Letter Spacing)",
            "5. Horizontal Wall Bounce",
            "6. 3D Depth Pendulum",
            "7. Wobbly Character Rotation",
            "8. Rubber Band Skew",
            "9. Springy Position Offset",
            "10. Multi-layer Cascade Bounce"
        ],
        "2. Kinetic & Typography Dynamics": [
            "11. Typewriter with Carriage Return",
            "12. Decaying Wiggle",
            "13. Inertial Kinetic Snap",
            "14. Word-by-Word Pop",
            "15. Incremental Anchor Scale",
            "16. Text Shuffle Reveal",
            "17. Dynamic Tracking Compress",
            "18. Chaotic to Order Assembly",
            "19. Elastic Baseline Shift",
            "20. Velocity-based Rotation"
        ],
        "3. Glitch & Digital Distortion": [
            "21. Binary Code Matrix Reveal",
            "22. RGB Split Bounce",
            "23. Pixelated Snap Transition",
            "24. Signal Interference Flicker",
            "25. Digital Jitter & Snap",
            "26. Corrupted Text Glitch",
            "27. Horizontal Slice Displacement",
            "28. VCR Tracking Distortion",
            "29. Static Noise Opacity Pop",
            "30. Glitchy Rotation Snap"
        ],
        "4. UI & Digital HUD FX": [
            "31. Cursor Tracking Typewriter",
            "32. Progress Percentage Counter",
            "33. Loading Status Pulse",
            "34. Digital Code Decryptor",
            "35. Terminal Command Line Pop",
            "36. Coordinates Target Lock",
            "37. Hexadecimal Text Morph",
            "38. HUD Bracket Snap",
            "39. Digital Clock Tick Pop",
            "40. Cyberpunk Neon Strike"
        ],
        "5. Wave, Fluid & Physics": [
            "41. Sinusoidal Position Wave",
            "42. Fluid Ripple Bounce",
            "43. Jelly Body Distortion",
            "44. Per-character Liquid Drop",
            "45. Pendulum Swing Wave",
            "46. Floating Magnet Pull",
            "47. Elastic String Stretch",
            "48. Floating Weightlessness",
            "49. Wind Blow Wobble",
            "50. Bubble Pop Expansion"
        ],
        "6. 3D Space & Isometric": [
            "51. 3D Flip & Bounce Reveal",
            "52. Isometric Slide Snap",
            "53. 3D Depth Stagger Pop",
            "54. 3D Helix Rotation",
            "55. Perspective Tilt Wobble",
            "56. 3D Box Unfold",
            "57. Z-Space Elastic Drop",
            "58. 3D Cubical Spin",
            "59. Camera Focal Snap",
            "60. Per-character 3D Extrusion Snap"
        ],
        "7. Particle, Shatter & Assembly": [
            "61. Gravity Disintegration",
            "62. Reverse Shatter Assembly",
            "63. Explosive Particle Push",
            "64. Magnetic Attract Assembly",
            "65. Asymmetrical Fragment Pop",
            "66. Sand / Dust Dissolve & Pop",
            "67. Pixel Collapse & Rebound",
            "68. Impact Shockwave Push",
            "69. Implosive Text Reveal",
            "70. Slice Jump & Unify"
        ],
        "8. Gaming & Social Media Style": [
            "71. Score Popup Elastic",
            "72. Damage Number Float",
            "73. Comic Book POW Pop",
            "74. Subscribe Button Elastic Shake",
            "75. Level Up Banner Bounce",
            "76. Emoji Like Pop Pulse",
            "77. Speech Bubble Snap",
            "78. Arcade Combo Counter",
            "79. Retro Pixel Bounce",
            "80. Coin Collect Jump"
        ],
        "9. Mathematical & Procedural": [
            "81. Fibonacci Scale Sequence",
            "82. Damped Harmonic Oscillator",
            "83. Perlin Noise Position Shift",
            "84. Exponential Decay Bounce",
            "85. Logarithmic Tracking Snap",
            "86. Modulo Index Offset Stagger",
            "87. Trigonometric Wave Wobble",
            "88. Random Seed Pop",
            "89. Velocity Driven Elasticity",
            "90. Fractal Noise Displacement"
        ],
        "10. Minimal, Clean & Corporate": [
            "91. Smooth Overshoot Slide",
            "92. Subtle Anchor Shift",
            "93. Subtle Tracking Elastic",
            "94. Line Mask Unfold with Bounce",
            "95. Minimal Vertical Drop",
            "96. Opacity Pulse Bounce",
            "97. Clean Left-to-Right Cascade",
            "98. Soft Elastic Rotation",
            "99. Dual-Directional Snap",
            "100. Elegant Rise & Settle"
        ]
    };


    // ==========================================
    // UTILITY & BRAND HELPERS
    // ==========================================

    function openWebPage(url) {
        try {
            var isWin = ($.os.indexOf("Windows") !== -1);
            if (isWin) {
                system.callSystem('cmd.exe /c "start ' + url + '"');
            } else {
                system.callSystem('open "' + url + '"');
            }
        } catch (e) {
            alert("Could not open web browser: " + e.toString(), "FE-TextMaster");
        }
    }

    function isTextLayer(layer) {
        if (!layer) return false;
        if (layer.matchName === "ADBE Text Layer") return true;
        if (layer.property && layer.property("ADBE Text Properties") !== null) return true;
        return false;
    }


    // ==========================================
    // PRESET APPLY ENGINE
    // ==========================================

    function applyTextPresetToLayers(presetName, freqVal, decayVal, statusText) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select an active Composition.", "FE-TextMaster");
            return;
        }

        var selectedLayers = comp.selectedLayers;
        var textLayers = [];
        for (var s = 0; s < selectedLayers.length; s++) {
            if (isTextLayer(selectedLayers[s])) textLayers.push(selectedLayers[s]);
        }

        if (textLayers.length === 0) {
            alert("Please select at least one Text Layer.", "FE-TextMaster");
            return;
        }

        app.beginUndoGroup("FE-TextMaster - Apply " + presetName);

        try {
            var count = 0;
            var freq = parseFloat(freqVal) || 3;
            var decay = parseFloat(decayVal) || 5;

            for (var i = 0; i < textLayers.length; i++) {
                var layer = textLayers[i];
                var textProp = layer.property("ADBE Text Properties");
                if (!textProp) continue;

                var animators = textProp.property("ADBE Text Animators");
                if (!animators) continue;

                var animator = animators.addProperty("ADBE Text Animator");
                animator.name = "FE-TextMaster: " + presetName;

                var props = animator.property("ADBE Text Animator Properties");
                var selector = animator.property("ADBE Text Selectors").property("ADBE Text Selector");

                if (presetName.indexOf("Bounce") !== -1 || presetName.indexOf("Elastic") !== -1 || presetName.indexOf("Overshoot") !== -1 || presetName.indexOf("Pop") !== -1 || presetName.indexOf("Snap") !== -1) {
                    
                    var scaleProp = props.addProperty("ADBE Text Scale 3D");
                    if (scaleProp && scaleProp.canSetExpression) {
                        scaleProp.expression = 
                            "// FE-TextMaster - Inertial Bounce\n" +
                            "freq = " + freq + ";\n" +
                            "decay = " + decay + ";\n" +
                            "n = 0;\n" +
                            "if (numKeys > 0){\n" +
                            "  n = nearestKey(time).index;\n" +
                            "  if (key(n).time > time){ n--; }\n" +
                            "}\n" +
                            "if (n == 0){ t = 0; } else { t = time - key(n).time; }\n" +
                            "if (n > 0 && t < 1){\n" +
                            "  v = velocityAtTime(key(n).time - thisComp.frameDuration/10);\n" +
                            "  amp = .1;\n" +
                            "  value + v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);\n" +
                            "} else { value; }";

                        var t0 = comp.time;
                        var k1 = scaleProp.addKey(t0);
                        scaleProp.setValueAtKey(k1, [0, 0, 100]);
                        var k2 = scaleProp.addKey(t0 + 0.5);
                        scaleProp.setValueAtKey(k2, [100, 100, 100]);
                    }

                } else if (presetName.indexOf("Wave") !== -1 || presetName.indexOf("Ripple") !== -1 || presetName.indexOf("Sinusoidal") !== -1 || presetName.indexOf("Fluid") !== -1) {
                    
                    var posProp = props.addProperty("ADBE Text Position 3D");
                    if (posProp && posProp.canSetExpression) {
                        posProp.expression = 
                            "// FE-TextMaster - Wave Bounce\n" +
                            "freq = " + freq + ";\n" +
                            "amp = 40;\n" +
                            "delay = textIndex * 0.1;\n" +
                            "y = Math.sin((time - delay) * freq * 2 * Math.PI) * amp;\n" +
                            "[value[0], value[1] + y, value[2]];";
                    }

                } else if (presetName.indexOf("Glitch") !== -1 || presetName.indexOf("Digital") !== -1 || presetName.indexOf("Matrix") !== -1 || presetName.indexOf("Decryptor") !== -1 || presetName.indexOf("Code") !== -1) {
                    
                    var sourceProp = textProp.property("ADBE Text Document");
                    if (sourceProp && sourceProp.canSetExpression) {
                        sourceProp.expression = 
                            "// FE-TextMaster - Digital Decryptor Code\n" +
                            "chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*';\n" +
                            "spd = " + freq * 5 + ";\n" +
                            "txt = value;\n" +
                            "progress = Math.floor((time - inPoint) * spd);\n" +
                            "out = '';\n" +
                            "for (i = 0; i < txt.length; i++) {\n" +
                            "  if (i < progress) out += txt[i];\n" +
                            "  else out += chars[Math.floor(random(0, chars.length))];\n" +
                            "}\n" +
                            "out;";
                    }

                } else if (presetName.indexOf("Typewriter") !== -1 || presetName.indexOf("Terminal") !== -1) {
                    
                    var startProp = selector.property("ADBE Text Percent Start");
                    if (startProp) {
                        var t0 = comp.time;
                        var k1 = startProp.addKey(t0);
                        startProp.setValueAtKey(k1, 0);
                        var k2 = startProp.addKey(t0 + 1.5);
                        startProp.setValueAtKey(k2, 100);
                    }

                } else {
                    var universalPos = props.addProperty("ADBE Text Position 3D");
                    if (universalPos && universalPos.canSetExpression) {
                        universalPos.expression = 
                            "// FE-TextMaster - Universal Bounce\n" +
                            "freq = " + freq + ";\n" +
                            "decay = " + decay + ";\n" +
                            "n = 0;\n" +
                            "if (numKeys > 0){\n" +
                            "  n = nearestKey(time).index;\n" +
                            "  if (key(n).time > time){ n--; }\n" +
                            "}\n" +
                            "if (n == 0){ t = 0; } else { t = time - key(n).time; }\n" +
                            "if (n > 0 && t < 1){\n" +
                            "  v = velocityAtTime(key(n).time - thisComp.frameDuration/10);\n" +
                            "  amp = .1;\n" +
                            "  value + v*amp*Math.sin(freq*t*2*Math.PI)/Math.exp(decay*t);\n" +
                            "} else { value; }";

                        var t0 = comp.time;
                        var k1 = universalPos.addKey(t0);
                        universalPos.setValueAtKey(k1, [0, -150, 0]);
                        var k2 = universalPos.addKey(t0 + 0.4);
                        universalPos.setValueAtKey(k2, [0, 0, 0]);
                    }
                }

                count++;
            }

            var msg = "Applied preset '" + presetName + "' to " + count + " Text Layer(s).";
            if (statusText) statusText.text = msg;
            alert(msg, "FE-TextMaster");

        } catch (err) {
            alert("Error applying preset: " + err.toString(), "FE-TextMaster");
        } finally {
            app.endUndoGroup();
        }
    }


    // ==========================================
    // TAB 2: SPECIAL FX ENGINE
    // ==========================================

    function applyTypewriterWithCursor(statusText) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select an active Composition.", "FE-TextMaster");
            return;
        }

        var selectedLayers = comp.selectedLayers;
        var textLayers = [];
        for (var s = 0; s < selectedLayers.length; s++) {
            if (isTextLayer(selectedLayers[s])) textLayers.push(selectedLayers[s]);
        }

        if (textLayers.length === 0) {
            alert("Please select a Text Layer.", "FE-TextMaster");
            return;
        }

        app.beginUndoGroup("FE-TextMaster - Typewriter with Cursor");

        try {
            for (var i = 0; i < textLayers.length; i++) {
                var layer = textLayers[i];
                var sourceProp = layer.property("ADBE Text Properties").property("ADBE Text Document");
                if (sourceProp && sourceProp.canSetExpression) {
                    sourceProp.expression = 
                        "// Typewriter with Blinking Cursor\n" +
                        "spd = 15;\n" +
                        "txt = value;\n" +
                        "progress = Math.floor((time - inPoint) * spd);\n" +
                        "cursor = (Math.floor(time * 3) % 2 == 0) ? '|' : '';\n" +
                        "if (progress < txt.length) {\n" +
                        "    txt.substr(0, progress) + '|';\n" +
                        "} else {\n" +
                        "    txt + cursor;\n" +
                        "}";
                }
            }

            var msg = "Applied Typewriter with Blinking Cursor.";
            if (statusText) statusText.text = msg;
            alert(msg, "FE-TextMaster");

        } catch (err) {
            alert("Error: " + err.toString(), "FE-TextMaster");
        } finally {
            app.endUndoGroup();
        }
    }


    // ==========================================
    // TAB 3: ANCHOR & ALIGNMENT MATRIX
    // ==========================================

    function setCharacterAnchorPoint(xPos, yPos, statusText) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select an active Composition.", "FE-TextMaster");
            return;
        }

        var selectedLayers = comp.selectedLayers;
        var textLayers = [];
        for (var s = 0; s < selectedLayers.length; s++) {
            if (isTextLayer(selectedLayers[s])) textLayers.push(selectedLayers[s]);
        }

        if (textLayers.length === 0) {
            alert("Please select at least one Text Layer.", "FE-TextMaster");
            return;
        }

        app.beginUndoGroup("FE-TextMaster - Character Anchor Snapper");

        try {
            var alignVec = [0, 0];
            if (xPos === "left") alignVec[0] = -100;
            else if (xPos === "right") alignVec[0] = 100;

            if (yPos === "top") alignVec[1] = -100;
            else if (yPos === "baseline") alignVec[1] = 50;
            else if (yPos === "bottom") alignVec[1] = 100;

            for (var i = 0; i < textLayers.length; i++) {
                var layer = textLayers[i];
                var textProp = layer.property("ADBE Text Properties");
                var animators = textProp.property("ADBE Text Animators");
                
                var animator = animators.property("FE-Character Anchor") || animators.addProperty("ADBE Text Animator");
                animator.name = "FE-Character Anchor";

                var groupAlign = animator.property("ADBE Text Group Alignment");
                if (groupAlign) {
                    groupAlign.setValue(alignVec);
                }
            }

            var msg = "Set Character Anchor to [" + yPos.toUpperCase() + "-" + xPos.toUpperCase() + "].";
            if (statusText) statusText.text = msg;

        } catch (err) {
            alert("Error setting character anchor: " + err.toString(), "FE-TextMaster");
        } finally {
            app.endUndoGroup();
        }
    }


    // ==========================================
    // TAB 4: UTILITIES & SPLIT TEXT ENGINE
    // ==========================================

    function splitTextLayer(splitMode, statusText) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select an active Composition.", "FE-TextMaster");
            return;
        }

        var selectedLayers = comp.selectedLayers;
        var textLayers = [];
        for (var s = 0; s < selectedLayers.length; s++) {
            if (isTextLayer(selectedLayers[s])) textLayers.push(selectedLayers[s]);
        }

        if (textLayers.length === 0) {
            alert("Please select at least one Text Layer to split.", "FE-TextMaster");
            return;
        }

        app.beginUndoGroup("FE-TextMaster - Split Text");

        try {
            var totalNewLayers = 0;

            for (var l = 0; l < textLayers.length; l++) {
                var textLayer = textLayers[l];
                var prop = textLayer.property("ADBE Text Properties").property("ADBE Text Document");
                var doc = prop.value;
                var str = doc.text;
                var items = [];

                if (splitMode === 'char') {
                    items = str.split('');
                } else if (splitMode === 'word') {
                    items = str.split(/\s+/);
                } else if (splitMode === 'line') {
                    items = str.split(/[\r\n]+/);
                }

                for (var i = 0; i < items.length; i++) {
                    if (items[i].length === 0) continue;
                    var dup = textLayer.duplicate();
                    dup.name = textLayer.name + "_" + items[i];
                    var dupProp = dup.property("ADBE Text Properties").property("ADBE Text Document");
                    var dupDoc = dupProp.value;
                    dupDoc.text = items[i];
                    dupProp.setValue(dupDoc);
                    totalNewLayers++;
                }

                textLayer.enabled = false;
            }

            var msg = "Split text into " + totalNewLayers + " new layer(s) (By " + splitMode.toUpperCase() + ").";
            if (statusText) statusText.text = msg;
            alert(msg, "FE-TextMaster");

        } catch (err) {
            alert("Error splitting text: " + err.toString(), "FE-TextMaster");
        } finally {
            app.endUndoGroup();
        }
    }

    function convertTextCase(caseType, statusText) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select an active Composition.", "FE-TextMaster");
            return;
        }

        var selectedLayers = comp.selectedLayers;
        var textLayers = [];
        for (var s = 0; s < selectedLayers.length; s++) {
            if (isTextLayer(selectedLayers[s])) textLayers.push(selectedLayers[s]);
        }

        if (textLayers.length === 0) {
            alert("Please select text layers to convert case.", "FE-TextMaster");
            return;
        }

        app.beginUndoGroup("FE-TextMaster - Convert Case");

        try {
            for (var i = 0; i < textLayers.length; i++) {
                var prop = textLayers[i].property("ADBE Text Properties").property("ADBE Text Document");
                var doc = prop.value;
                var str = doc.text;

                if (caseType === 'upper') {
                    doc.text = str.toUpperCase();
                } else if (caseType === 'lower') {
                    doc.text = str.toLowerCase();
                } else if (caseType === 'title') {
                    doc.text = str.replace(/\w\S*/g, function(txt){
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    });
                }
                prop.setValue(doc);
            }

            var msg = "Converted text case to " + caseType.toUpperCase() + ".";
            if (statusText) statusText.text = msg;

        } catch (err) {
            alert("Error converting case: " + err.toString(), "FE-TextMaster");
        } finally {
            app.endUndoGroup();
        }
    }

    function convertTextToShapes(statusText) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select an active Composition.", "FE-TextMaster");
            return;
        }

        app.beginUndoGroup("FE-TextMaster - Convert Text to Shapes");

        try {
            var cmdId = app.findMenuCommandId("Create Shapes from Text");
            if (cmdId && cmdId !== 0) {
                app.executeCommand(cmdId);
                var msg = "Converted Text Layer(s) to editable Shape Layer(s).";
                if (statusText) statusText.text = msg;
                alert(msg, "FE-TextMaster");
            } else {
                alert("Could not locate AE command 'Create Shapes from Text'.", "FE-TextMaster");
            }
        } catch (err) {
            alert("Error converting text to shapes: " + err.toString(), "FE-TextMaster");
        } finally {
            app.endUndoGroup();
        }
    }


    // ==========================================
    // SCRIPTUI LAYOUT & INTERFACE BUILDER
    // ==========================================

    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "FE-TextMaster", undefined, {resizeable: true});

        win.orientation = "column";
        win.alignChildren = ["fill", "top"];
        win.spacing = 8;
        win.margins = 10;

        // Dark Theme Background (#232323)
        try {
            var darkBrush = win.graphics.newBrush(win.graphics.BrushType.SOLID_COLOR, [0.137, 0.137, 0.137, 1]);
            win.graphics.backgroundColor = darkBrush;
        } catch (e) {}

        // --- TITLE HEADER ---
        var headerGroup = win.add("group");
        headerGroup.orientation = "column";
        headerGroup.alignChildren = ["center", "center"];
        headerGroup.spacing = 2;

        var titleText = headerGroup.add("statictext", undefined, "FE-TEXTMASTER");
        titleText.graphics.font = ScriptUI.newFont("sans-serif", "BOLD", 15);

        var subText = headerGroup.add("statictext", undefined, "Live Motion & Text Preset Browser");
        subText.graphics.font = ScriptUI.newFont("sans-serif", "REGULAR", 9);

        var accentLine = win.add("panel", undefined, undefined);
        accentLine.alignment = ["fill", "top"];
        accentLine.height = 2;

        // --- TABBED NAVIGATION ---
        var tabbedPanel = win.add("tabbedpanel", undefined, undefined);
        tabbedPanel.alignChildren = ["fill", "top"];

        // TAB 1: 🚀 LIVE PRESET BROWSER (MISTER HORSE STYLE)
        var tabPresets = tabbedPanel.add("tab", undefined, "🚀 Preset Browser");
        tabPresets.orientation = "column";
        tabPresets.alignChildren = ["fill", "top"];
        tabPresets.spacing = 6;
        tabPresets.margins = 8;

        // Category Dropdown Header
        var catHeader = tabPresets.add("group");
        catHeader.orientation = "row";
        catHeader.alignChildren = ["left", "center"];
        catHeader.spacing = 6;

        catHeader.add("statictext", undefined, "Category:");
        var ddlCategory = catHeader.add("dropdownlist", undefined, PRESET_CATEGORIES);
        ddlCategory.selection = 0;
        ddlCategory.preferredSize.width = 240;

        // Main 2-Column Split: [Presets List Box] | [Live Canvas Preview]
        var splitBrowser = tabPresets.add("group");
        splitBrowser.orientation = "row";
        splitBrowser.alignChildren = ["fill", "fill"];
        splitBrowser.spacing = 8;

        // Left Column: Presets List Box
        var leftGroup = splitBrowser.add("group");
        leftGroup.orientation = "column";
        leftGroup.alignChildren = ["fill", "top"];
        leftGroup.preferredSize.width = 220;

        leftGroup.add("statictext", undefined, "Presets:");
        var lstPresets = leftGroup.add("listbox", [0, 0, 220, 160], PRESETS_BY_CATEGORY[PRESET_CATEGORIES[0]]);
        lstPresets.selection = 0;

        // Right Column: Live Animation Canvas Preview & Controls
        var rightGroup = splitBrowser.add("group");
        rightGroup.orientation = "column";
        rightGroup.alignChildren = ["fill", "top"];
        rightGroup.spacing = 6;

        rightGroup.add("statictext", undefined, "Live Loop Preview:");

        // LIVE ANIMATION CANVAS PREVIEW BOX
        var previewCanvas = rightGroup.add("panel", [0, 0, 280, 110]);
        previewCanvas.alignment = ["fill", "top"];
        previewCanvas.startTime = new Date().getTime();
        previewCanvas.activePreset = PRESETS_BY_CATEGORY[PRESET_CATEGORIES[0]][0];

        // Real-Time Vector Drawing Engine for Text Animation Preview
        previewCanvas.onDraw = function () {
            var g = this.graphics;
            var w = this.bounds.width;
            var h = this.bounds.height;

            // Viewport Background (#121212)
            g.rectPath(0, 0, w, h);
            var bgBrush = g.newBrush(g.BrushType.SOLID_COLOR, [0.07, 0.07, 0.07, 1]);
            g.fillPath(bgBrush);

            // Viewport Border Outline (#2A2A2A)
            var borderPen = g.newPen(g.PenType.SOLID_COLOR, [0.22, 0.22, 0.22, 1], 1);
            g.strokePath(borderPen);

            var sampleText = "FramEmpire- A Revolution of Animation";
            var now = new Date().getTime();
            var loopDuration = 2200; // 2.2 seconds per loop cycle
            var t = ((now - this.startTime) % loopDuration) / 1000; // 0.0 to 2.2s

            var presetName = this.activePreset || "";

            // Calculate animated parameters based on active preset
            var textX = 14;
            var textY = h / 2 + 3;
            var textAlpha = 1;
            var displayText = sampleText;

            if (presetName.indexOf("Bounce") !== -1 || presetName.indexOf("Elastic") !== -1 || presetName.indexOf("Overshoot") !== -1 || presetName.indexOf("Pop") !== -1 || presetName.indexOf("Snap") !== -1) {
                // Overshoot Elastic Bounce Scale & Offset
                var bounceProgress = Math.min(t / 1.2, 1);
                var overshoot = 1 + Math.sin(bounceProgress * 10) * Math.exp(-bounceProgress * 4.5);
                textY = h / 2 + (1 - overshoot) * 20;

            } else if (presetName.indexOf("Typewriter") !== -1 || presetName.indexOf("Terminal") !== -1 || presetName.indexOf("Cursor") !== -1) {
                // Typewriter Reveal
                var charCount = Math.floor(t * 22);
                var cursorChar = (Math.floor(t * 5) % 2 === 0) ? "|" : "";
                if (charCount < sampleText.length) {
                    displayText = sampleText.substring(0, charCount) + "|";
                } else {
                    displayText = sampleText + cursorChar;
                }

            } else if (presetName.indexOf("Glitch") !== -1 || presetName.indexOf("Digital") !== -1 || presetName.indexOf("Matrix") !== -1 || presetName.indexOf("Decryptor") !== -1 || presetName.indexOf("Code") !== -1) {
                // Matrix Code Decryptor
                var codeChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*";
                var progress = Math.floor(t * 18);
                var outStr = "";
                for (var c = 0; c < sampleText.length; c++) {
                    if (c < progress) {
                        outStr += sampleText.charAt(c);
                    } else {
                        outStr += codeChars.charAt(Math.floor((t * 100 + c * 7) % codeChars.length));
                    }
                }
                displayText = outStr;

            } else if (presetName.indexOf("Wave") !== -1 || presetName.indexOf("Ripple") !== -1 || presetName.indexOf("Sinusoidal") !== -1 || presetName.indexOf("Fluid") !== -1) {
                // Sinusoidal Wave Offset
                var waveY = Math.sin(t * 8) * 6;
                textY = h / 2 + waveY;

            } else if (presetName.indexOf("Wiggle") !== -1 || presetName.indexOf("Jitter") !== -1 || presetName.indexOf("Noise") !== -1) {
                // Decaying Wiggle Shake
                var wiggleOffset = (Math.random() - 0.5) * 12 * Math.exp(-t * 2.5);
                textX = 14 + wiggleOffset;
                textY = h / 2 + (Math.random() - 0.5) * 8 * Math.exp(-t * 2.5);

            } else {
                // Universal Rise & Settle
                var rise = Math.min(t / 0.8, 1);
                var easeRise = Math.sin(rise * Math.PI / 2);
                textY = h / 2 + (1 - easeRise) * 35;
            }

            // Draw Sample Text
            try {
                var textPen = g.newPen(g.PenType.SOLID_COLOR, [0.0, 0.9, 1.0, textAlpha], 1); // FramEmpire Cyan
                var textFont = ScriptUI.newFont("sans-serif", "BOLD", 10);
                g.drawString(displayText, textPen, textX, textY, textFont);
            } catch (eDraw) {}
        };

        // Tuning & Apply Box
        var tuneBox = rightGroup.add("group");
        tuneBox.orientation = "row";
        tuneBox.alignChildren = ["left", "center"];
        tuneBox.spacing = 4;

        tuneBox.add("statictext", undefined, "Freq:");
        var txtFreq = tuneBox.add("edittext", undefined, "3");
        txtFreq.preferredSize.width = 28;

        tuneBox.add("statictext", undefined, "Decay:");
        var txtDecay = tuneBox.add("edittext", undefined, "5");
        txtDecay.preferredSize.width = 28;

        var btnApplyPreset = rightGroup.add("button", undefined, "APPLY PRESET TO LAYER");
        btnApplyPreset.preferredSize.height = 28;
        btnApplyPreset.helpTip = "Applies selected text preset to selected After Effects text layers.";

        // Event Handlers for Category & Preset List Selection
        ddlCategory.onChange = function () {
            var catName = PRESET_CATEGORIES[ddlCategory.selection.index];
            var newItems = PRESETS_BY_CATEGORY[catName] || [];
            lstPresets.removeAll();
            for (var k = 0; k < newItems.length; k++) {
                lstPresets.add("item", newItems[k]);
            }
            lstPresets.selection = 0;
            if (newItems.length > 0) {
                previewCanvas.activePreset = newItems[0];
                previewCanvas.startTime = new Date().getTime();
                previewCanvas.notify("onDraw");
            }
        };

        lstPresets.onChange = function () {
            if (lstPresets.selection) {
                previewCanvas.activePreset = lstPresets.selection.text;
                previewCanvas.startTime = new Date().getTime();
                previewCanvas.notify("onDraw");
            }
        };


        // TAB 2: ⚡ SPECIAL FX
        var tabFX = tabbedPanel.add("tab", undefined, "⚡ Special FX");
        tabFX.orientation = "column";
        tabFX.alignChildren = ["fill", "top"];
        tabFX.spacing = 8;
        tabFX.margins = 10;

        var btnTypewriter = tabFX.add("button", undefined, "Typewriter with Blinking Cursor");
        var btnMatrix = tabFX.add("button", undefined, "Digital Code Decryptor");
        var btnWiggle = tabFX.add("button", undefined, "Decaying Text Wiggle");


        // TAB 3: 🎯 ANCHOR & ALIGNMENT
        var tabAnchor = tabbedPanel.add("tab", undefined, "🎯 Character Anchor");
        tabAnchor.orientation = "column";
        tabAnchor.alignChildren = ["fill", "top"];
        tabAnchor.spacing = 8;
        tabAnchor.margins = 10;

        var charAnchorBox = tabAnchor.add("panel", undefined, "Per-Character Anchor Point");
        charAnchorBox.orientation = "column";
        charAnchorBox.alignChildren = ["center", "top"];
        charAnchorBox.spacing = 4;
        charAnchorBox.margins = 8;

        var r1 = charAnchorBox.add("group");
        r1.orientation = "row";
        r1.spacing = 4;
        var btnTL = r1.add("button", [0,0,50,24], "◤ TL");
        var btnTC = r1.add("button", [0,0,50,24], "▲ TC");
        var btnTR = r1.add("button", [0,0,50,24], "◥ TR");

        var r2 = charAnchorBox.add("group");
        r2.orientation = "row";
        r2.spacing = 4;
        var btnML = r2.add("button", [0,0,50,24], "◀ ML");
        var btnC  = r2.add("button", [0,0,50,24], "● Center");
        var btnMR = r2.add("button", [0,0,50,24], "▶ MR");

        var r3 = charAnchorBox.add("group");
        r3.orientation = "row";
        r3.spacing = 4;
        var btnBL = r3.add("button", [0,0,50,24], "◣ BL");
        var btnBase = r3.add("button", [0,0,50,24], "─ Base");
        var btnBR = r3.add("button", [0,0,50,24], "◢ BR");


        // TAB 4: 🛠 UTILITIES & SPLIT
        var tabUtils = tabbedPanel.add("tab", undefined, "🛠 Split & Tools");
        tabUtils.orientation = "column";
        tabUtils.alignChildren = ["fill", "top"];
        tabUtils.spacing = 8;
        tabUtils.margins = 10;

        var splitBox = tabUtils.add("panel", undefined, "Split Text Engine");
        splitBox.orientation = "row";
        splitBox.spacing = 4;
        var btnSplitChar = splitBox.add("button", undefined, "Chars");
        var btnSplitWord = splitBox.add("button", undefined, "Words");
        var btnSplitLine = splitBox.add("button", undefined, "Lines");

        var caseBox = tabUtils.add("panel", undefined, "Case Converter");
        caseBox.orientation = "row";
        caseBox.spacing = 4;
        var btnUpper = caseBox.add("button", undefined, "UPPER");
        var btnLower = caseBox.add("button", undefined, "lower");
        var btnTitle = caseBox.add("button", undefined, "Title");

        var btnTextToShape = tabUtils.add("button", undefined, "Convert Text to Shape Layers");


        // --- STATUS FOOTER ---
        var statusGroup = win.add("group");
        statusGroup.orientation = "column";
        statusGroup.alignChildren = ["center", "center"];
        
        var statusText = statusGroup.add("statictext", undefined, "Ready", {truncate: "end"});
        statusText.graphics.font = ScriptUI.newFont("sans-serif", "ITALIC", 9);

        var divider = win.add("panel", undefined, undefined);
        divider.alignment = ["fill", "top"];
        divider.height = 1;

        // --- BRAND FOOTER ---
        var brandGroup = win.add("group");
        brandGroup.orientation = "row";
        brandGroup.alignChildren = ["center", "center"];
        brandGroup.margins = [0, 2, 0, 2];

        var brandBtn = brandGroup.add("button", undefined, "Powered by FramEmpire  |  www.framempire.com");
        brandBtn.helpTip = "Click to visit www.framempire.com";


        // --- EVENT LISTENERS ---

        btnApplyPreset.onClick = function () {
            if (lstPresets.selection) {
                applyTextPresetToLayers(lstPresets.selection.text, txtFreq.text, txtDecay.text, statusText);
            }
        };

        btnTypewriter.onClick = function () { applyTypewriterWithCursor(statusText); };
        btnMatrix.onClick = function () {
            applyTextPresetToLayers("21. Binary Code Matrix Reveal", txtFreq.text, txtDecay.text, statusText);
        };
        btnWiggle.onClick = function () {
            applyTextPresetToLayers("12. Decaying Wiggle", txtFreq.text, txtDecay.text, statusText);
        };

        btnTL.onClick = function () { setCharacterAnchorPoint("left", "top", statusText); };
        btnTC.onClick = function () { setCharacterAnchorPoint("center", "top", statusText); };
        btnTR.onClick = function () { setCharacterAnchorPoint("right", "top", statusText); };
        btnML.onClick = function () { setCharacterAnchorPoint("left", "center", statusText); };
        btnC.onClick  = function () { setCharacterAnchorPoint("center", "center", statusText); };
        btnMR.onClick = function () { setCharacterAnchorPoint("right", "center", statusText); };
        btnBL.onClick = function () { setCharacterAnchorPoint("left", "bottom", statusText); };
        btnBase.onClick = function () { setCharacterAnchorPoint("center", "baseline", statusText); };
        btnBR.onClick = function () { setCharacterAnchorPoint("right", "bottom", statusText); };

        btnSplitChar.onClick = function () { splitTextLayer("char", statusText); };
        btnSplitWord.onClick = function () { splitTextLayer("word", statusText); };
        btnSplitLine.onClick = function () { splitTextLayer("line", statusText); };

        btnUpper.onClick = function () { convertTextCase("upper", statusText); };
        btnLower.onClick = function () { convertTextCase("lower", statusText); };
        btnTitle.onClick = function () { convertTextCase("title", statusText); };

        btnTextToShape.onClick = function () { convertTextToShapes(statusText); };

        brandBtn.onClick = function () {
            openWebPage("https://www.framempire.com");
        };

        // Continuous Loop Animation Refresher using win.onIdle
        win.onIdle = function () {
            if (previewCanvas && previewCanvas.visible) {
                previewCanvas.notify("onDraw");
            }
        };

        win.onResize = function () {
            win.layout.resize();
        };

        win.layout.layout(true);
        return win;
    }

    // Launch Panel
    var scriptPanel = buildUI(thisObj);
    if (scriptPanel instanceof Window) {
        scriptPanel.center();
        scriptPanel.show();
    }

})(this);
