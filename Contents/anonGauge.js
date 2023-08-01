/*
    Steampunk Gauge Object - version 2.2
    31 October, 2018
    Copyright 2012-2018 Dean Beedell and Harry Whitfield
    mailto:g6auc@arrl.net
*/

/*jslint multivar, this */

/*properties
    appendChild, base, centreBoss, clock, clockReflection, dayOfWeek,
    displayTime, floor, frame, getDay, getHours, getMinutes, getSeconds, hOffset,
    hRegistrationPoint, height, hourHand, minuteHand, opacity, prototype,
    reScale, rotation, round, secondHand, src, toLowerCase, vOffset,
    vRegistrationPoint, width, zOrder
*/

"use strict";

var mainWindow;   // imports
var tankHelpShow;
var updateFlipClock;
var reScale;
var print;
var dragDropped;

var upperButton;    // exports
var middleButton;
var lowerButton;
var flipEvent;

var flip;   // sounds
var lock;
var ting;
var winding;

function AnonGauge(parent, hOffset, vOffset, zOrder, scale, visible, enableButtons, enableMenus, suppressLeftZero) {
    var newImage = function (parent, hOffset, vOffset, width, height, src, zOrder, opacity, hRegP, vRegP) {
            var o = new Image();

            o.src = src;
            o.width = Math.round(scale * width);
            o.height = Math.round(scale * height);
            o.zOrder = zOrder;
            o.opacity = opacity || 0;             // opacity is an optional parameter

            hRegP = hRegP || 0;                     // hRegP and vRegP are optional parameters
            vRegP = vRegP || 0;

            hOffset += hRegP;
            vOffset += vRegP;

            o.hOffset = Math.round(scale * hOffset);
            o.vOffset = Math.round(scale * vOffset);

            o.hRegistrationPoint = Math.round(scale * hRegP);
            o.vRegistrationPoint = Math.round(scale * vRegP);

            parent.appendChild(o);
            return o;
        },
        frame = new Frame(),
        base = "Resources/anonGauge/",

        background = newImage(frame, 0, 0, 755, 660, base + "Background_mk1.png", zOrder, 255),
        layer25 = newImage(frame, 137, 33, 557, 552, base + "layer25.png", zOrder, 255),
        largehole = newImage(frame, 264, 152, 286, 310, base + "largehole.png", zOrder, 255),
        leftflipper = newImage(frame, 267, 154, 163, 329, base + "leftflipper.png", zOrder, 255),
        rightflipper = newImage(frame, 401, 154, 163, 329, base + "rightflipper.png", zOrder, 255),

        leftflipperTopExtended = newImage(frame, 257, 154, 186, 158, base + "leftflipperTopExtended.png", zOrder, 0),
        leftflipperBottomExtended = newImage(frame, 257, 315, 190, 144, base + "leftflipperBottomExtended.png", zOrder, 0),

        rightflipperTopExtended = newImage(frame, 387, 154, 186, 158, base + "rightflipperTopExtended.png", zOrder, 0),
        rightflipperBottomExtended = newImage(frame, 385, 315, 190, 144, base + "rightflipperBottomExtended.png", zOrder, 0),

        left0 = newImage(frame, 282, 206, 115, 185, base + "left0.png", zOrder, 0),
        left1 = newImage(frame, 336, 200, 19, 183, base + "left1.png", zOrder, 0),
        left2 = newImage(frame, 306, 202, 79, 181, base + "left2.png", zOrder, 0),
        left3 = newImage(frame, 306, 205, 79, 183, base + "left3.png", zOrder, 0),
        left4 = newImage(frame, 281, 193, 131, 190, base + "left4.png", zOrder, 0),
        left5 = newImage(frame, 306, 205, 67, 183, base + "left5.png", zOrder, 0),
        left6 = newImage(frame, 286, 205, 101, 182, base + "left6.png", zOrder, 0),
        left7 = newImage(frame, 290, 205, 97, 178, base + "left7.png", zOrder, 0),
        left8 = newImage(frame, 284, 201, 105, 186, base + "left8.png", zOrder, 0),
        left9 = newImage(frame, 286, 201, 101, 183, base + "left9.png", zOrder, 0),

        right0 = newImage(frame, 420, 206, 115, 185, base + "right0.png", zOrder, 0),
        right1 = newImage(frame, 466, 200, 19, 183, base + "right1.png", zOrder, 0),
        right2 = newImage(frame, 436, 202, 79, 181, base + "right2.png", zOrder, 0),
        right3 = newImage(frame, 434, 205, 79, 183, base + "right3.png", zOrder, 0),
        right4 = newImage(frame, 409, 193, 131, 190, base + "right4.png", zOrder, 0),
        right5 = newImage(frame, 445, 205, 67, 183, base + "right5.png", zOrder, 0),
        right6 = newImage(frame, 425, 205, 101, 182, base + "right6.png", zOrder, 0),
        right7 = newImage(frame, 427, 205, 97, 178, base + "right7.png", zOrder, 0),
        right8 = newImage(frame, 423, 201, 105, 186, base + "right8.png", zOrder, 0),
        right9 = newImage(frame, 425, 201, 101, 183, base + "right9.png", zOrder, 0),

        face = newImage(frame, 137, 34, 554, 548, base + "faceAnon.png", zOrder, 255),
        surround = newImage(frame, 0, 0, 770, 660, base + "surround.png", zOrder, 255),
        startButton = newImage(frame, 710, 135, 95, 95, base + "startButton.png", zOrder + 20, 255),
        stopButton = newImage(frame, 710, 395, 95, 95, base + "startButton.png", zOrder + 20, 255),
        switchFacesButton = newImage(frame, 710, 267, 95, 95, base + "startButton.png", zOrder + 20, 255),
        bigReflection = newImage(frame, 169, 69, 403, 299, base + "bigReflection.png", zOrder, 255),
        windowReflection = newImage(frame, 511, 210, 123, 111, base + "windowReflection.png", zOrder, 224),
        pin = newImage(frame, 162, 60, 52, 52, base + "pin.png", zOrder, 255),
        prefs = newImage(frame, 161, 516, 51, 51, base + "prefs01.png", zOrder, 255),
        helpButton = newImage(frame, 625, 516, 51, 51, base + "helpButton.png", zOrder, 255),
        tickSwitch = newImage(frame, 625, 59, 52, 52, base + "pin.png", zOrder, 255),

        leftb = newImage(frame, 282, 206, 115, 185, base + "leftb.png", zOrder + 20, 10),
        rightb = newImage(frame, 420, 206, 115, 185, base + "rightb.png", zOrder + 20, 10),

        gauge = this;

    if (enableMenus) {
        prefs.tooltip = "Press to show the preferences.";
        helpButton.tooltip = "Press for help.";
        pin.tooltip = "Click me to lock (or unlock) the widget in place.";
        tickSwitch.tooltip = "This button is unused.";
    }

    this.base = base;
    this.background = background;
    this.layer25 = layer25;
    this.largehole = largehole;
    this.leftflipper = leftflipper;
    this.leftflipperTopExtended = leftflipperTopExtended;
    this.leftflipperBottomExtended = leftflipperBottomExtended;
    this.rightflipperTopExtended = rightflipperTopExtended;
    this.rightflipperBottomExtended = rightflipperBottomExtended;
    this.rightflipper = rightflipper;

    this.rightb = rightb;

    this.right1 = right1;
    this.right2 = right2;
    this.right3 = right3;
    this.right6 = right6;
    this.right5 = right5;
    this.right7 = right7;
    this.right8 = right8;
    this.right9 = right9;
    this.right0 = right0;
    this.right4 = right4;
    this.right5 = right5;

    this.leftb = leftb;

    this.left9 = left9;
    this.left8 = left8;
    this.left7 = left7;
    this.left6 = left6;
    this.left5 = left5;
    this.left4 = left4;
    this.left3 = left3;
    this.left2 = left2;
    this.left1 = left1;
    this.left0 = left0;
    this.face = face;

    this.surround = surround;
    this.startButton = startButton;
    this.stopButton = stopButton;
    this.switchFacesButton = switchFacesButton;
    this.bigReflection = bigReflection;
    this.windowReflection = windowReflection;
    this.pin = pin;
    this.prefs = prefs;
    this.helpButton = helpButton;
    this.tickSwitch = tickSwitch;
    this.enableButtons = enableButtons;
    this.suppressLeftZero = suppressLeftZero;

    frame.hOffset = hOffset;
    frame.vOffset = vOffset;
    frame.width = 805 * scale;
    frame.height = 660 * scale;
    frame.zOrder = zOrder;
    frame.visible = visible;
    parent.appendChild(frame);
    this.frame = frame;

    leftb.onMouseDown = function (event) {
        flipEvent(event, gauge, 0);
    };

    rightb.onMouseDown = function (event) {
        flipEvent(event, gauge, 1);
    };

    if (enableButtons) {
        startButton.onMouseDown = function (event) {
            this.opacity = 10;
            upperButton(event, gauge);
        };
        startButton.onMouseUp = function () {
            this.opacity = 255;
        };

        switchFacesButton.onMouseDown = function (event) {
            this.opacity = 10;
            middleButton(event, gauge);
            this.opacity = 10;
        };
        switchFacesButton.onMouseUp = function () {
            this.opacity = 255;
        };

        stopButton.onMouseDown = function (event) {
            this.opacity = 10;
            lowerButton(event, gauge);
        };
        stopButton.onMouseUp = function () {
            this.opacity = 255;
        };
    }

    if (enableMenus) {
        prefs.src = base + "prefs03.png";

        prefs.onMouseDown = function () {
            prefs.src = base + "prefs02.png";
        };
        prefs.onMouseUp = function () {
            prefs.src = base + "prefs03.png";
            if (preferences.soundPref.value !== "disabled") {
                play(winding, false);
            }
            showWidgetPreferences();
        };

        helpButton.src = base + "prefs03.png";

		helpButton.onMouseDown = function () {
            helpButton.opacity = 1;
        };
        helpButton.onMouseUp = function () {
            helpButton.opacity = 255;
            tankHelpShow();
        };
/*
        tickSwitch.onMouseUp = function () {
            tickSwitch.opacity = 1;
            updateFlipClock();
        };
*/
    }

    background.onDragDrop = dragDropped;

    //the following function needs to operate on both the background and background2 faces, as the ctrl event can only be caught by the
    //onMouseWheel itself on one object the event cannot be referred to by the key click on another object. The function would have to be duplicated
    //for the background and background2 objects. Instead I have made the background object opacity to 1 so it seems as if it is not
    //visible but it still responds to keyclicks and mousewheel movements even when supposedly 'invisible' - see the showFace function.

    background.onMouseWheel = function (event) {
        var size = Number(preferences.clockSize.value),
            maxLength = Number(preferences.clockSize.maxLength),
            minLength = Number(preferences.clockSize.minLength),
            ticks = Number(preferences.clockSize.ticks),
            step = Math.round((maxLength - minLength) / (ticks - 1));

        if ((preferences.ctrlResizePref.value === "CTRL") && !event.ctrlKey) {
            return;
        }

        if (event.scrollDelta > 0) {
            if (preferences.MouseWheelPref.value === "up") {
                size -= step;
                if (size < minLength) {
                    size = minLength;
                }
            } else {
                size += step;
                if (size > maxLength) {
                    size = maxLength;
                }
            }
        } else if (event.scrollDelta < 0) {
            if (preferences.MouseWheelPref.value === "up") {
                size += step;
                if (size > maxLength) {
                    size = maxLength;
                }
            } else {
                size -= step;
                if (size < minLength) {
                    size = minLength;
                }
            }
        }
        preferences.clockSize.value = String(size);
        reScale(Number(preferences.clockSize.value) / 100);
    };

    function lockWidget() {    // check for aspect ratio and determine whether it is in portrait or landscape mode
        var aspectRatio;

        if (screen.width > screen.height) {
            aspectRatio = "landscape";
        } else {
            aspectRatio = "portrait";
        }
        if (mainWindow.locked) {
            pin.opacity = 1;
            mainWindow.locked = false;

            // check if the widget has a lock for the screen type.
            if (aspectRatio === "landscape") {
                preferences.widgetLockLandscapeModePref.value = "disabled";
            }
            // check if the widget has a lock for the screen type.
            if (aspectRatio === "portrait") {
                preferences.widgetLockPortraitModePref.value = "disabled";
            }
            //pin.tooltip = "Click me to lock (or unlock) the widget in place";
            //screw2.tooltip="Click me to lock the widget in place";
            //paper.tooltip="";
            //woodSurround.tooltip="";
        } else {
            pin.opacity = 255;
            mainWindow.locked = true;

            // check if the widget has a lock for the screen type.
            if (aspectRatio === "landscape") {
                preferences.widgetLockLandscapeModePref.value = "enabled";
                preferences.landscapeHoffsetPref.value = mainWindow.hoffset;
                preferences.landscapeVoffsetPref.value = mainWindow.voffset;
            }
            // check if the widget has a lock for the screen type.
            if (aspectRatio === "portrait") {
                preferences.widgetLockPortraitModePref.value = "enabled";
                preferences.portraitHoffsetPref.value = mainWindow.hoffset;
                preferences.portraitVoffsetPref.value = mainWindow.voffset;
            }
            //pin.tooltip = "Click me to lock (or unlock) the widget in place";

            //screw2.tooltip="Click me to unlock";
            //paper.tooltip=woodSurround.tooltip="The widget is currently locked in place - click on the screw to release";

        }
        if (preferences.soundPref.value !== "disabled") {
            play(lock, false);
        }
    }

    if (enableMenus) {
        pin.onMouseDown = function () {
            lockWidget();
        };
    }

    //==============================================================
    // this function sets the tooltips
    //==============================================================
    function setTooltip() {
        //print("settooltip");
        //print("preferences.tooltipPref.value " + preferences.tooltipPref.value);
        if (preferences.tooltipPref.value === "enabled") {
            background.tooltip = "CTRL+mouse scrollwheel up/down to resize";
            //startButton.tooltip = "This element is unused";
            //stopButton.tooltip = "This element is unused";
            //switchFacesButton.tooltip = "This element is unused";
            //prefs.tooltip = "Press to open the widget preferences";
            //helpButton.tooltip = "Press for a little help";
            //pin.tooltip = "Click me to lock (or unlock) the widget in place";
            //tickSwitch.tooltip = "This element is unused";    // "Choose smooth movement or regular ticks";
        } else {
            background.tooltip = "";
            //startButton.tooltip = "";
            //stopButton.tooltip = "";
            //switchFacesButton.tooltip = "";
            prefs.tooltip = "";
            helpButton.tooltip = "";
            pin.tooltip = "";
            tickSwitch.tooltip = "";
        }
    }
    //=====================
    //End function
    //=====================

    //======================================================================================
    // Function to lock the widget on startup
    //======================================================================================
    function checkLockWidget() {    // check for aspect ratio and determine whether it is in portrait or landscape mode
        var aspectRatio;

        if (screen.width > screen.height) {
            aspectRatio = "landscape";
        } else {
            aspectRatio = "portrait";
        }
        //print("aspectRatio " + aspectRatio);
        //print("preferences.widgetLockLandscapeModePref.value " + preferences.widgetLockLandscapeModePref.value);
        //print("preferences.widgetLockPortraitModePref.value " + preferences.widgetLockPortraitModePref.value);
        // check if the widget has a lock for the screen type.
        if (aspectRatio === "landscape") {
            if (preferences.widgetLockLandscapeModePref.value === "disabled") {
                pin.opacity = 1;
                mainWindow.locked = false;
                // this does not work yet
                //pin.tooltip = "Click me to lock (or unlock) the widget in place";
                //screw2.tooltip="click me to lock the widget in place";
                return;
            }
            //print("checkLockWidget locking in landscape");
            pin.opacity = 255;
            mainWindow.locked = true;
            // check if the widget has a lock for the screen type.
            //pin.tooltip = "Click me to lock (or unlock) the widget in place";
        }
        // check if the widget has a lock for the screen type.
        if (aspectRatio === "portrait") {
            if (preferences.widgetLockPortraitModePref.value === "disabled") {
                pin.opacity = 1;
                mainWindow.locked = false;
                //pin.tooltip = "Click me to lock (or unlock) the widget in place";
                //screw2.tooltip="Click me to lock the widget in place";
            } else {
                //print("checkLockWidget locking in portrait");
                pin.opacity = 255;
                mainWindow.locked = true;
                // check if the widget has a lock for the screen type.
                //pin.tooltip = "Click me to lock (or unlock) the widget in place";
            }
        }
    }
    //=====================
    //End function
    //=====================

    setTooltip();
    checkLockWidget();
}

