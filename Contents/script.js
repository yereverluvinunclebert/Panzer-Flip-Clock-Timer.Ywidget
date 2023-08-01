/*
	Panzer Flip Clock and Timer Widget

	Created by Dean Beedell
	Re-coded by Dean Beedell
	Visuals added to and enhanced by Dean Beedell
	Sorted by Harry Whitfield

	31 October, 2018  Version 1.3

	email: dean.beedell@lightquick.co.uk
	http//lightquick.co.uk
*/

/*jslint for, this */

/*property
	UTC, clockModePref, clockSize, displayHoursPref, dockFormatPref, event,
	face, floor, forEach, frame, getDate, getFullYear, getHours, getMinutes,
	getMonth, getSeconds, getTime, getUTCDate, getUTCFullYear, getUTCHours,
	getUTCMinutes, getUTCMonth, getUTCSeconds, hOffset, height, interval,
	keyCode, leftChar, leftflipperBottomExtended, leftflipperTopExtended,
	length, match, name, onKeyDown, onMouseDown, onPreferencesChanged,
	onTimerFired, onWakeFromSleep, onload, opacity, open, push, reScale,
	rightChar, rightflipperBottomExtended, rightflipperTopExtended, shiftKey,
	soundPref, src, startButton, stopButton, switchFacesButton, targetTimePref,
	ticking, timeModePref, toString, tooltip, value, visible, width
*/

"use strict";

var mainWindow; // imports
var AnonGauge;
var buildVitality;
var mainScreen;
var createLicense;
var setmenu;

var tankHelp;
var helpWindow;
var updateAlarmPrefs;
var playAlarm;
var newAlertWindow;

var currIcon = "Resources/images/dock.png";
var dockIcon = "Resources/images/dock2.png";
var widgetName = widget.name;

var counter = "Resources/sounds/counter.mp3";
var lock = "Resources/sounds/lock.mp3";
var till = "Resources/sounds/till01.mp3";
var ting = "Resources/sounds/ting.mp3";
var mistake = "Resources/sounds/mistake.wav";
var thhhh = "Resources/sounds/thhhh.mp3";
var winding = "Resources/sounds/winding.mp3";
var flip = "Resources/sounds/flip.mp3";
var hrsFlipping = 1; //WIP

include("debug.js");
include("fileTypes.js");
include("alarms.js");
include("alertWindow.js");
include("dragDropped.js");
include("functions.js");
include("vitality.js");
include("anonGauge.js");
include("handleExternalCall.js");
include("Resources/License/License.js");

var alertWindow = newAlertWindow("Resources/AlertImages", "alert.png", "okButton.png", "alertWin.png", "okButtonWin.png", "closeButtonWin.png", 3);
//alertWindow.open("Use the drag handles to resize the frame!");

var scale = Number(preferences.clockSize.value) / 100;
var hourGauge = new AnonGauge(mainWindow, 0, 0, 1, scale, true, false, false);
var minGauge = new AnonGauge(mainWindow, 575 * scale, 0, 1, scale, true, false, true);
var secGauge = new AnonGauge(mainWindow, 1150 * scale, 0, 1, scale, true, true, false);

secGauge.startButton.tooltip = "Increment the selected digit.";
secGauge.switchFacesButton.tooltip = "Set the timer target time to the time on the gauges.";
secGauge.stopButton.tooltip = "Decrement the selected digit.";

var oldHrsLeftChar;
var oldHrsRightChar;
var oldMinsLeftChar;
var oldMinsRightChar;
var oldSecsLeftChar;
var oldSecsRightChar;

var oldhrs;
var oldmins;
var oldsecs;

var clockMode;	// clock, timer
var timeMode;	// local, utc
var targetDate; // for countdown timer

var setMode = 0;
var settingBusy = false;

var hours12 = false;

function initialize() {
	oldHrsLeftChar = "";
	oldHrsRightChar = "";
	oldMinsLeftChar = "";
	oldMinsRightChar = "";
	oldSecsLeftChar = "";
	oldSecsRightChar = "";
}

//=================================
// widget timer setup
//=================================
var theTimer = new Timer();
theTimer.ticking = false;
theTimer.interval = 1;
//=================================
// timer ends
//=================================

var alarmTimer = new Timer();
alarmTimer.ticking = false;
alarmTimer.interval = 0.25;

alarmTimer.onTimerFired = function () {
	alarmTimer.ticking = false;
	playAlarm();
};

