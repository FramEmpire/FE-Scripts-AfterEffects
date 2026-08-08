/**
 * Smart Stroke Scaler v1.0 - After Effects ExtendScript UI Panel
 * 
 * Features:
 * 1. Freeze Stroke Width: Inverses stroke width relative to layer scale so stroke width stays constant.
 * 2. Unfreeze Stroke: Removes expressions from nested stroke width properties.
 * 3. Fix Distortion (Non-Uniform): Compensates for asymmetric X/Y scaling distortion.
 * 
 * Target: Adobe After Effects CS6 and CC versions
 */

(function (thisObj) {

    /**
     * Recursively parses targetGroup (Shape Layer or PropertyGroup) to find all Stroke Width properties.
     * Walks down ADBE Vector Group, ADBE Vector Shape, ADBE Vector Graphic - Stroke, ADBE Vector Graphic - Grad Stroke, etc.
     * 
     * @param {PropertyGroup|Layer} targetGroup - Root vectors group or nested group/layer to search
     * @returns {Array} Array of located Stroke Width Property objects
     */
    function findAndApplyStrokes(targetGroup) {
        var strokeProps = [];

        if (!targetGroup) return strokeProps;

        // If targetGroup is a Layer, start at its root vectors group ("Contents")
        var startProp = targetGroup;
        if (targetGroup.property && targetGroup.property("ADBE Root Vectors Group")) {
            startProp = targetGroup.property("ADBE Root Vectors Group");
        }

        function recursiveSearch(prop) {
            if (!prop) return;

            // Check if property is a Stroke Width property
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
                    if (!isDuplicate) {
                        strokeProps.push(prop);
                    }
                }
                return;
            }

            // Check if property is a Group (INDEXED_GROUP or NAMED_GROUP)
            if (prop.propertyType === PropertyType.INDEXED_GROUP || 
                prop.propertyType === PropertyType.NAMED_GROUP) {
                
                // Directly check for stroke width child property in stroke group
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
                    if (!isDup) {
                        strokeProps.push(strokeWidth);
                    }
                }

                // Crawl all child properties recursively
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

    /**
     * Helper to verify if a layer is a Shape Layer
     */
    function isShapeLayer(layer) {
        if (!layer) return false;
        if (layer.matchName === "ADBE Vector Layer") return true;
        if (layer.property && layer.property("ADBE Root Vectors Group") !== null) return true;
        return false;
    }

    /**
     * Processes selected shape layers based on mode ('freeze', 'unfreeze', 'nonuniform')
     */
    function processSelectedLayers(mode, statusLabel) {
        var comp = app.project.activeItem;

        // 1. Check Active Comp
        if (!comp || !(comp instanceof CompItem)) {
            alert("Please select an active Composition with Shape Layers.", "Smart Stroke Scaler");
            if (statusLabel) statusLabel.text = "Error: No active composition.";
            return;
        }

        // 2. Check Layer Selection
        var selectedLayers = comp.selectedLayers;
        if (!selectedLayers || selectedLayers.length === 0) {
            alert("Please select at least one Shape Layer in your composition.", "Smart Stroke Scaler");
            if (statusLabel) statusLabel.text = "Error: No layers selected.";
            return;
        }

        // 3. Filter Shape Layers
        var shapeLayers = [];
        for (var i = 0; i < selectedLayers.length; i++) {
            if (isShapeLayer(selectedLayers[i])) {
                shapeLayers.push(selectedLayers[i]);
            }
        }

        if (shapeLayers.length === 0) {
            alert("None of the selected layers are Shape Layers.\nPlease select one or more Shape Layers.", "Smart Stroke Scaler");
            if (statusLabel) statusLabel.text = "Error: No Shape Layers in selection.";
            return;
        }

        // 4. Undo Group & Execution
        var undoTitle = "";
        if (mode === "freeze") undoTitle = "Freeze Stroke Width";
        else if (mode === "unfreeze") undoTitle = "Unfreeze Stroke";
        else if (mode === "nonuniform") undoTitle = "Fix Non-Uniform Stroke Distortion";

        app.beginUndoGroup("Smart Stroke Scaler: " + undoTitle);

        try {
            var totalStrokesProcessed = 0;

            for (var j = 0; j < shapeLayers.length; j++) {
                var sLayer = shapeLayers[j];
                var strokes = findAndApplyStrokes(sLayer);

                for (var k = 0; k < strokes.length; k++) {
                    var strokeProp = strokes[k];
                    if (strokeProp && strokeProp.canSetExpression) {
                        if (mode === "freeze") {
                            // Freeze expression linking stroke width inversely to transform scale
                            strokeProp.expression = 
                                "// Smart Stroke Scaler - Freeze\n" +
                                "var baseWidth = value;\n" +
                                "var s = transform.scale;\n" +
                                "var scaleFactor = (s[0] + s[1]) / 2 / 100;\n" +
                                "scaleFactor != 0 ? baseWidth / scaleFactor : baseWidth;";
                            totalStrokesProcessed++;
                        } else if (mode === "unfreeze") {
                            // Clear injected expression
                            strokeProp.expression = "";
                            totalStrokesProcessed++;
                        } else if (mode === "nonuniform") {
                            // Non-uniform scaling expression fixing asymmetric X/Y distortion
                            strokeProp.expression = 
                                "// Smart Stroke Scaler - Non-Uniform Fix\n" +
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
                            totalStrokesProcessed++;
                        }
                    }
                }
            }

            var msg = "";
            if (totalStrokesProcessed === 0) {
                msg = "No stroke properties found in selected Shape Layer(s).";
                alert(msg, "Smart Stroke Scaler");
            } else {
                msg = undoTitle + " applied to " + totalStrokesProcessed + " stroke(s) across " + shapeLayers.length + " layer(s).";
            }
            if (statusLabel) statusLabel.text = msg;

        } catch (err) {
            alert("Error running Smart Stroke Scaler:\n" + err.toString(), "Smart Stroke Scaler");
            if (statusLabel) statusLabel.text = "Error: " + err.toString();
        } finally {
            app.endUndoGroup();
        }
    }

    /**
     * Builds and renders the ScriptUI dockable panel interface
     */
    function buildUI(thisObj) {
        var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Smart Stroke Scaler", undefined, {resizeable: true});

        myPanel.orientation = "column";
        myPanel.alignChildren = ["fill", "top"];
        myPanel.spacing = 10;
        myPanel.margins = 12;

        // Title Header Section
        var headerGroup = myPanel.add("group");
        headerGroup.orientation = "column";
        headerGroup.alignChildren = ["center", "center"];
        headerGroup.spacing = 2;

        var titleLabel = headerGroup.add("statictext", undefined, "Smart Stroke Scaler");
        titleLabel.graphics.font = ScriptUI.newFont("sans-serif", "BOLD", 13);

        var subLabel = headerGroup.add("statictext", undefined, "Shape Layer Stroke Width Manager");
        subLabel.graphics.font = ScriptUI.newFont("sans-serif", "REGULAR", 10);

        // Separator
        var divider = myPanel.add("panel", undefined, undefined);
        divider.alignment = ["fill", "top"];
        divider.height = 1;

        // Buttons Group
        var btnGroup = myPanel.add("group");
        btnGroup.orientation = "column";
        btnGroup.alignChildren = ["fill", "top"];
        btnGroup.spacing = 8;

        var btnFreeze = btnGroup.add("button", undefined, "Freeze Stroke Width");
        btnFreeze.helpTip = "Inverses stroke width relative to layer scale so stroke width remains constant during scaling.";

        var btnUnfreeze = btnGroup.add("button", undefined, "Unfreeze Stroke");
        btnUnfreeze.helpTip = "Removes expressions from stroke width properties, restoring native AE scaling behavior.";

        var btnFixDistortion = btnGroup.add("button", undefined, "Fix Distortion (Non-Uniform)");
        btnFixDistortion.helpTip = "Handles asymmetric X/Y scaling to maintain uniform stroke appearance across non-uniform bounds.";

        // Footer / Status Bar
        var footerGroup = myPanel.add("group");
        footerGroup.orientation = "column";
        footerGroup.alignChildren = ["center", "center"];

        var statusLabel = footerGroup.add("statictext", undefined, "Select shape layers & choose an action", {truncate: "end"});
        statusLabel.graphics.font = ScriptUI.newFont("sans-serif", "ITALIC", 10);

        // Event Listeners
        btnFreeze.onClick = function () {
            processSelectedLayers("freeze", statusLabel);
        };

        btnUnfreeze.onClick = function () {
            processSelectedLayers("unfreeze", statusLabel);
        };

        btnFixDistortion.onClick = function () {
            processSelectedLayers("nonuniform", statusLabel);
        };

        myPanel.onResize = function () {
            myPanel.layout.resize();
        };

        myPanel.layout.layout(true);
        return myPanel;
    }

    // Instantiate and show panel
    var scriptPanel = buildUI(thisObj);
    if (scriptPanel instanceof Window) {
        scriptPanel.center();
        scriptPanel.show();
    }

})(this);