AnonGauge.prototype.reScale = function (scale) {
    var scaleImage = function (o, hOffset, vOffset, width, height, hRegP, vRegP) {

        o.width = Math.round(scale * width);
        o.height = Math.round(scale * height);

        hRegP = hRegP || 0;                     // hRegP and vRegP are optional parameters
        vRegP = vRegP || 0;

        hOffset += hRegP;
        vOffset += vRegP;

        o.hOffset = Math.round(scale * hOffset);
        o.vOffset = Math.round(scale * vOffset);

        o.hRegistrationPoint = Math.round(scale * hRegP);
        o.vRegistrationPoint = Math.round(scale * vRegP);
    };

    scaleImage(this.background, 0, 0, 755, 660);
    scaleImage(this.layer25, 137, 33, 557, 552);
    scaleImage(this.largehole, 264, 152, 286, 310);
    scaleImage(this.leftflipper, 267, 154, 163, 329);
    scaleImage(this.rightflipper, 401, 154, 163, 329);
    scaleImage(this.leftflipperTopExtended, 267, 154, 163, 329);
    scaleImage(this.leftflipperBottomExtended, 257, 315, 190, 144);

    scaleImage(this.rightflipperTopExtended, 387, 154, 163, 329);
    scaleImage(this.rightflipperBottomExtended, 385, 315, 190, 144);

    scaleImage(this.left0, 282, 206, 115, 185);
    scaleImage(this.left1, 336, 200, 19, 183);
    scaleImage(this.left2, 306, 202, 79, 181);
    scaleImage(this.left3, 306, 205, 79, 183);
    scaleImage(this.left4, 281, 193, 131, 190);
    scaleImage(this.left5, 306, 205, 67, 183);
    scaleImage(this.left6, 286, 205, 101, 182);
    scaleImage(this.left7, 290, 205, 97, 178);
    scaleImage(this.left8, 284, 201, 105, 186);
    scaleImage(this.left9, 286, 201, 101, 183);

    scaleImage(this.right0, 420, 206, 115, 185);
    scaleImage(this.right1, 466, 200, 19, 183);
    scaleImage(this.right2, 436, 202, 79, 181);
    scaleImage(this.right3, 434, 205, 79, 183);
    scaleImage(this.right4, 409, 193, 131, 190);
    scaleImage(this.right5, 445, 205, 67, 183);
    scaleImage(this.right6, 425, 205, 101, 182);
    scaleImage(this.right7, 427, 205, 97, 178);
    scaleImage(this.right8, 423, 201, 105, 186);
    scaleImage(this.right9, 425, 201, 101, 183);

    scaleImage(this.face, 137, 34, 554, 548);
    scaleImage(this.surround, 0, 0, 770, 660);
    scaleImage(this.startButton, 710, 135, 95, 95);
    scaleImage(this.stopButton, 710, 395, 95, 95);
    scaleImage(this.switchFacesButton, 710, 267, 95, 95);
    scaleImage(this.bigReflection, 169, 69, 403, 299);
    scaleImage(this.windowReflection, 511, 210, 123, 111);
    scaleImage(this.pin, 162, 60, 52, 52);
    scaleImage(this.prefs, 161, 516, 51, 51);
    scaleImage(this.helpButton, 625, 516, 51, 51);
    scaleImage(this.tickSwitch, 625, 59, 52, 52);

    scaleImage(this.leftb, 282, 206, 115, 185);
    scaleImage(this.rightb, 420, 206, 115, 185);

    this.frame.width = 805 * scale;
    this.frame.height = 660 * scale;
};