var setClockModeTimer = new Timer();
setClockModeTimer.ticking = false;
setClockModeTimer.interval = 20;

function setClockMode() {
	preferences.clockModePref.value = "clock";
	clockMode = "clock";
	initialize();
	theTimer.ticking = true;
}

setClockModeTimer.onTimerFired = function () {
	setClockModeTimer.ticking = false;
	setClockMode();
};

//=====================
// function hrsClear
//=====================
function hrsClearRight() {
	var i;

	for (i = 0; i < 10; i += 1) {
		hourGauge["right" + i].opacity = 0;
	}
}
//=====================
//End function
//=====================

//=====================
// function hrsClear
//=====================
function hrsClearLeft() {
	var i;

	for (i = 0; i < 10; i += 1) {
		hourGauge["left" + i].opacity = 0;
	}
}
//=====================
//End function
//=====================

//=====================
// function minsClear
//=====================
function minsClearLeft() {
	var i;

	for (i = 0; i < 10; i += 1) {
		minGauge["left" + i].opacity = 0;
	}
}
//=====================
//End function
//=====================

//=====================
// function minsClear
//=====================
function minsClearRight() {
	var i;

	for (i = 0; i < 10; i += 1) {
		minGauge["right" + i].opacity = 0;
	}
}
//=====================
//End function
//=====================

//=====================
// function secsClear
//=====================
function secsClearRight() {
	var i;

	for (i = 0; i < 10; i += 1) {
		secGauge["right" + i].opacity = 0;
	}
}
//=====================
//End function
//=====================

//=====================
// function secsClear
//=====================
function secsClearLeft() {
	var i;

	for (i = 0; i < 10; i += 1) {
		secGauge["left" + i].opacity = 0;
	}
}
//=====================
//End function
//=====================

//=================================================================
// updateFlipClock is called by a timer, it does the main time work
//=================================================================
var flipTimerLeft = new Timer();
flipTimerLeft.interval = 0.035;		// less than 40mS
flipTimerLeft.ticking = false;

var flipTimerRight = new Timer();
flipTimerRight.interval = 0.035;	// less than 40mS
flipTimerRight.ticking = false;

var lFlipState = 0;
var rFlipState = 0;

var gGaugeL;
var gGaugeR;

function flipLeft(theGauge) {
	var leftChar = theGauge.leftChar;

	lFlipState += 1;

	switch (lFlipState) {
	case 1:
		gGaugeL = theGauge;
		theGauge["left" + leftChar].opacity = 0;
		theGauge.leftflipperTopExtended.opacity = 255;
		flipTimerLeft.ticking = true;
		break;
	case 2:
		theGauge.leftflipperTopExtended.opacity = 0;
		theGauge.leftflipperBottomExtended.opacity = 255;
		flipTimerLeft.ticking = true;
		break;
	case 3:
		theGauge.leftflipperBottomExtended.opacity = 0;
		flipTimerLeft.ticking = true;
		if (preferences.soundPref.value !== "disabled") {
			play(flip, false);
		}
		break;
	case 4:
		if (!hours12 || (clockMode === "timer") || (theGauge !== hourGauge) || (leftChar !== "0")) {
			theGauge["left" + leftChar].opacity = 255;
		}
		lFlipState = 0;
		break;
	}
}

flipTimerLeft.onTimerFired = function () {
	flipTimerLeft.ticking = false;
	flipLeft(gGaugeL);
};


function flipRight(theGauge) {
	var rightChar = theGauge.rightChar;

	rFlipState += 1;

	switch (rFlipState) {
	case 1:
		gGaugeR = theGauge;
		theGauge["right" + rightChar].opacity = 0;
		theGauge.rightflipperTopExtended.opacity = 255;
		flipTimerRight.ticking = true;
		break;
	case 2:
		theGauge.rightflipperTopExtended.opacity = 0;
		theGauge.rightflipperBottomExtended.opacity = 255;
		flipTimerRight.ticking = true;
		break;
	case 3:
		theGauge.rightflipperBottomExtended.opacity = 0;
		flipTimerRight.ticking = true;
		if (preferences.soundPref.value !== "disabled") {
			play(flip, false);
		}
		break;
	case 4:
		theGauge["right" + rightChar].opacity = 255;
		rFlipState = 0;
		break;
	}
}

flipTimerRight.onTimerFired = function () {
	flipTimerRight.ticking = false;
	flipRight(gGaugeR);
};

