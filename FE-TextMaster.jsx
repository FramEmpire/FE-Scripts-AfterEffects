/**
 * FE-TextMaster v4.0 - Live Motion & 100 Preset Suite for After Effects
 * 
 * Powered by FramEmpire | www.framempire.com
 * 
 * Core Engine:
 * - 100 Exact AE Motion Expressions across 10 Categories
 * - Guaranteed Live ScriptUI Preview Canvas animating "FramEmpire- A Revolution of Animation"
 * - Instant Preset Applicator & Expression Injector
 * - Split Text Engine, Per-Character Anchor Matrix & Text Utilities
 */

(function (thisObj) {

    // ==========================================
    // 10 CATEGORIES & 100 PRESET NAMES
    // ==========================================

    var PRESET_CATEGORIES = [
        "1. Bounce & Elastic Motion",
        "2. Kinetic Typography",
        "3. Glitch & Digital",
        "4. UI & HUD FX",
        "5. Physics, Wave & Fluid",
        "6. 3D Space & Isometric",
        "7. Particle & Shatter",
        "8. Gaming & Pop Style",
        "9. Mathematical Procedures",
        "10. Minimal & Clean"
    ];

    var PRESETS_BY_CATEGORY = {
        "1. Bounce & Elastic Motion": [
            "01. Heavy Gravity Drop",
            "02. Horizontal Wall Snap",
            "03. Rubber Skew Stretch",
            "04. 3D Depth Pendulum",
            "05. Character Stagger Bounce",
            "06. Overshoot Scale Pulse",
            "07. Baseline Wave Wobble",
            "08. Micro-Jitter Elastic",
            "09. Reverse Spring Snap",
            "10. Anchor Point Pop Bounce"
        ],
        "2. Kinetic Typography": [
            "11. Recoil Typewriter",
            "12. Decaying Wiggle Position",
            "13. Inertial Kinetic Snap",
            "14. Word Pop Cascade",
            "15. Incremental Tracking Snap",
            "16. Random Character Shuffle",
            "17. Velocity Driven Rotation",
            "18. Kinetic Line Slide",
            "19. Elastic Tracking Compress",
            "20. Chaotic Assembly Snap"
        ],
        "3. Glitch & Digital": [
            "21. RGB Channel Split",
            "22. Binary Code Matrix Reveal",
            "23. Signal Interference Flicker",
            "24. Digital Jitter Position",
            "25. Pixelated Snap Scale",
            "26. Corrupted Hex Glitch",
            "27. Horizontal Slice Offset",
            "28. VCR Tracking Jump",
            "29. Static Noise Opacity Pop",
            "30. Glitch Rotation Snap"
        ],
        "4. UI & HUD FX": [
            "31. Cursor Blink Typewriter",
            "32. Digital Counter Accent",
            "33. HUD Bracket Target Lock",
            "34. Terminal Command Line Pop",
            "35. Coordinate Position Lock",
            "36. Hexadecimal Morph",
            "37. Cyberpunk Neon Strike",
            "38. Loading Status Pulse",
            "39. Digital Clock Tick Snap",
            "40. Radar Sweep Tracking"
        ],
        "5. Physics, Wave & Fluid": [
            "41. Sinusoidal Position Wave",
            "42. Jelly Body Distortion",
            "43. Fluid Ripple Offset",
            "44. Per-Character Drop Bounce",
            "45. Pendulum Swing Wave",
            "46. Floating Magnet Attract",
            "47. Wind Blow Wobble",
            "48. Zero Gravity Float",
            "49. Bubble Pop Expansion",
            "50. String Elastic Tension"
        ],
        "6. 3D Space & Isometric": [
            "51. 3D Flip Bounce Reveal",
            "52. Isometric Slide Snap",
            "53. 3D Helix Rotation",
            "54. Z-Space Elastic Drop",
            "55. Perspective Tilt Wobble",
            "56. 3D Box Unfold",
            "57. Camera Focal Snap",
            "58. 3D Cubical Spin",
            "59. 3D Extrusion Depth Pop",
            "60. Depth Stagger Push"
        ],
        "7. Particle & Shatter": [
            "61. Gravity Disintegration",
            "62. Reverse Shatter Re-assembly",
            "63. Explosive Particle Outward",
            "64. Implosive Snap Reveal",
            "65. Slice Jump Unify",
            "66. Asymmetrical Fragment Pop",
            "67. Magnetic Attract Assembly",
            "68. Impact Shockwave Offset",
            "69. Sand Dissolve Rebound",
            "70. Pixel Collapse Re-bound"
        ],
        "8. Gaming & Pop Style": [
            "71. Score Elastic Popup",
            "72. Damage Number Float",
            "73. Comic Book POW Pop",
            "74. Subscribe Button Shake",
            "75. Level Up Banner Bounce",
            "76. Emoji Pulse Bump",
            "77. Speech Bubble Snap",
            "78. Arcade Combo Bounce",
            "79. Retro 8-Bit Jump",
            "80. Coin Collect Rise"
        ],
        "9. Mathematical Procedures": [
            "81. Harmonic Oscillator Physics",
            "82. Fibonacci Scale Stagger",
            "83. Perlin Noise Position Shift",
            "84. Exponential Decay Bounce",
            "85. Logarithmic Tracking Snap",
            "86. Modulo Index Offset Wave",
            "87. Trigonometric Swing",
            "88. Random Seed Frequency Pop",
            "89. Velocity Driven Elasticity",
            "90. Fractal Noise Displacement"
        ],
        "10. Minimal & Clean": [
            "91. Smooth Overshoot Slide",
            "92. Subtle Anchor Shift",
            "93. Minimal Vertical Drop",
            "94. Line Mask Unfold Elastic",
            "95. Soft Tracking Expansion",
            "96. Dual-Direction Snap",
            "97. Opacity Pulse Bounce",
            "98. Clean Left Cascade",
            "99. Subtle Rotation Settle",
            "100. Elegant Rise Snap"
        ]
    };


    // ==========================================
    // EXACT 100 AE EXPRESSIONS MAP
    // ==========================================

    var EXPRESSION_MAP = {
        // 1. Bounce & Elastic Motion (1-10)
        "01. Heavy Gravity Drop": "t = time - inPoint;\nif (t > 0) {\n  gravity = 1500;\n  bounce = 0.6;\n  y = 0.5 * gravity * t * t;\n  value + [0, Math.min(y, 300) * Math.abs(Math.cos(t * 8)) * Math.exp(-t * 3)];\n} else { value; }",
        "02. Horizontal Wall Snap": "freq = 4; decay = 6;\nt = time - inPoint;\nx = 500 * Math.sin(freq * t * 2 * Math.PI) * Math.exp(-decay * t);\nvalue + [x, 0];",
        "03. Rubber Skew Stretch": "freq = 3; decay = 5;\nt = time - inPoint;\ns = 50 * Math.sin(freq * t * 2 * Math.PI) * Math.exp(-decay * t);\nvalue + [s, -s];",
        "04. 3D Depth Pendulum": "freq = 2; decay = 3;\nt = time - inPoint;\nz = 400 * Math.cos(freq * t * 2 * Math.PI) * Math.exp(-decay * t);\nvalue + [0, 0, z];",
        "05. Character Stagger Bounce": "delay = textIndex * 0.05;\nt = Math.max(0, time - inPoint - delay);\ny = -200 * Math.sin(t * 10) * Math.exp(-t * 5);\nvalue + [0, y];",
        "06. Overshoot Scale Pulse": "freq = 3.5; decay = 6;\nt = time - inPoint;\ns = 100 * Math.sin(freq * t * 2 * Math.PI) * Math.exp(-decay * t);\nvalue + [s, s];",
        "07. Baseline Wave Wobble": "offset = textIndex * 0.3;\ny = Math.sin((time * 6) - offset) * 30 * Math.exp(-(time - inPoint) * 2);\nvalue + [0, y];",
        "08. Micro-Jitter Elastic": "t = time - inPoint;\nj = (Math.random() - 0.5) * 50 * Math.exp(-t * 8);\nvalue + [j, j];",
        "09. Reverse Spring Snap": "freq = 3; decay = 4;\nt = time - inPoint;\ny = -300 * Math.cos(freq * t * 2 * Math.PI) * Math.exp(-decay * t);\nvalue + [0, y];",
        "10. Anchor Point Pop Bounce": "t = time - inPoint;\ns = 100 * Math.sin(t * 12) * Math.exp(-t * 4);\nvalue + [s, s];",

        // 2. Kinetic Typography (11-20)
        "11. Recoil Typewriter": "speed = 12;\ntxt = value;\nnumChars = Math.floor((time - inPoint) * speed);\ntxt.substr(0, numChars);",
        "12. Decaying Wiggle Position": "t = time - inPoint;\nw = wiggle(15, 80);\nvalue + (w - value) * Math.exp(-t * 3);",
        "13. Inertial Kinetic Snap": "t = time - inPoint;\ndur = 0.5;\nif (t < dur) {\n  p = t / dur;\n  s = Math.sin(p * Math.PI * 2.5) * Math.exp(-p * 3);\n  value - [500 * (1 - s), 0];\n} else { value; }",
        "14. Word Pop Cascade": "delay = textIndex * 0.1;\nt = Math.max(0, time - inPoint - delay);\ns = 100 * Math.sin(t * 8) * Math.exp(-t * 4);\nvalue + [s, s];",
        "15. Incremental Tracking Snap": "t = time - inPoint;\nvalue + (100 * Math.cos(t * 10) * Math.exp(-t * 5));",
        "16. Random Character Shuffle": "chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';\nt = time - inPoint;\nif (t < 1) {\n  s = '';\n  for(i=0; i<value.length; i++) s += chars[Math.floor(Math.random()*chars.length)];\n  s;\n} else { value; }",
        "17. Velocity Driven Rotation": "v = speed;\nvalue + Math.min(v * 0.1, 45) * Math.sin(time * 10);",
        "18. Kinetic Line Slide": "t = time - inPoint;\nx = easeOut(t, 0, 0.4, -600, 0);\ny = Math.sin(t * 12) * 50 * Math.exp(-t * 4);\nvalue + [x, y];",
        "19. Elastic Tracking Compress": "t = time - inPoint;\nvalue - (200 * Math.sin(t * 8) * Math.exp(-t * 4));",
        "20. Chaotic Assembly Snap": "seedRandom(textIndex, true);\nrandPos = [random(-400, 400), random(-400, 400)];\nt = Math.max(0, time - inPoint - (textIndex * 0.03));\nvalue + (randPos * Math.exp(-t * 5));",

        // 3. Glitch & Digital (21-30)
        "21. RGB Channel Split": "posterizeTime(10);\nvalue + [(Math.random()-0.5)*30, 0];",
        "22. Binary Code Matrix Reveal": "t = time - inPoint;\ndur = 1.5;\nprogress = Math.min(1, t / dur);\nlen = Math.floor(progress * value.length);\nres = value.substr(0, len);\nfor(i=len; i<value.length; i++) res += Math.floor(Math.random()*2);\nres;",
        "23. Signal Interference Flicker": "posterizeTime(15);\n(Math.random() > 0.3) ? 100 : 20;",
        "24. Digital Jitter Position": "posterizeTime(12);\nt = time - inPoint;\n(t < 1) ? value + [(Math.random()-0.5)*60, (Math.random()-0.5)*20] : value;",
        "25. Pixelated Snap Scale": "posterizeTime(8);\nt = time - inPoint;\ns = (t < 0.5) ? Math.floor(Math.random()*4)*30 : 100;\n[s, s];",
        "26. Corrupted Hex Glitch": "hex = '0123456789ABCDEF';\nt = time - inPoint;\nif (t < 1) {\n  res = '';\n  for(i=0; i<value.length; i++) res += hex[Math.floor(Math.random()*16)];\n  res;\n} else { value; }",
        "27. Horizontal Slice Offset": "posterizeTime(12);\nx = (textIndex % 2 == 0 ? 1 : -1) * 80 * Math.exp(-(time-inPoint)*4);\nvalue + [x, 0];",
        "28. VCR Tracking Jump": "t = time - inPoint;\ny = (Math.sin(t * 20) > 0.8) ? 40 : 0;\nvalue + [0, y];",
        "29. Static Noise Opacity Pop": "seedRandom(index + time*100, false);\n(time - inPoint < 0.8) ? random(0, 100) : 100;",
        "30. Glitch Rotation Snap": "posterizeTime(10);\nt = time - inPoint;\n(t < 0.6) ? (Math.random()-0.5)*90 : 0;",

        // 4. UI & HUD FX (31-40)
        "31. Cursor Blink Typewriter": "speed = 10;\nnumChars = Math.floor((time - inPoint) * speed);\ncursor = (Math.floor(time * 3) % 2 == 0) ? '|' : '';\nvalue.substr(0, numChars) + cursor;",
        "32. Digital Counter Accent": "val = Math.floor(easeOut(time - inPoint, 0, 2, 0, 100));\nval + '%';",
        "33. HUD Bracket Target Lock": "t = time - inPoint;\ns = 200 * Math.exp(-t * 6);\nvalue + [s, s];",
        "34. Terminal Command Line Pop": "t = time - inPoint;\nstep = Math.floor(t * 8);\nvalue + [0, -step * 5 * Math.exp(-t * 2)];",
        "35. Coordinate Position Lock": "x = Math.floor(position[0] + wiggle(5, 20)[0]);\ny = Math.floor(position[1] + wiggle(5, 20)[1]);\n'X:' + x + ' Y:' + y;",
        "36. Hexadecimal Morph": "t = time - inPoint;\nif(t < 0.8) {\n  '0x' + Math.floor(Math.random()*65535).toString(16).toUpperCase();\n} else { value; }",
        "37. Cyberpunk Neon Strike": "t = time - inPoint;\n(t < 0.5) ? Math.sin(t * 40) * 100 : 100;",
        "38. Loading Status Pulse": "50 + Math.sin((time - inPoint) * 10) * 50;",
        "39. Digital Clock Tick Snap": "step = Math.floor((time - inPoint) * 4);\nstep * 90;",
        "40. Radar Sweep Tracking": "Math.sin(time * 5) * 50;",

        // 5. Physics, Wave & Fluid (41-50)
        "41. Sinusoidal Position Wave": "y = Math.sin((time * 5) + (textIndex * 0.5)) * 40;\nvalue + [0, y];",
        "42. Jelly Body Distortion": "t = time - inPoint;\nsx = 100 + 40 * Math.sin(t * 10) * Math.exp(-t * 3);\nsy = 100 - 40 * Math.sin(t * 10) * Math.exp(-t * 3);\n[sx, sy];",
        "43. Fluid Ripple Offset": "t = time - inPoint;\nr = Math.sin(t * 8 - textIndex * 0.4) * 30 * Math.exp(-t * 2);\nvalue + [0, r];",
        "44. Per-Character Drop Bounce": "t = Math.max(0, time - inPoint - textIndex * 0.08);\ny = Math.abs(Math.sin(t * 6)) * -150 * Math.exp(-t * 3);\nvalue + [0, -y];",
        "45. Pendulum Swing Wave": "t = time - inPoint;\nvalue + 45 * Math.cos(t * 4) * Math.exp(-t * 1.5);",
        "46. Floating Magnet Attract": "t = time - inPoint;\nd = 300 * Math.exp(-t * 4);\nvalue + [Math.cos(t*10)*d, Math.sin(t*10)*d];",
        "47. Wind Blow Wobble": "value + Math.sin(time * 8) * 15 * Math.exp(-(time-inPoint)*2);",
        "48. Zero Gravity Float": "x = Math.sin(time * 1.5) * 20;\ny = Math.cos(time * 2) * 25;\nvalue + [x, y];",
        "49. Bubble Pop Expansion": "t = time - inPoint;\ns = (t < 0.2) ? easeOut(t, 0, 0.2, 0, 130) : easeOut(t, 0.2, 0.4, 130, 100);\n[s, s];",
        "50. String Elastic Tension": "t = time - inPoint;\ny = -200 * Math.exp(-t * 2) * Math.cos(t * 15);\nvalue + [0, y];",

        // 6. 3D Space & Isometric (51-60)
        "51. 3D Flip Bounce Reveal": "t = Math.max(0, time - inPoint - textIndex * 0.05);\n180 * Math.cos(t * 6) * Math.exp(-t * 3);",
        "52. Isometric Slide Snap": "t = time - inPoint;\noffset = 400 * Math.exp(-t * 5) * Math.cos(t * 10);\nvalue + [offset, offset * 0.5];",
        "53. 3D Helix Rotation": "t = time - inPoint;\nMath.sin(t * 5 + textIndex * 0.5) * 90 * Math.exp(-t * 2);",
        "54. Z-Space Elastic Drop": "t = time - inPoint;\nz = -1000 * Math.cos(t * 5) * Math.exp(-t * 3);\nvalue + [0, 0, z];",
        "55. Perspective Tilt Wobble": "t = time - inPoint;\n60 * Math.sin(t * 6) * Math.exp(-t * 2.5);",
        "56. 3D Box Unfold": "t = Math.max(0, time - inPoint - textIndex * 0.1);\neaseOut(t, 0, 0.5, -90, 0);",
        "57. Camera Focal Snap": "t = time - inPoint;\ns = 400 * Math.exp(-t * 6);\nvalue + [s, s];",
        "58. 3D Cubical Spin": "t = time - inPoint;\n(t < 0.8) ? easeOut(t, 0, 0.8, 360, 0) : 0;",
        "59. 3D Extrusion Depth Pop": "t = time - inPoint;\nz = 500 * Math.sin(t * 8) * Math.exp(-t * 4);\nvalue + [0, 0, z];",
        "60. Depth Stagger Push": "t = Math.max(0, time - inPoint - textIndex * 0.06);\nz = -500 * Math.exp(-t * 4);\nvalue + [0, 0, z];",

        // 7. Particle & Shatter (61-70)
        "61. Gravity Disintegration": "t = Math.max(0, time - inPoint - textIndex * 0.05);\ny = 0.5 * 1000 * t * t;\nvalue + [0, y];",
        "62. Reverse Shatter Re-assembly": "seedRandom(textIndex, true);\nstartPos = [random(-600,600), random(-600,600)];\nt = time - inPoint;\ndur = 0.8;\nvalue + easeOut(t, 0, dur, startPos, [0,0]);",
        "63. Explosive Particle Outward": "seedRandom(textIndex, true);\ndir = [random(-1,1), random(-1,1)];\nt = time - inPoint;\nvalue + (dir * 500 * Math.sin(t * 5) * Math.exp(-t * 3));",
        "64. Implosive Snap Reveal": "seedRandom(textIndex, true);\nstartPos = [random(-400,400), random(-400,400)];\nt = time - inPoint;\nvalue + (startPos * Math.exp(-t * 6));",
        "65. Slice Jump Unify": "y = (textIndex % 2 == 0 ? -200 : 200) * Math.exp(-(time-inPoint)*5);\nvalue + [0, y];",
        "66. Asymmetrical Fragment Pop": "seedRandom(textIndex, true);\nvalue + [random(-100,100), random(-200,200)] * Math.exp(-(time-inPoint)*4);",
        "67. Magnetic Attract Assembly": "t = time - inPoint;\nr = 400 * Math.exp(-t * 5);\nvalue + [Math.cos(textIndex)*r, Math.sin(textIndex)*r];",
        "68. Impact Shockwave Offset": "t = time - inPoint;\nshk = Math.sin(t * 30) * 40 * Math.exp(-t * 6);\nvalue + [shk, shk];",
        "69. Sand Dissolve Rebound": "seedRandom(textIndex, true);\nt = time - inPoint;\nvalue + [random(-50,50), random(0,200)] * Math.exp(-t * 3);",
        "70. Pixel Collapse Re-bound": "t = time - inPoint;\ns = (t < 0.3) ? 10 : 100 + 50 * Math.exp(-t*5);\n[s, s];",

        // 8. Gaming & Pop Style (71-80)
        "71. Score Elastic Popup": "t = time - inPoint;\ns = 100 + 150 * Math.sin(t * 10) * Math.exp(-t * 5);\n[s, s];",
        "72. Damage Number Float": "t = time - inPoint;\nvalue - [0, easeOut(t, 0, 0.8, 0, 150)];",
        "73. Comic Book POW Pop": "t = time - inPoint;\ns = (t < 0.1) ? easeOut(t,0,0.1,0,160) : easeOut(t,0.1,0.4,160,100);\n[s, s];",
        "74. Subscribe Button Shake": "t = time - inPoint;\nMath.sin(t * 20) * 15 * Math.exp(-t * 4);",
        "75. Level Up Banner Bounce": "t = time - inPoint;\ny = -300 * Math.sin(t * 8) * Math.exp(-t * 4);\nvalue + [0, y];",
        "76. Emoji Pulse Bump": "100 + Math.abs(Math.sin((time - inPoint) * 8)) * 30;",
        "77. Speech Bubble Snap": "t = time - inPoint;\nsx = easeOut(t, 0, 0.3, 0, 100);\nsy = easeOut(t, 0, 0.3, 0, 100) + 30 * Math.sin(t*15)*Math.exp(-t*5);\n[sx, sy];",
        "78. Arcade Combo Bounce": "t = time - inPoint;\ns = 100 + Math.abs(Math.cos(t * 12)) * 40 * Math.exp(-t * 3);\n[s, s];",
        "79. Retro 8-Bit Jump": "step = Math.floor((time - inPoint) * 12);\ny = -Math.abs(Math.sin(step * 0.5)) * 80;\nvalue + [0, y];",
        "80. Coin Collect Rise": "t = time - inPoint;\ny = -200 * (1 - Math.exp(-t * 4));\nvalue + [0, y];",

        // 9. Mathematical Procedures (81-90)
        "81. Harmonic Oscillator Physics": "m = 1; k = 80; c = 8;\nt = time - inPoint;\nw = Math.sqrt(k/m);\ndisp = Math.exp(-c*t) * Math.cos(w*t);\nvalue + [0, -200 * disp];",
        "82. Fibonacci Scale Stagger": "fib = [1, 1, 2, 3, 5, 8, 13, 21];\nidx = Math.min(Math.floor((time - inPoint) * 10), fib.length - 1);\ns = fib[idx] * 10;\n[s, s];",
        "83. Perlin Noise Position Shift": "nx = noise(time * 2) * 100;\nny = noise((time + 10) * 2) * 100;\nvalue + [nx, ny];",
        "84. Exponential Decay Bounce": "t = time - inPoint;\ny = -300 * Math.pow(0.5, t * 4) * Math.abs(Math.cos(t * 10));\nvalue + [0, y];",
        "85. Logarithmic Tracking Snap": "t = Math.max(0.01, time - inPoint);\nvalue + (200 / Math.log(t * 10 + 1));",
        "86. Modulo Index Offset Wave": "y = (textIndex % 3 == 0) ? Math.sin(time * 6) * 50 : 0;\nvalue + [0, y];",
        "87. Trigonometric Swing": "Math.tan(Math.sin(time * 3)) * 20;",
        "88. Random Seed Frequency Pop": "seedRandom(Math.floor(time * 4), true);\ns = random(80, 120);\n[s, s];",
        "89. Velocity Driven Elasticity": "v = length(velocity);\ns = v * 0.05;\n[100 + s, 100 - s];",
        "90. Fractal Noise Displacement": "n = layer('Null 1') ? 0 : Math.sin(time*10)*20;\nvalue + [n, n];",

        // 10. Minimal & Clean (91-100)
        "91. Smooth Overshoot Slide": "t = time - inPoint;\nx = easeOut(t, 0, 0.6, -400, 0) + 30 * Math.sin(t * 8) * Math.exp(-t * 4);\nvalue + [x, 0];",
        "92. Subtle Anchor Shift": "t = time - inPoint;\nvalue + [0, 50 * Math.exp(-t * 5)];",
        "93. Minimal Vertical Drop": "t = time - inPoint;\ny = easeOut(t, 0, 0.5, -100, 0);\nvalue + [0, y];",
        "94. Line Mask Unfold Elastic": "t = time - inPoint;\nsx = easeOut(t, 0, 0.4, 0, 100) + 20 * Math.sin(t * 10) * Math.exp(-t * 5);\n[sx, 100];",
        "95. Soft Tracking Expansion": "t = time - inPoint;\neaseOut(t, 0, 1, 100, 0);",
        "96. Dual-Direction Snap": "dir = (textIndex % 2 == 0) ? -1 : 1;\nt = time - inPoint;\nvalue + [dir * 200 * Math.exp(-t * 5), 0];",
        "97. Opacity Pulse Bounce": "t = time - inPoint;\neaseOut(t, 0, 0.3, 0, 100) + 30 * Math.sin(t * 12) * Math.exp(-t * 4);",
        "98. Clean Left Cascade": "t = Math.max(0, time - inPoint - textIndex * 0.04);\nx = -150 * Math.exp(-t * 6);\nvalue + [x, 0];",
        "99. Subtle Rotation Settle": "t = time - inPoint;\n15 * Math.cos(t * 5) * Math.exp(-t * 3);",
        "100. Elegant Rise Snap": "t = time - inPoint;\ny = 120 * Math.exp(-t * 4) * Math.cos(t * 6);\nvalue + [0, y];"
    };


    // ==========================================
    // UTILITY HELPERS
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
    // PRESET APPLICATION ENGINE
    // ==========================================

    function applyPresetToSelectedLayers(presetName, statusText) {
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

        var exprCode = EXPRESSION_MAP[presetName];
        if (!exprCode) {
            alert("Could not find expression code for '" + presetName + "'.", "FE-TextMaster");
            return;
        }

        app.beginUndoGroup("FE-TextMaster - Apply " + presetName);

        try {
            var count = 0;
            for (var i = 0; i < textLayers.length; i++) {
                var layer = textLayers[i];
                var textProp = layer.property("ADBE Text Properties");
                if (!textProp) continue;

                if (presetName.indexOf("Typewriter") !== -1 || presetName.indexOf("Binary Code") !== -1 || presetName.indexOf("Hex Glitch") !== -1 || presetName.indexOf("Counter Accent") !== -1 || presetName.indexOf("Coordinate Position") !== -1) {
                    var docProp = textProp.property("ADBE Text Document");
                    if (docProp && docProp.canSetExpression) {
                        docProp.expression = exprCode;
                        count++;
                    }
                } else {
                    var animators = textProp.property("ADBE Text Animators");
                    if (!animators) continue;

                    var animator = animators.addProperty("ADBE Text Animator");
                    animator.name = "FE-TextMaster: " + presetName;

                    var props = animator.property("ADBE Text Animator Properties");
                    var targetProp = null;

                    if (presetName.indexOf("Scale") !== -1 || presetName.indexOf("Stretch") !== -1 || presetName.indexOf("Pop") !== -1 || presetName.indexOf("Pulse") !== -1) {
                        targetProp = props.addProperty("ADBE Text Scale 3D");
                    } else if (presetName.indexOf("Tracking") !== -1) {
                        targetProp = props.addProperty("ADBE Text Tracking Amount");
                    } else if (presetName.indexOf("Rotation") !== -1 || presetName.indexOf("Shake") !== -1 || presetName.indexOf("Spin") !== -1 || presetName.indexOf("Swing") !== -1) {
                        targetProp = props.addProperty("ADBE Text Rotation Z");
                    } else if (presetName.indexOf("Opacity") !== -1 || presetName.indexOf("Flicker") !== -1 || presetName.indexOf("Strike") !== -1) {
                        targetProp = props.addProperty("ADBE Text Opacity");
                    } else {
                        targetProp = props.addProperty("ADBE Text Position 3D");
                    }

                    if (targetProp && targetProp.canSetExpression) {
                        targetProp.expression = exprCode;
                        count++;
                    }
                }
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
    // SPECIAL FX & UTILITIES ENGINES
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
                        "speed = 10;\n" +
                        "numChars = Math.floor((time - inPoint) * speed);\n" +
                        "cursor = (Math.floor(time * 3) % 2 == 0) ? '|' : '';\n" +
                        "value.substr(0, numChars) + cursor;";
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

        var subText = headerGroup.add("statictext", undefined, "Live Motion Preview & 100 AE Presets");
        subText.graphics.font = ScriptUI.newFont("sans-serif", "REGULAR", 9);

        var accentLine = win.add("panel", undefined, undefined);
        accentLine.alignment = ["fill", "top"];
        accentLine.height = 2;

        // --- TABBED NAVIGATION ---
        var tabbedPanel = win.add("tabbedpanel", undefined, undefined);
        tabbedPanel.alignChildren = ["fill", "top"];

        // TAB 1: 🚀 LIVE PRESET BROWSER
        var tabPresets = tabbedPanel.add("tab", undefined, "🚀 Preset Browser");
        tabPresets.orientation = "column";
        tabPresets.alignChildren = ["fill", "top"];
        tabPresets.spacing = 8;
        tabPresets.margins = 10;

        // 1. Category & Preset Selection Panel
        var selBox = tabPresets.add("panel", undefined, "Select Preset Category & Effect");
        selBox.orientation = "column";
        selBox.alignChildren = ["fill", "top"];
        selBox.spacing = 6;
        selBox.margins = 8;

        var catRow = selBox.add("group");
        catRow.orientation = "row";
        catRow.alignChildren = ["left", "center"];
        catRow.spacing = 6;
        catRow.add("statictext", undefined, "Category:").preferredSize.width = 65;
        var ddlCategory = catRow.add("dropdownlist", undefined, PRESET_CATEGORIES);
        ddlCategory.selection = 0;
        ddlCategory.alignment = ["fill", "center"];

        var presetRow = selBox.add("group");
        presetRow.orientation = "row";
        presetRow.alignChildren = ["left", "center"];
        presetRow.spacing = 6;
        presetRow.add("statictext", undefined, "Effect:").preferredSize.width = 65;
        var ddlPresets = presetRow.add("dropdownlist", undefined, PRESETS_BY_CATEGORY[PRESET_CATEGORIES[0]]);
        ddlPresets.selection = 0;
        ddlPresets.alignment = ["fill", "center"];

        // 2. LIVE DISPLAY AREA FOR PREVIEW
        var previewBox = tabPresets.add("panel", undefined, "Live Motion Preview (Auto Loop)");
        previewBox.orientation = "column";
        previewBox.alignChildren = ["fill", "top"];
        previewBox.spacing = 4;
        previewBox.margins = 8;

        // Visual Display Label showing the animated text
        var txtPreviewDisplay = previewBox.add("statictext", undefined, "FramEmpire- A Revolution of Animation", {truncate: "middle"});
        txtPreviewDisplay.alignment = ["center", "center"];
        txtPreviewDisplay.preferredSize = [340, 36];
        txtPreviewDisplay.graphics.font = ScriptUI.newFont("sans-serif", "BOLD", 11);

        try {
            var cyanPen = txtPreviewDisplay.graphics.newPen(txtPreviewDisplay.graphics.PenType.SOLID_COLOR, [0.0, 0.9, 1.0, 1], 1);
            txtPreviewDisplay.graphics.foregroundColor = cyanPen;
        } catch(eColor) {}

        // State variables for animation loop
        var animState = {
            startTime: new Date().getTime(),
            activePreset: PRESETS_BY_CATEGORY[PRESET_CATEGORIES[0]][0]
        };

        // 3. APPLY BUTTON
        var btnApplyPreset = tabPresets.add("button", undefined, "APPLY PRESET TO LAYER");
        btnApplyPreset.alignment = ["fill", "center"];
        btnApplyPreset.preferredSize.height = 32;
        btnApplyPreset.helpTip = "Applies selected text preset expression and animation to selected After Effects text layers.";

        // Update Handlers for Category & Preset Selectors
        ddlCategory.onChange = function () {
            var catName = PRESET_CATEGORIES[ddlCategory.selection.index];
            var newItems = PRESETS_BY_CATEGORY[catName] || [];
            ddlPresets.removeAll();
            for (var k = 0; k < newItems.length; k++) {
                ddlPresets.add("item", newItems[k]);
            }
            ddlPresets.selection = 0;
            if (newItems.length > 0) {
                animState.activePreset = newItems[0];
                animState.startTime = new Date().getTime();
            }
        };

        ddlPresets.onChange = function () {
            if (ddlPresets.selection) {
                animState.activePreset = ddlPresets.selection.text;
                animState.startTime = new Date().getTime();
            }
        };

        btnApplyPreset.onClick = function () {
            if (ddlPresets.selection) {
                applyPresetToSelectedLayers(ddlPresets.selection.text, statusText);
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


        // --- EVENT LISTENERS FOR OTHER TABS ---

        btnTypewriter.onClick = function () { applyTypewriterWithCursor(statusText); };
        btnMatrix.onClick = function () {
            applyPresetToSelectedLayers("22. Binary Code Matrix Reveal", statusText);
        };
        btnWiggle.onClick = function () {
            applyPresetToSelectedLayers("12. Decaying Wiggle Position", statusText);
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

        // GLOBAL CONTINUOUS ANIMATION LOOP SIMULATION ENGINE
        $.global._feAnimState = animState;
        $.global._fePreviewDisplay = txtPreviewDisplay;

        // Cancel previous task if active
        try {
            if ($.global._feTaskId) {
                app.cancelTask($.global._feTaskId);
            }
        } catch (eCancel) {}

        // Schedule continuous repeating task every 50ms (20 FPS)
        try {
            $.global._feTaskId = app.scheduleTask(
                "(function(){\n" +
                "  try {\n" +
                "    var st = $.global._feAnimState;\n" +
                "    var disp = $.global._fePreviewDisplay;\n" +
                "    if (!st || !disp) return;\n" +
                "    var sample = 'FramEmpire- A Revolution of Animation';\n" +
                "    var now = new Date().getTime();\n" +
                "    var t = ((now - st.startTime) % 2000) / 1000;\n" +
                "    var name = st.activePreset || '';\n" +
                "    if (name.indexOf('Typewriter') !== -1 || name.indexOf('Recoil') !== -1 || name.indexOf('Cursor') !== -1) {\n" +
                "      var cnt = Math.floor(t * 20);\n" +
                "      var cur = (Math.floor(t * 4) % 2 === 0) ? '|' : '';\n" +
                "      disp.text = (cnt < sample.length) ? sample.substring(0, cnt) + '|' : sample + cur;\n" +
                "    } else if (name.indexOf('Binary') !== -1 || name.indexOf('Matrix') !== -1 || name.indexOf('Code') !== -1 || name.indexOf('Hex') !== -1) {\n" +
                "      var codeChars = '01010101ABCDEFGHIJKLMNOPQRSTUVWXYZ';\n" +
                "      var p = Math.floor(t * 18);\n" +
                "      var outStr = '';\n" +
                "      for (var c = 0; c < sample.length; c++) {\n" +
                "        if (c < p) outStr += sample.charAt(c);\n" +
                "        else outStr += codeChars.charAt(Math.floor(Math.random() * codeChars.length));\n" +
                "      }\n" +
                "      disp.text = outStr;\n" +
                "    } else if (name.indexOf('Wiggle') !== -1 || name.indexOf('Jitter') !== -1 || name.indexOf('Noise') !== -1) {\n" +
                "      var pad = (Math.random() > 0.5) ? '  ' : ' ';\n" +
                "      disp.text = pad + sample;\n" +
                "    } else if (name.indexOf('Counter Accent') !== -1) {\n" +
                "      var val = Math.floor(Math.min(t / 1.5, 1) * 100);\n" +
                "      disp.text = 'FramEmpire Loading: ' + val + '%';\n" +
                "    } else if (name.indexOf('Coordinate Position') !== -1) {\n" +
                "      disp.text = 'X:' + Math.floor(200 + Math.random()*20) + ' Y:' + Math.floor(400 + Math.random()*20);\n" +
                "    } else {\n" +
                "      disp.text = sample;\n" +
                "    }\n" +
                "  } catch(e){}\n" +
                "})();",
                50,
                true
            );
        } catch (eSched) {}

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
