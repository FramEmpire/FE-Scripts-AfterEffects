/**
 * ShapeMaster v2.2 - Release Ready After Effects ExtendScript UI Panel
 * 
 * Powered by FramEmpire | www.framempire.com
 * 
 * Single-File Merged Architecture
 * Tab 1: ⚡ Strokes & Fixes (Freeze, Unfreeze, Non-Uniform Scale Fix)
 * Tab 2: 🎬 Motion & Paths (1-Click Multi-Trim, 1-Click Wipe Trim Paths, Stagger Trim Paths, Equalize Path Points)
 * Tab 3: 🎯 Auto Layout (Smart Responsive Background Box & 9-Point Anchor Point Matrix)
 */

(function (thisObj) {

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
            alert("Could not open web browser: " + e.toString(), "ShapeMaster");
        }
    }

    function isShapeLayer(layer) {
        if (!layer) return false;
        if (layer.matchName === "ADBE Vector Layer") return true;
        if (layer.property && layer.property("ADBE Root Vectors Group") !== null) return true;
        return false;
    }

    function isTextLayer(layer) {
        if (!layer) return false;
        if (layer.matchName === "ADBE Text Layer") return true;
        if (layer.property && layer.property("ADBE Text Properties") !== null) return true;
        return false;
    }

    /**
     * Recursively walks targetGroup to find all Stroke Width properties
     */
    function findStrokesRecursive(targetGroup) {
        var strokeProps = [];
        if (!targetGroup) return strokeProps;

        var startProp = targetGroup;
        if (targetGroup.property && targetGroup.property("ADBE Root Vectors Group")) {
            startProp = targetGroup.property("ADBE Root Vectors Group");
        }

        function recursiveSearch(prop) {
            if (!prop) return;

            if (prop.propertyType === PropertyType.PROPERTY) {
                if (prop.matchName === "ADBE Vector Stroke Width" || 
                    prop.matchName === "ADBE Vector Grad Stroke Width" ||
                    (prop.name === "Stroke Width" && prop.propertyValueType === PropertyValueType.OneD)) {
                    
                    var isDuplicate = false;
                    for (var i = 0; i < strokeProps.length; i++) {
                        if (strokeProps[i] === prop) {
                            isDuplicate = true;
                            break;
                        }
                    }
                    if (!isDuplicate) strokeProps.push(prop);
                }
                return;
            }

            if (prop.propertyType === PropertyType.INDEXED_GROUP || 
                prop.propertyType === PropertyType.NAMED_GROUP) {
                
                var strokeWidth = prop.property("ADBE Vector Stroke Width") || 
                                  prop.property("ADBE Vector Grad Stroke Width");
                if (strokeWidth && strokeWidth.propertyType === PropertyType.PROPERTY) {
                    var isDup = false;
                    for (var j = 0; j < strokeProps.length; j++) {
                        if (strokeProps[j] === strokeWidth) {
                            isDup = true;
                            break;
                        }
                    }
                    if (!isDup) strokeProps.push(strokeWidth);
                }

                if (prop.numProperties) {
                    for (var k = 1; k <= prop.numProperties; k++) {
                        recursiveSearch(prop.property(k));
                    }
                }
            }
        }

        recursiveSearch(startProp);
        return strokeProps;
    }


    // ==========================================
    // TAB 1: STROKES & FIXES
    // ==========================================

    function applyStrokeLock(targetGroup, mode, statusText) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select an active Composition.", "ShapeMaster");
            return;
        }

        var selectedLayers = comp.selectedLayers;
        if (!selectedLayers || selectedLayers.length === 0) {
            alert("Please select at least one Shape Layer.", "ShapeMaster");
            return;
        }

        var shapeLayers = [];
        for (var i = 0; i < selectedLayers.length; i++) {
            if (isShapeLayer(selectedLayers[i])) shapeLayers.push(selectedLayers[i]);
        }

        if (shapeLayers.length === 0) {
            alert("No Shape Layers found in current selection.", "ShapeMaster");
            return;
        }

        var actionTitle = (mode === "freeze") ? "Freeze Stroke Width" : 
                          (mode === "unfreeze") ? "Unfreeze Stroke" : "Fix Non-Uniform Scale";

        app.beginUndoGroup("ShapeMaster - " + actionTitle);

        try {
            var count = 0;
            for (var j = 0; j < shapeLayers.length; j++) {
                var strokes = findStrokesRecursive(shapeLayers[j]);
                for (var k = 0; k < strokes.length; k++) {
                    var sProp = strokes[k];
                    if (sProp && sProp.canSetExpression) {
                        if (mode === "freeze") {
                            sProp.expression = 
                                "// ShapeMaster - Freeze Stroke Width\n" +
                                "var baseWidth = value;\n" +
                                "var s = transform.scale;\n" +
                                "var scaleFactor = (s[0] + s[1]) / 2 / 100;\n" +
                                "scaleFactor != 0 ? baseWidth / scaleFactor : baseWidth;";
                            count++;
                        } else if (mode === "unfreeze") {
                            sProp.expression = "";
                            count++;
                        } else if (mode === "nonuniform") {
                            sProp.expression = 
                                "// ShapeMaster - Fix Non-Uniform Scale\n" +
                                "var baseWidth = value;\n" +
                                "var s = transform.scale;\n" +
                                "var globalSx = Math.abs(s[0]) / 100;\n" +
                                "var globalSy = Math.abs(s[1]) / 100;\n" +
                                "var p = thisLayer;\n" +
                                "while (p.hasParent) {\n" +
                                "    p = p.parent;\n" +
                                "    globalSx *= Math.abs(p.transform.scale[0]) / 100;\n" +
                                "    globalSy *= Math.abs(p.transform.scale[1]) / 100;\n" +
                                "}\n" +
                                "if (globalSx === 0) globalSx = 0.0001;\n" +
                                "if (globalSy === 0) globalSy = 0.0001;\n" +
                                "var scaleFactor = Math.sqrt(globalSx * globalSy);\n" +
                                "scaleFactor != 0 ? baseWidth / scaleFactor : baseWidth;";
                            count++;
                        }
                    }
                }
            }

            var msg = actionTitle + " applied to " + count + " stroke(s) across " + shapeLayers.length + " layer(s).";
            if (statusText) statusText.text = msg;
            alert(msg, "ShapeMaster");

        } catch (err) {
            alert("Error: " + err.toString(), "ShapeMaster");
        } finally {
            app.endUndoGroup();
        }
    }


    // ==========================================
    // TAB 2: MOTION & PATHS
    // ==========================================

    /**
     * Finds or creates a Trim Paths property group inside a Shape Layer
     */
    function getOrAddTrimPaths(shapeLayer) {
        var rootContents = shapeLayer.property("ADBE Root Vectors Group");
        if (!rootContents) return null;

        var trim = null;
        for (var i = 1; i <= rootContents.numProperties; i++) {
            var prop = rootContents.property(i);
            if (prop.matchName === "ADBE Vector Filter - Trim") {
                trim = prop;
                break;
            }
        }

        if (!trim) {
            try {
                trim = rootContents.addProperty("ADBE Vector Filter - Trim");
            } catch (e) {
                for (var j = 1; j <= rootContents.numProperties; j++) {
                    var g = rootContents.property(j);
                    if (g.matchName === "ADBE Vector Group") {
                        var gContents = g.property("ADBE Vectors Group");
                        if (gContents) {
                            trim = gContents.addProperty("ADBE Vector Filter - Trim");
                            break;
                        }
                    }
                }
            }
        }
        return trim;
    }

    /**
     * 1-Click Multi-Trim Paths Injector & Auto-Animator
     */
    function oneClickMultiTrimPaths(staggerFrames, statusText) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select an active Composition.", "ShapeMaster");
            return;
        }

        var selectedLayers = comp.selectedLayers;
        var shapeLayers = [];
        for (var s = 0; s < selectedLayers.length; s++) {
            if (isShapeLayer(selectedLayers[s])) shapeLayers.push(selectedLayers[s]);
        }

        if (shapeLayers.length === 0) {
            alert("Please select at least one Shape Layer.", "ShapeMaster");
            return;
        }

        app.beginUndoGroup("ShapeMaster - 1-Click Multi-Trim Paths");

        try {
            var currentTime = comp.time;
            var fps = comp.frameDuration;
            var durationSeconds = 30 * fps;
            var staggerSeconds = (staggerFrames || 2) * fps;
            var count = 0;

            for (var i = 0; i < shapeLayers.length; i++) {
                var layer = shapeLayers[i];
                var trimGroup = getOrAddTrimPaths(layer);

                if (trimGroup) {
                    var endProp = trimGroup.property("ADBE Vector Trim End");
                    if (endProp) {
                        var t1 = currentTime + (i * staggerSeconds);
                        var t2 = t1 + durationSeconds;

                        var k1 = endProp.addKey(t1);
                        endProp.setValueAtKey(k1, 0);

                        var k2 = endProp.addKey(t2);
                        endProp.setValueAtKey(k2, 100);

                        try {
                            var easeIn = new KeyframeEase(0, 33.33);
                            var easeOut = new KeyframeEase(0, 33.33);
                            endProp.setTemporalEaseAtKey(k1, [easeIn], [easeOut]);
                            endProp.setTemporalEaseAtKey(k2, [easeIn], [easeOut]);
                        } catch (eEase) {}

                        count++;
                    }
                }
            }

            var msg = "Injected & Easy-Eased Trim Paths on " + count + " shape layer(s) (" + staggerFrames + "-frame stagger).";
            if (statusText) statusText.text = msg;
            alert(msg, "ShapeMaster");

        } catch (err) {
            alert("Error running 1-Click Multi-Trim Paths: " + err.toString(), "ShapeMaster");
        } finally {
            app.endUndoGroup();
        }
    }

    /**
     * 1-Click Wipe Trim Paths (Auto Start/End Offset Animation)
     * End: 0% at t0 -> 100% at t0+30f
     * Start: 0% at t0+10f -> 100% at t0+40f
     * All 4 keyframes Easy Eased with optional layer staggering.
     */
    function oneClickWipeTrimPaths(staggerFrames, statusText) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select an active Composition.", "ShapeMaster");
            return;
        }

        var selectedLayers = comp.selectedLayers;
        var shapeLayers = [];
        for (var s = 0; s < selectedLayers.length; s++) {
            if (isShapeLayer(selectedLayers[s])) shapeLayers.push(selectedLayers[s]);
        }

        if (shapeLayers.length === 0) {
            alert("Please select at least one Shape Layer.", "ShapeMaster");
            return;
        }

        app.beginUndoGroup("ShapeMaster - 1-Click Wipe Trim Paths");

        try {
            var currentTime = comp.time;
            var fps = comp.frameDuration;
            var staggerSeconds = (staggerFrames || 2) * fps;
            var count = 0;

            for (var i = 0; i < shapeLayers.length; i++) {
                var layer = shapeLayers[i];
                var trimGroup = getOrAddTrimPaths(layer);

                if (trimGroup) {
                    var startProp = trimGroup.property("ADBE Vector Trim Start");
                    var endProp = trimGroup.property("ADBE Vector Trim End");

                    if (startProp && endProp) {
                        var t0 = currentTime + (i * staggerSeconds);

                        // 1. End Property (0% at t0, 100% at t0 + 30f)
                        var kEnd1 = endProp.addKey(t0);
                        endProp.setValueAtKey(kEnd1, 0);

                        var kEnd2 = endProp.addKey(t0 + (30 * fps));
                        endProp.setValueAtKey(kEnd2, 100);

                        // 2. Start Property (0% at t0 + 10f, 100% at t0 + 40f)
                        var kStart1 = startProp.addKey(t0 + (10 * fps));
                        startProp.setValueAtKey(kStart1, 0);

                        var kStart2 = startProp.addKey(t0 + (40 * fps));
                        startProp.setValueAtKey(kStart2, 100);

                        // 3. Apply Easy Ease on all 4 keyframes
                        try {
                            var easeIn = new KeyframeEase(0, 33.33);
                            var easeOut = new KeyframeEase(0, 33.33);

                            endProp.setTemporalEaseAtKey(kEnd1, [easeIn], [easeOut]);
                            endProp.setTemporalEaseAtKey(kEnd2, [easeIn], [easeOut]);

                            startProp.setTemporalEaseAtKey(kStart1, [easeIn], [easeOut]);
                            startProp.setTemporalEaseAtKey(kStart2, [easeIn], [easeOut]);
                        } catch (eEase) {}

                        count++;
                    }
                }
            }

            var msg = "Injected Wipe Trim Paths (4 Keyframes + Easy Ease) on " + count + " layer(s).";
            if (statusText) statusText.text = msg;
            alert(msg, "ShapeMaster");

        } catch (err) {
            alert("Error running 1-Click Wipe Trim Paths: " + err.toString(), "ShapeMaster");
        } finally {
            app.endUndoGroup();
        }
    }

    /**
     * Offsets existing Trim Paths keyframes across selected shape layers
     */
    function staggerTrimPaths(frameDelay, statusText) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select an active Composition.", "ShapeMaster");
            return;
        }

        var selectedLayers = comp.selectedLayers;
        if (!selectedLayers || selectedLayers.length === 0) {
            alert("Please select shape layers containing Trim Paths.", "ShapeMaster");
            return;
        }

        app.beginUndoGroup("ShapeMaster - Stagger Trim Paths");

        try {
            var fps = comp.frameDuration;
            var timeOffsetStep = frameDelay * fps;
            var totalStaggered = 0;

            for (var l = 0; l < selectedLayers.length; l++) {
                var layer = selectedLayers[l];
                if (!isShapeLayer(layer)) continue;

                var rootGroup = layer.property("ADBE Root Vectors Group");
                if (!rootGroup) continue;

                var trimGroups = [];
                function findTrims(group) {
                    if (!group) return;
                    if (group.matchName === "ADBE Vector Filter - Trim") {
                        trimGroups.push(group);
                        return;
                    }
                    if (group.propertyType === PropertyType.INDEXED_GROUP || group.propertyType === PropertyType.NAMED_GROUP) {
                        if (group.numProperties) {
                            for (var i = 1; i <= group.numProperties; i++) {
                                findTrims(group.property(i));
                            }
                        }
                    }
                }
                findTrims(rootGroup);

                for (var t = 0; t < trimGroups.length; t++) {
                    var trim = trimGroups[t];
                    var startProp = trim.property("ADBE Vector Trim Start");
                    var endProp = trim.property("ADBE Vector Trim End");
                    var offsetProp = trim.property("ADBE Vector Trim Offset");

                    var propsToStagger = [startProp, endProp, offsetProp];
                    var layerOffsetTime = l * timeOffsetStep;

                    for (var p = 0; p < propsToStagger.length; p++) {
                        var prop = propsToStagger[p];
                        if (prop && prop.numKeys > 0) {
                            for (var k = prop.numKeys; k >= 1; k--) {
                                var oldTime = prop.keyTime(k);
                                var val = prop.keyValue(k);
                                var inInterp = prop.keyInInterpolationType(k);
                                var outInterp = prop.keyOutInterpolationType(k);

                                prop.removeKey(k);
                                var newKeyIdx = prop.addKey(oldTime + layerOffsetTime);
                                prop.setValueAtKey(newKeyIdx, val);
                                prop.setInterpolationTypeAtKey(newKeyIdx, inInterp, outInterp);
                            }
                            totalStaggered++;
                        }
                    }
                }

                if (trimGroups.length > 0 && totalStaggered === 0) {
                    layer.startTime = layer.startTime + (l * timeOffsetStep);
                    totalStaggered++;
                }
            }

            var msg = "Staggered Trim Paths across " + selectedLayers.length + " layer(s) with " + frameDelay + " frame delay.";
            if (statusText) statusText.text = msg;
            alert(msg, "ShapeMaster");

        } catch (err) {
            alert("Error staggering trim paths: " + err.toString(), "ShapeMaster");
        } finally {
            app.endUndoGroup();
        }
    }

    /**
     * Equalizes path points across shapes for morphing
     */
    function equalizePathPoints(statusText) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select an active Composition.", "ShapeMaster");
            return;
        }

        var selectedLayers = comp.selectedLayers;
        if (!selectedLayers || selectedLayers.length === 0) {
            alert("Please select shape layers to equalize path points.", "ShapeMaster");
            return;
        }

        app.beginUndoGroup("ShapeMaster - Equalize Path Points");

        try {
            var pathProps = [];

            function findPaths(group) {
                if (!group) return;
                if (group.propertyType === PropertyType.PROPERTY && group.propertyValueType === PropertyValueType.SHAPE) {
                    pathProps.push(group);
                    return;
                }
                if (group.propertyType === PropertyType.INDEXED_GROUP || group.propertyType === PropertyType.NAMED_GROUP) {
                    if (group.numProperties) {
                        for (var i = 1; i <= group.numProperties; i++) {
                            findPaths(group.property(i));
                        }
                    }
                }
            }

            for (var l = 0; l < selectedLayers.length; l++) {
                if (isShapeLayer(selectedLayers[l])) {
                    findPaths(selectedLayers[l].property("ADBE Root Vectors Group"));
                }
            }

            if (pathProps.length < 2) {
                alert("Please select at least 2 shape paths across layers to equalize.", "ShapeMaster");
                return;
            }

            var maxCount = 0;
            for (var p = 0; p < pathProps.length; p++) {
                var shp = pathProps[p].value;
                if (shp && shp.vertices) {
                    if (shp.vertices.length > maxCount) maxCount = shp.vertices.length;
                }
            }

            if (maxCount === 0) {
                alert("No valid vector path data found.", "ShapeMaster");
                return;
            }

            var equalizedPaths = 0;
            for (var i = 0; i < pathProps.length; i++) {
                var prop = pathProps[i];
                var origShape = prop.value;
                if (!origShape || !origShape.vertices) continue;

                var vCount = origShape.vertices.length;
                if (vCount < maxCount) {
                    var newShape = subdivideShape(origShape, maxCount);
                    prop.setValue(newShape);
                    equalizedPaths++;
                }
            }

            var msg = "Equalized " + pathProps.length + " path(s) to match target vertex count (" + maxCount + " vertices).";
            if (statusText) statusText.text = msg;
            alert(msg, "ShapeMaster");

        } catch (err) {
            alert("Error equalizing path points: " + err.toString(), "ShapeMaster");
        } finally {
            app.endUndoGroup();
        }
    }

    function subdivideShape(origShape, targetCount) {
        var verts = origShape.vertices.slice(0);
        var inT = origShape.inTangents.slice(0);
        var outT = origShape.outTangents.slice(0);

        while (verts.length < targetCount) {
            var newVerts = [];
            var newInT = [];
            var newOutT = [];
            var len = verts.length;

            for (var i = 0; i < len; i++) {
                var nextIdx = (i + 1) % len;
                var p1 = verts[i];
                var p2 = verts[nextIdx];

                newVerts.push(p1);
                newInT.push(inT[i]);
                newOutT.push(outT[i]);

                if (newVerts.length < targetCount) {
                    var mid = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
                    newVerts.push(mid);
                    newInT.push([0, 0]);
                    newOutT.push([0, 0]);
                }
            }

            verts = newVerts;
            inT = newInT;
            outT = newOutT;
        }

        var resShape = new Shape();
        resShape.vertices = verts.slice(0, targetCount);
        resShape.inTangents = inT.slice(0, targetCount);
        resShape.outTangents = outT.slice(0, targetCount);
        resShape.closed = origShape.closed;
        return resShape;
    }


    // ==========================================
    // TAB 3: AUTO LAYOUT & ANCHOR MATRIX
    // ==========================================

    function createSmartAutoBackground(statusText) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select an active Composition.", "ShapeMaster");
            return;
        }

        var selectedLayers = comp.selectedLayers;
        if (!selectedLayers || selectedLayers.length === 0) {
            alert("Please select a Text Layer (or Text Layer + Shape Layer).", "ShapeMaster");
            return;
        }

        app.beginUndoGroup("ShapeMaster - Smart Auto-Background Box");

        try {
            var textLayer = null;
            var shapeLayer = null;

            for (var i = 0; i < selectedLayers.length; i++) {
                if (isTextLayer(selectedLayers[i]) && !textLayer) {
                    textLayer = selectedLayers[i];
                } else if (isShapeLayer(selectedLayers[i]) && !shapeLayer) {
                    shapeLayer = selectedLayers[i];
                }
            }

            if (!textLayer) {
                alert("Please select at least one Text Layer.", "ShapeMaster");
                return;
            }

            if (!shapeLayer) {
                shapeLayer = comp.layers.addShape();
                shapeLayer.name = textLayer.name + " - BG Box";
                shapeLayer.moveAfter(textLayer);

                var rootGroup = shapeLayer.property("ADBE Root Vectors Group");
                var rectGroup = rootGroup.addProperty("ADBE Vector Group");
                rectGroup.name = "BG Rectangle";

                var rectContents = rectGroup.property("ADBE Vectors Group");
                rectContents.addProperty("ADBE Vector Shape - Rect");
                var fill = rectContents.addProperty("ADBE Vector Graphic - Fill");
                fill.property("ADBE Vector Fill Color").setValue([0.1, 0.1, 0.1, 1]);
            }

            var rootContents = shapeLayer.property("ADBE Root Vectors Group");
            var rectSizeProp = null;
            var rectPosProp = null;

            function findRectProps(group) {
                if (!group) return;
                if (group.matchName === "ADBE Vector Shape - Rect") {
                    rectSizeProp = group.property("ADBE Vector Rect Size");
                    rectPosProp = group.property("ADBE Vector Rect Position");
                    return;
                }
                if (group.propertyType === PropertyType.INDEXED_GROUP || group.propertyType === PropertyType.NAMED_GROUP) {
                    if (group.numProperties) {
                        for (var k = 1; k <= group.numProperties; k++) {
                            findRectProps(group.property(k));
                        }
                    }
                }
            }

            findRectProps(rootContents);

            if (rectSizeProp && rectSizeProp.canSetExpression) {
                rectSizeProp.expression = 
                    "// Smart Auto-Background Size\n" +
                    "var padding = [40, 24];\n" +
                    "var tLayer;\n" +
                    "try { tLayer = thisComp.layer(\"" + textLayer.name + "\"); } catch(e) { tLayer = null; }\n" +
                    "if (tLayer) {\n" +
                    "    var r = tLayer.sourceRectAtTime(time, false);\n" +
                    "    [r.width + padding[0], r.height + padding[1]];\n" +
                    "} else { value; }";
            }

            if (rectPosProp && rectPosProp.canSetExpression) {
                rectPosProp.expression = 
                    "// Smart Auto-Background Position\n" +
                    "var tLayer;\n" +
                    "try { tLayer = thisComp.layer(\"" + textLayer.name + "\"); } catch(e) { tLayer = null; }\n" +
                    "if (tLayer) {\n" +
                    "    var r = tLayer.sourceRectAtTime(time, false);\n" +
                    "    [r.left + r.width / 2, r.top + r.height / 2];\n" +
                    "} else { value; }";
            }

            if (shapeLayer.transform.position.canSetExpression) {
                shapeLayer.transform.position.expression = 
                    "thisComp.layer(\"" + textLayer.name + "\").transform.position;";
            }

            var msg = "Created responsive Auto-Background Box linked to '" + textLayer.name + "'.";
            if (statusText) statusText.text = msg;
            alert(msg, "ShapeMaster");

        } catch (err) {
            alert("Error creating auto-background: " + err.toString(), "ShapeMaster");
        } finally {
            app.endUndoGroup();
        }
    }

    function setAnchorPointPosition(xAlign, yAlign, statusText) {
        var comp = app.project.activeItem;
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select an active Composition.", "ShapeMaster");
            return;
        }

        var selectedLayers = comp.selectedLayers;
        if (!selectedLayers || selectedLayers.length === 0) {
            alert("Please select at least one layer.", "ShapeMaster");
            return;
        }

        var labelPos = yAlign.toUpperCase() + "-" + xAlign.toUpperCase();
        app.beginUndoGroup("ShapeMaster - Set Anchor Point (" + labelPos + ")");

        try {
            var t = comp.time;
            var count = 0;

            for (var i = 0; i < selectedLayers.length; i++) {
                var layer = selectedLayers[i];
                var rect = layer.sourceRectAtTime(t, false);
                if (rect.width === 0 && rect.height === 0) continue;

                var targetX = rect.left;
                if (xAlign === "center") targetX = rect.left + rect.width / 2;
                else if (xAlign === "right") targetX = rect.left + rect.width;

                var targetY = rect.top;
                if (yAlign === "center") targetY = rect.top + rect.height / 2;
                else if (yAlign === "bottom") targetY = rect.top + rect.height;

                var newAnchor = [targetX, targetY];
                if (layer.threeDLayer) newAnchor.push(0);

                var curAnchor = layer.transform.anchorPoint.value;
                var delta = [newAnchor[0] - curAnchor[0], newAnchor[1] - curAnchor[1]];
                if (layer.threeDLayer && curAnchor.length > 2) {
                    delta.push(newAnchor[2] - (curAnchor[2] || 0));
                }

                layer.transform.anchorPoint.setValue(newAnchor);

                var curPos = layer.transform.position.value;
                var rot = layer.transform.rotation ? layer.transform.rotation.value : 0;
                var scale = layer.transform.scale.value;

                var scaledDelta = [
                    delta[0] * (scale[0] / 100),
                    delta[1] * (scale[1] / 100)
                ];

                var rad = rot * Math.PI / 180;
                var rotatedDelta = [
                    scaledDelta[0] * Math.cos(rad) - scaledDelta[1] * Math.sin(rad),
                    scaledDelta[0] * Math.sin(rad) + scaledDelta[1] * Math.cos(rad)
                ];

                if (layer.transform.position.dimensionsSeparated) {
                    var px = layer.transform.xPosition.value;
                    var py = layer.transform.yPosition.value;
                    layer.transform.xPosition.setValue(px + rotatedDelta[0]);
                    layer.transform.yPosition.setValue(py + rotatedDelta[1]);
                } else {
                    var newPos = [curPos[0] + rotatedDelta[0], curPos[1] + rotatedDelta[1]];
                    if (layer.threeDLayer && curPos.length > 2) {
                        newPos.push(curPos[2] + (scaledDelta[2] || 0));
                    }
                    layer.transform.position.setValue(newPos);
                }
                count++;
            }

            var msg = "Set Anchor Point (" + labelPos + ") on " + count + " layer(s).";
            if (statusText) statusText.text = msg;

        } catch (err) {
            alert("Error setting anchor point: " + err.toString(), "ShapeMaster");
        } finally {
            app.endUndoGroup();
        }
    }


    // ==========================================
    // SCRIPTUI LAYOUT & INTERFACE BUILDER
    // ==========================================

    function buildUI(thisObj) {
        var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "ShapeMaster", undefined, {resizeable: true});

        win.orientation = "column";
        win.alignChildren = ["fill", "top"];
        win.spacing = 8;
        win.margins = 10;

        // Dark Mode Aesthetic Background (#232323)
        try {
            var darkBrush = win.graphics.newBrush(win.graphics.BrushType.SOLID_COLOR, [0.137, 0.137, 0.137, 1]);
            win.graphics.backgroundColor = darkBrush;
        } catch (e) {}

        // --- TITLE HEADER ---
        var headerGroup = win.add("group");
        headerGroup.orientation = "column";
        headerGroup.alignChildren = ["center", "center"];
        headerGroup.spacing = 2;

        var titleText = headerGroup.add("statictext", undefined, "SHAPEMASTER");
        titleText.graphics.font = ScriptUI.newFont("sans-serif", "BOLD", 15);

        var subText = headerGroup.add("statictext", undefined, "Shape & Motion Engine");
        subText.graphics.font = ScriptUI.newFont("sans-serif", "REGULAR", 9);

        var accentLine = win.add("panel", undefined, undefined);
        accentLine.alignment = ["fill", "top"];
        accentLine.height = 2;

        // --- TABBED NAVIGATION PANEL ---
        var tabbedPanel = win.add("tabbedpanel", undefined, undefined);
        tabbedPanel.alignChildren = ["fill", "top"];

        // TAB 1: ⚡ STROKES & FIXES
        var tabStrokes = tabbedPanel.add("tab", undefined, "⚡ Strokes & Fixes");
        tabStrokes.orientation = "column";
        tabStrokes.alignChildren = ["fill", "top"];
        tabStrokes.spacing = 8;
        tabStrokes.margins = 10;

        var btnFreeze = tabStrokes.add("button", undefined, "Freeze Stroke Width");
        btnFreeze.helpTip = "Inverses stroke width relative to layer scale so stroke thickness remains constant.";

        var btnUnfreeze = tabStrokes.add("button", undefined, "Unfreeze Stroke");
        btnUnfreeze.helpTip = "Removes scaling expressions from stroke properties.";

        var btnNonUniform = tabStrokes.add("button", undefined, "Fix Non-Uniform Scale");
        btnNonUniform.helpTip = "Compensates for asymmetric X/Y scale distortion across layer hierarchies.";

        // TAB 2: 🎬 MOTION & PATHS
        var tabMotion = tabbedPanel.add("tab", undefined, "🎬 Motion & Paths");
        tabMotion.orientation = "column";
        tabMotion.alignChildren = ["fill", "top"];
        tabMotion.spacing = 8;
        tabMotion.margins = 10;

        var btnMultiTrim = tabMotion.add("button", undefined, "1-Click Multi-Trim Paths");
        btnMultiTrim.helpTip = "Adds Trim Paths to selected shape layers, animates End (0%->100%, 30 frames, Easy Ease), & staggers layer timing.";

        var btnWipeTrim = tabMotion.add("button", undefined, "1-Click Wipe Trim Paths");
        btnWipeTrim.helpTip = "Adds Trim Paths with 4-keyframe Wipe (End 0%->100%, Start 0%->100% delayed 10f + Easy Ease).";

        // Stagger Offset Input Row
        var staggerRow = tabMotion.add("group");
        staggerRow.orientation = "row";
        staggerRow.alignChildren = ["left", "center"];
        staggerRow.spacing = 4;

        var lblStagger = staggerRow.add("statictext", undefined, "Stagger Offset:");
        var txtStagger = staggerRow.add("edittext", undefined, "2");
        txtStagger.preferredSize.width = 32;
        var lblFrames = staggerRow.add("statictext", undefined, "frames");

        var btnStaggerTrim = tabMotion.add("button", undefined, "Stagger Trim Paths");
        btnStaggerTrim.helpTip = "Offsets existing Trim Paths keyframes across selected shape layers by frame delay.";

        var btnEqualize = tabMotion.add("button", undefined, "Equalize Path Points (Morph Prep)");
        btnEqualize.helpTip = "Subdivides path vertices across shapes so vertex counts match for smooth morphing.";

        // TAB 3: 🎯 AUTO LAYOUT
        var tabAutoLayout = tabbedPanel.add("tab", undefined, "🎯 Auto Layout");
        tabAutoLayout.orientation = "column";
        tabAutoLayout.alignChildren = ["fill", "top"];
        tabAutoLayout.spacing = 8;
        tabAutoLayout.margins = 10;

        var btnAutoBG = tabAutoLayout.add("button", undefined, "Smart Auto-Background Box");
        btnAutoBG.helpTip = "Creates/links a responsive shape background box that auto-resizes around text layer.";

        var anchorBox = tabAutoLayout.add("panel", undefined, "Anchor Point Matrix");
        anchorBox.orientation = "column";
        anchorBox.alignChildren = ["center", "top"];
        anchorBox.spacing = 4;
        anchorBox.margins = 8;

        var row1 = anchorBox.add("group");
        row1.orientation = "row";
        row1.spacing = 4;
        var btnTL = row1.add("button", [0,0,50,24], "◤ TL");
        var btnTC = row1.add("button", [0,0,50,24], "▲ TC");
        var btnTR = row1.add("button", [0,0,50,24], "◥ TR");

        var row2 = anchorBox.add("group");
        row2.orientation = "row";
        row2.spacing = 4;
        var btnML = row2.add("button", [0,0,50,24], "◀ ML");
        var btnC  = row2.add("button", [0,0,50,24], "● Center");
        var btnMR = row2.add("button", [0,0,50,24], "▶ MR");

        var row3 = anchorBox.add("group");
        row3.orientation = "row";
        row3.spacing = 4;
        var btnBL = row3.add("button", [0,0,50,24], "◣ BL");
        var btnBC = row3.add("button", [0,0,50,24], "▼ BC");
        var btnBR = row3.add("button", [0,0,50,24], "◢ BR");

        // --- STATUS FOOTER ---
        var statusGroup = win.add("group");
        statusGroup.orientation = "column";
        statusGroup.alignChildren = ["center", "center"];
        
        var statusText = statusGroup.add("statictext", undefined, "Ready", {truncate: "end"});
        statusText.graphics.font = ScriptUI.newFont("sans-serif", "ITALIC", 9);

        var divider = win.add("panel", undefined, undefined);
        divider.alignment = ["fill", "top"];
        divider.height = 1;

        // --- BRAND FOOTER (FramEmpire Integration) ---
        var brandGroup = win.add("group");
        brandGroup.orientation = "row";
        brandGroup.alignChildren = ["center", "center"];
        brandGroup.margins = [0, 2, 0, 2];

        var brandBtn = brandGroup.add("button", undefined, "Powered by FramEmpire  |  www.framempire.com");
        brandBtn.helpTip = "Click to visit www.framempire.com";

        // EVENT LISTENERS - TAB 1: STROKES & FIXES
        btnFreeze.onClick = function () { applyStrokeLock(null, "freeze", statusText); };
        btnUnfreeze.onClick = function () { applyStrokeLock(null, "unfreeze", statusText); };
        btnNonUniform.onClick = function () { applyStrokeLock(null, "nonuniform", statusText); };

        // EVENT LISTENERS - TAB 2: MOTION & PATHS
        btnMultiTrim.onClick = function () {
            var delay = parseInt(txtStagger.text, 10);
            if (isNaN(delay)) delay = 2;
            oneClickMultiTrimPaths(delay, statusText);
        };

        btnWipeTrim.onClick = function () {
            var delay = parseInt(txtStagger.text, 10);
            if (isNaN(delay)) delay = 2;
            oneClickWipeTrimPaths(delay, statusText);
        };

        btnStaggerTrim.onClick = function () {
            var delay = parseInt(txtStagger.text, 10);
            if (isNaN(delay)) delay = 2;
            staggerTrimPaths(delay, statusText);
        };

        btnEqualize.onClick = function () { equalizePathPoints(statusText); };

        // EVENT LISTENERS - TAB 3: AUTO LAYOUT
        btnAutoBG.onClick = function () { createSmartAutoBackground(statusText); };

        btnTL.onClick = function () { setAnchorPointPosition("left", "top", statusText); };
        btnTC.onClick = function () { setAnchorPointPosition("center", "top", statusText); };
        btnTR.onClick = function () { setAnchorPointPosition("right", "top", statusText); };
        btnML.onClick = function () { setAnchorPointPosition("left", "center", statusText); };
        btnC.onClick  = function () { setAnchorPointPosition("center", "center", statusText); };
        btnMR.onClick = function () { setAnchorPointPosition("right", "center", statusText); };
        btnBL.onClick = function () { setAnchorPointPosition("left", "bottom", statusText); };
        btnBC.onClick = function () { setAnchorPointPosition("center", "bottom", statusText); };
        btnBR.onClick = function () { setAnchorPointPosition("right", "bottom", statusText); };

        // BRAND FOOTER EVENT LISTENER
        brandBtn.onClick = function () {
            openWebPage("https://www.framempire.com");
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