var gaugeTimer = new Timer();
gaugeTimer.interval = 0.16; // Must be less than 160mS
gaugeTimer.ticking = false;
var gaugeState = 0;

function flipGauges() {
	if (lFlipState !== 0) {
		//print("lFlipState !== 0");
		gaugeTimer.ticking = true;
		return;
	}
	if (rFlipState !== 0) {
		//print("rFlipState !== 0");
		gaugeTimer.ticking = true;
		return;
	}

	gaugeState += 1;

	switch (gaugeState) {
	case 1:
		if (oldSecsRightChar !== secGauge.rightChar) {
			oldSecsRightChar = secGauge.rightChar;
			secsClearRight();
			flipRight(secGauge);
		}
		gaugeTimer.ticking = true;
		break;
	case 2:
		if (oldSecsLeftChar !== secGauge.leftChar) {
			oldSecsLeftChar = secGauge.leftChar;
			secsClearLeft();
			flipLeft(secGauge);
		}
		gaugeTimer.ticking = true;
		break;
	case 3:
		if (oldMinsRightChar !== minGauge.rightChar) {
			oldMinsRightChar = minGauge.rightChar;
			minsClearRight();
			flipRight(minGauge);
		}
		gaugeTimer.ticking = true;
		break;
	case 4:
		if (oldMinsLeftChar !== minGauge.leftChar) {
			oldMinsLeftChar = minGauge.leftChar;
			minsClearLeft();
			flipLeft(minGauge);
		}
		gaugeTimer.ticking = true;
		break;
	case 5:
		if (oldHrsRightChar !== hourGauge.rightChar) {
			oldHrsRightChar = hourGauge.rightChar;
			hrsClearRight();
			flipRight(hourGauge);
		}
		gaugeTimer.ticking = true;
		break;
	case 6:
		if (oldHrsLeftChar !== hourGauge.leftChar) {
			oldHrsLeftChar = hourGauge.leftChar;
			hrsClearLeft();
			flipLeft(hourGauge);
		}
		gaugeState = 0;
		break;
	}
}

gaugeTimer.onTimerFired = function () {
	gaugeTimer.ticking = false;
	flipGauges();
};

/*
function getTargetDate(hrs, mins, secs) {
	var time = 3600 * hrs + 60 * mins + secs,
		theDate = new Date(),
		year = theDate.getFullYear(),
		month = theDate.getMonth(),
		date = theDate.getDate(),
		now = Math.floor((theDate.getTime() - new Date(year, month, date).getTime()) / 1000),
		remainder = time - now;

	if (remainder <= 0) {
		remainder += 86400;
	}
	return new Date(theDate.getTime() + 1000 * remainder);
}
*/

function lastDayOf(month, year) {	// month 0..11
	var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	if (month !== 1) {
		return daysInMonth[month];
	}
	if ((year % 4) !== 0) {
		return 28;
	}
	if ((year % 400) === 0) {
		return 29;
	}
	if ((year % 100) === 0) {
		return 28;
	}
	return 29;
}

function getTargetDate(hrs, mins, secs) {
	var time = 3600 * hrs + 60 * mins + secs;
	var theDate = new Date();
	var now;
	var remainder;
	var year;
	var month;
	var date;
	var hours;
	var minutes;
	var seconds;

	if (timeMode === "local") {
		year = theDate.getFullYear();
		month = theDate.getMonth();		// 0..11
		date = theDate.getDate();
		hours = theDate.getHours();
		minutes = theDate.getMinutes();
		seconds = theDate.getSeconds();
	} else {	// timeMode === "utc"
		year = theDate.getUTCFullYear();
		month = theDate.getUTCMonth();	// 0..11
		date = theDate.getUTCDate();
		hours = theDate.getUTCHours();
		minutes = theDate.getUTCMinutes();
		seconds = theDate.getUTCSeconds();
	}

	now = 3600 * hours + 60 * minutes + seconds;
	remainder = time - now;

	if (remainder <= 0) {	// target time is in next day
		if (date === lastDayOf(month, year)) {
			date = 1;
			month += 1;
			if (month === 12) {
				month = 0;
				year += 1;
			}
		} else {
			date += 1;
		}
	}

	if (timeMode === "local") {
		return new Date(year, month, date, hrs, mins, secs);
	}
	return new Date(Date.UTC(year, month, date, hrs, mins, secs));
}