AnonGauge.prototype.setGauge = function () {
    var animationDuration = 500;    // 0.5 seconds
    var animationInterval = 50;    // 0.05 seconds
    var flipState = 0;
    var that = this;

    function updateMe() { // called during flipAnimation
        var leftChar = that.leftChar;
        var rightChar = that.rightChar;

        flipState += 1;

        switch (flipState) {
        case 1:
            that["left" + leftChar].opacity = 0;
            that.leftflipperTopExtended.opacity = 255;
            break;
        case 2:
            that.leftflipperTopExtended.opacity = 0;
            that.leftflipperBottomExtended.opacity = 255;
            break;
        case 3:
            that.leftflipperBottomExtended.opacity = 0;
            play(flip, false);
            break;
        case 4:
        	if ((leftChar !== "0") || !that.suppressLeftZero) {
                that["left" + leftChar].opacity = 255;
            }
            that["right" + rightChar].opacity = 0;
            that.rightflipperTopExtended.opacity = 255;
            break;
        case 5:
            that.rightflipperTopExtended.opacity = 0;
            that.rightflipperBottomExtended.opacity = 255;
            break;
        case 6:
            that.rightflipperBottomExtended.opacity = 0;
            play(flip, false);
            break;
        case 7:
            that["right" + rightChar].opacity = 255;
            flipState = 0;
            return false;
        }
        return true;
    }

    var flipAnimation = new CustomAnimation(animationInterval, updateMe);
    flipAnimation.duration = animationDuration;
    animator.start(flipAnimation);
};

AnonGauge.prototype.setSuppressLeftZero = function (suppressLeftZero) {
	this.suppressLeftZero = suppressLeftZero;
};
