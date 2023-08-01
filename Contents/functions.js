//===========================================================================
// functions.js
// Panzer FlipClock Widget  1.0
// 7 November, 2018
// Originally written and Steampunked by: Dean Beedell
// Dean.beedell@lightquick.co.uk
// Vitality code, advice and patience from Harry Whitfield
//
//===========================================================================

/*jslint multivar */

/*property
    hLocationPercPref, hOffset, height, hoffset, landscapeHoffsetPref,
    landscapeVoffsetPref, portraitHoffsetPref, portraitVoffsetPref,
    vLocationPercPref, vOffset, value, visible, voffset, widgetHideModePref,
    widgetLockLandscapeModePref, widgetLockPortraitModePref, width
*/

"use strict";

var mainWindow, print, log;

//======================================================================================
// Function to move the main_window onto the main screen - called on startup and by timer
//======================================================================================
function mainScreen() { // if the widget is off screen then move into the viewable window
    var aspectRatio;

    log("**** MAINSCREEN ****");

    // check for aspect ratio and determine whether it is in portrait or landscape mode
    if (screen.width > screen.height) {
        aspectRatio = "landscape";
    } else {
        aspectRatio = "portrait";
    }
    print("screen.width " + screen.width);
    print("screen.height " + screen.height);
    print("aspectRatio " + aspectRatio);
    // check if the widget has a lock for the screen type.
    if (aspectRatio === "landscape") {
        if (preferences.widgetLockLandscapeModePref.value === "enabled") {
            mainWindow.hoffset = preferences.landscapeHoffsetPref.value;
            mainWindow.voffset = preferences.landscapeVoffsetPref.value;
        }
        if (preferences.widgetHideModePref.value === "landscape") {
            //print("Hiding the widget for landscape mode");
            widget.visible = false;
        } else {
            widget.visible = true;
        }
    }
    // check if the widget has a lock for the screen type.
    if (aspectRatio === "portrait") {
        if (preferences.widgetLockPortraitModePref.value === "enabled") {
            mainWindow.hoffset = preferences.portraitHoffsetPref.value;
            mainWindow.voffset = preferences.portraitVoffsetPref.value;
        }
        if (preferences.widgetHideModePref.value === "portrait") {
            //print("Hiding the widget for portrait mode");
            widget.visible = false;
        } else {
            widget.visible = true;
        }
    }

    if (mainWindow.hOffset < 0) {
        mainWindow.hOffset = 10;
    }
    if (mainWindow.vOffset < 0) {
        mainWindow.vOffset = 0; // avoid Mac toolbar
    }
    if (mainWindow.hOffset > screen.width - 50) { //adjust for the extra width of the help page
        mainWindow.hOffset = screen.width - mainWindow.width + 220;
    }
    if (mainWindow.vOffset > screen.height - 150) {  //adjust for the extra height of the help page
        mainWindow.vOffset = screen.height - mainWindow.height; // avoid Mac toolbar
    }

    // calculate the current hlocation in % of the screen
    //store the current hlocation in % of the screen
    if (preferences.hLocationPercPref.value !== "") {
        preferences.hLocationPercPref.value = String((mainWindow.hoffset / screen.width) * 100);
    }
    if (preferences.vLocationPercPref.value !== "") {
        preferences.vLocationPercPref.value = String((mainWindow.voffset / screen.height) * 100);
    }

}
//=====================
//End function
//=====================

include("setMenu.js");





//===========================================
// this function edits the widget
//===========================================
function editWidget() {
    //var answer = alert("Editing the widget. Proceed?", "Open Editor", "No Thanks");
    //if (answer === 1) {
        //uses the contents of imageEditPref to initiate your default editor
        performCommand("menu");
    //}

}
//=====================
//End function
//=====================

//======================================================================================
// END script functions.js
//======================================================================================




//=====================
// function to carry out a command
//=====================
function performCommand(method) {
    var answer;

    if (method === "menu") {
        runCommandInBg(preferences.imageEditPref.value, "runningTask");
    } else {
        print("method "+method);
        if (system.event.altKey) { // filesystem.open() call
            if (preferences.openFilePref.value === "") {
                answer = alert("This widget has not been assigned an alt+double-click function. You need to open the preferences and select a file to be opened. Do you wish to proceed?", "Open Preferences", "No Thanks");
                if (answer === 1) {
                    showWidgetPreferences();
                }
                return;
            }
            filesystem.open(preferences.openFilePref.value);
        } else {
            if (preferences.imageCmdPref.value === "") {
                answer = alert("This widget has not been assigned a double-click function. You need to open the preferences and enter a run command for this widget. Do you wish to proceed?", "Open Preferences", "No Thanks");
                if (answer === 1) {
                    showWidgetPreferences();
                }
                return;
            }
                runCommandInBg(preferences.imageCmdPref.value, "runningTask");
        }
    }
}
//=====================
//End function
//=====================