function updateFlipClock() {
	var hrs;
	var mins;
	var secs;
	var hrsLeftChar;
	var hrsRightChar;
	var minsLeftChar;
	var minsRightChar;
	var secsLeftChar;
	var secsRightChar;
	var d0;
	var d1;
	var remainder;
	var theDate = new Date();

	if (clockMode === "clock") {
		if (timeMode === "local") {
			hrs = theDate.getHours();
			mins = theDate.getMinutes();
			secs = theDate.getSeconds();
		} else {	// timeMode === "utc"
			hrs = theDate.getUTCHours();
			mins = theDate.getUTCMinutes();
			secs = theDate.getUTCSeconds();
		}
		if (hours12) {
			hrs = hrs % 12;
			if (hrs === 0) {
				hrs = 12;
			}
		}
	} else {	// clockMode === "timer"
		remainder = Math.floor((targetDate.getTime() - theDate.getTime()) / 1000);
		if (remainder <= 0) {
			theTimer.ticking = false;
			//Sound the Alarm!!
			alarmTimer.ticking = true;
			//revert to clock mode after 20 seconds
			setClockModeTimer.ticking = true;
		}
		hrs = Math.floor(remainder / 3600);
		remainder -= 3600 * hrs;
		mins = Math.floor(remainder / 60);
		secs = remainder - 60 * mins;
	}

	hrs = hrs.toString();
	if (hrs.length === 1) {
		hrsLeftChar = "0";
		hrsRightChar = hrs;
	} else {
		hrsLeftChar = hrs[0];
		hrsRightChar = hrs[1];
	}
	hourGauge.leftChar = hrsLeftChar;
	hourGauge.rightChar = hrsRightChar;

	mins = mins.toString();
	if (mins.length === 1) {
		minsLeftChar = "0";
		minsRightChar = mins;
	} else {
		minsLeftChar = mins[0];
		minsRightChar = mins[1];
	}
	minGauge.leftChar = minsLeftChar;
	minGauge.rightChar = minsRightChar;

	secs = secs.toString();
	if (secs.length === 1) {
		secsLeftChar = "0";
		secsRightChar = secs;
	} else {
		secsLeftChar = secs[0];
		secsRightChar = secs[1];
	}
	secGauge.leftChar = secsLeftChar;
	secGauge.rightChar = secsRightChar;

	flipGauges();

	if (preferences.dockFormatPref.value === "seconds") {					// ss format
		if (secs.length === 1) {
			d0 = "left0.png";
			d1 = "right" + secs + ".png";
		} else {
			d0 = "left" + secs[0] + ".png";
			d1 = "right" + secs[1] + ".png";
		}

		d0 = "Resources/anonGauge/" + d0;
		d1 = "Resources/anonGauge/" + d1;

		buildVitality(currIcon, d0, d1, false);
	} else if (preferences.dockFormatPref.value === "minutes and seconds") { // mmss format
		d0 = minsLeftChar + minsRightChar;
		d1 = secsLeftChar + secsRightChar;
		buildVitality(dockIcon, d0, d1, true);
	} else {																// hhmm
		d0 = hrsLeftChar + hrsRightChar;
		d1 = minsLeftChar + minsRightChar;
		buildVitality(dockIcon, d0, d1, true);
	}
}
//=====================
//End function
//=====================

//=====================
// function setFace
//=====================
function setFace() {
	hourGauge.face.src = "Resources/images/facehrs.png";
	minGauge.face.src = "Resources/images/facemins.png";
	secGauge.face.src = "Resources/images/facesecs.png";
}
//=====================
//End function
//=====================


var widgetName = widget.name;
var debugFlg = "";
//===========================================
// this function runs on startup
//===========================================
function startup() {
    debugFlg = preferences.debugflgPref.value;
    if (debugFlg === "1") {
        preferences.imageEditPref.hidden=false;
        preferences.imageCmdPref.hidden=false;
    } else {
        preferences.imageEditPref.hidden=true;
        preferences.imageCmdPref.hidden=true;
    }

	var target;

	setMode = 0;
	settingBusy = false;

	initialize();

	mainScreen();
	createLicense(mainWindow);

	target = preferences.targetTimePref.value.match(/^\s*(\d\d)\:(\d\d)\:(\d\d)\s*$/);
	if (target !== null) {
		targetDate = getTargetDate(Number(target[1]), Number(target[2]), Number(target[3]));	// replace by user setting interface
	} else {
		beep();
		//alert("Invalid countdown target.");
		alertWindow.open("Invalid countdown target.");
		targetDate = null;
		preferences.clockModePref.value = "clock";
	}

	clockMode = preferences.clockModePref.value;
	timeMode = preferences.timeModePref.value;
	hours12 = (preferences.displayHoursPref.value === "12-hour");
	updateAlarmPrefs();
	setmenu();
	setFace();
	updateFlipClock();
	theTimer.ticking = true;
}
//=====================
//End function
//=====================

tankHelp.onMouseDown = function () {
	helpWindow.visible = false;
	if (preferences.soundPref.value !== "disabled") {
		play(ting, false);
	}
};

function tankHelpShow() {
	helpWindow.visible = true;
	if (preferences.soundPref.value !== "disabled") {
		play(till, false);
	}
}

//=================================
// timer to fade the buttons
//=================================
theTimer.onTimerFired = function () {
	updateFlipClock();
};
//=====================
//End function
//=====================

////////////////////////////////// Target Timer Setting //////////////////////////////////

var clearDigit = [null, hrsClearLeft, hrsClearRight, minsClearLeft, minsClearRight, secsClearLeft, secsClearRight];
var settingMax = [0, 3, 10, 6, 10, 6, 10];
var settings = [];

function incDigitFull(setMode, settings) {
	function incS() {
		settings[setMode] = String((Number(settings[setMode]) + 1) % settingMax[setMode]);
	}

	switch (setMode) {
	case 0:
		if (preferences.soundPref.value !== "disabled") {
			play(mistake, false);
		}
		break;
	case 1:
		incS();
		hourGauge.leftChar = settings[1];
		clearDigit[1]();
		flipLeft(hourGauge);
		if ((settings[1] === "2") && (Number(settings[2]) > 3)) {
			settings[2] = "0";
			hourGauge.rightChar = settings[2];
			clearDigit[2]();
			flipRight(hourGauge);
		}
		break;
	case 2:
		incS();
		if ((settings[1] === "2") && (Number(settings[2]) > 3)) {
			settings[2] = "0";
		}
		hourGauge.rightChar = settings[2];
		clearDigit[2]();
		flipRight(hourGauge);
		break;
	case 3:
		incS();
		minGauge.leftChar = settings[3];
		clearDigit[3]();
		flipLeft(minGauge);
		break;
	case 4:
		incS();
		minGauge.rightChar = settings[4];
		clearDigit[4]();
		flipRight(minGauge);
		break;
	case 5:
		incS();
		secGauge.leftChar = settings[5];
		clearDigit[5]();
		flipLeft(secGauge);
		break;
	case 6:
		incS();
		secGauge.rightChar = settings[6];
		clearDigit[6]();
		flipRight(secGauge);
		break;
	}
}

function incDigit() {
	incDigitFull(setMode, settings);
}

function upperButton() {	// (event, gauge)
	incDigitFull(setMode, settings);
}

function decDigitFull(setMode, settings) {
	function decS() {
		if (Number(settings[setMode]) <= 0) {
			settings[setMode] = String(Number(settingMax[setMode]) - 1);
		} else {
			settings[setMode] = String(Number(settings[setMode]) - 1);
		}
	}

	switch (setMode) {
	case 0:
		if (preferences.soundPref.value !== "disabled") {
			play(mistake, false);
		}
		break;
	case 1:
		decS();
		hourGauge.leftChar = settings[setMode];
		clearDigit[setMode]();
		flipLeft(hourGauge);
		if ((settings[1] === "2") && (Number(settings[2]) > 3)) {
			settings[2] = "3";
			hourGauge.rightChar = settings[2];
			clearDigit[2]();
			flipRight(hourGauge);
		}
		break;
	case 2:
		decS();
		if ((settings[1] === "2") && (Number(settings[2]) > 3)) {
			settings[2] = "3";
		}
		hourGauge.rightChar = settings[setMode];
		clearDigit[setMode]();
		flipRight(hourGauge);
		break;
	case 3:
		decS();
		minGauge.leftChar = settings[setMode];
		clearDigit[setMode]();
		flipLeft(minGauge);
		break;
	case 4:
		decS();
		minGauge.rightChar = settings[setMode];
		clearDigit[setMode]();
		flipRight(minGauge);
		break;
	case 5:
		decS();
		secGauge.leftChar = settings[setMode];
		clearDigit[setMode]();
		flipLeft(secGauge);
		break;
	case 6:
		decS();
		secGauge.rightChar = settings[setMode];
		clearDigit[setMode]();
		flipRight(secGauge);
		break;
	}
}

function decDigit() {
	decDigitFull(setMode, settings);
}

function lowerButton() {	// (event, gauge)
	decDigitFull(setMode, settings);
}

var decTimer = new Timer();
decTimer.interval = 0.32;
decTimer.ticking = false;

decTimer.onTimerFired = function () {
	decTimer.ticking = false;
	decDigit();
};

var incTimer = new Timer();
incTimer.interval = 0.32;
incTimer.ticking = false;

incTimer.onTimerFired = function () {
	incTimer.ticking = false;
	incDigit();
};

var cSMBusy = false;

function changeSetMode(event, gauge, handed) {
	var dd = [];
	var targetTimePref;
	var clockModePref;

	if (cSMBusy) {
		return;
	}

	cSMBusy = true;

	theTimer.ticking = false;
	incTimer.ticking = false;
	decTimer.ticking = false;

	if ((setMode === 0) && (gauge === undefined)) {
		if (preferences.soundPref.value !== "disabled") {
			play(mistake, false);
		}
		//alert("Please set a target time by clicking on the digits.");
		alertWindow.open("Please set a target time by clicking on the digits.");
		theTimer.ticking = true;
		cSMBusy = false;
		return;
	}

	if (!settingBusy) {
		settings[0] = "";
		settings[1] = oldHrsLeftChar;
		settings[2] = oldHrsRightChar;
		settings[3] = oldMinsLeftChar;
		settings[4] = oldMinsRightChar;
		settings[5] = oldSecsLeftChar;
		settings[6] = oldSecsRightChar;
		settingBusy = true;
	}

	if (gauge !== undefined) {
		switch (gauge) {
		case hourGauge:
			setMode = 1 + handed;
			break;
		case minGauge:
			setMode = 3 + handed;
			break;
		case secGauge:
			setMode = 5 + handed;
			break;
		}
	} else {
		setMode = 0;
		settingBusy = false;
	}

	if (setMode === 0) {
		settings.forEach(function (d) {
			dd.push(String(d));
		});

		targetTimePref = dd[1] + dd[2] + ":" + dd[3] + dd[4] + ":" + dd[5] + dd[6];
		preferences.targetTimePref.value = targetTimePref;

		//minGauge.target.value = preferences.targetTimePref.value;

		clockModePref = "timer";
		preferences.clockModePref.value = clockModePref;

		startup();	// **** good enough ??
	} else {
		if (event.shiftKey) {
			decTimer.ticking = true;
		} else {
			incTimer.ticking = true;
		}
	}
	cSMBusy = false;
}

function flipEvent(event, gauge, handed) {
	changeSetMode(event, gauge, handed);
}

function middleButton() {	// (event, gauge)
	changeSetMode();
}

//===============================================================
// this function is called when the widget loads
//===============================================================
widget.onload = function () {
	mainWindow.width = 1950 * scale;
	mainWindow.height = 660 * scale;
	startup();
};
//=====================
//End function
//=====================

function reScale(scale) {
	mainWindow.width = 1950 * scale;
	mainWindow.height = 660 * scale;

	hourGauge.reScale(scale);
	minGauge.reScale(scale);
	secGauge.reScale(scale);

	hourGauge.frame.hOffset = 0;
	minGauge.frame.hOffset = 575 * scale;
	secGauge.frame.hOffset = 1150 * scale;
}

//===============================================================
// this function is called when the widget prefs are changed
//===============================================================
widget.onPreferencesChanged = function () {
	scale = Number(preferences.clockSize.value) / 100;
	reScale(scale);
	startup();
};
//=====================
//End function
//=====================


//===============================================================
// this function is called when the widget wakes up from sleep
//===============================================================
widget.onWakeFromSleep = function () {
	reloadWidget();
/*
	initialize();
	updateFlipClock();
	theTimer.ticking = true;
*/
};
//=====================
//End function
//=====================

//===============================================================
// this function defines the keyboard events captured
//===============================================================
mainWindow.onKeyDown = function () {
	if (system.event.keyCode === 116) {
		print("pressing " + system.event.keyCode);
		reloadWidget();
	}
};
//=====================
//End function
//=====================

