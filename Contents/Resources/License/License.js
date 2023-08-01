/*
	LICENSE DISPLAY - A program to display license information.
	Copyright  2005-2015  Ricky Romero and Harry Whitfield

	This program is free software; you can redistribute it and/or modify it
	under the terms of the GNU General Public License as published by the
	Free Software Foundation; either version 2 of the License, or (at your
	option) any later version.

	This program is distributed in the hope that it will be useful, but
	WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
	General Public License for more details.

	You should have received a copy of the GNU General Public License along
	with this program; if not, write to the Free Software Foundation, Inc.,
	51 Franklin St, Fifth Floor, Boston, MA	 02110-1301	 USA

	License Display - version 10.0
	15 June, 2015
	Copyright  2005-2015  Ricky Romero and Harry Whitfield
	mailto:g6auc@arrl.net
*/

/*properties
	alignment, altKey, appendChild, bgColor, bgOpacity, color, data, event,
	extractFile, focus, font, hAlign, hOffset, height, licenseHide, mainWindow,
	onMouseUp, opacity, open, orientation, readFile, shadow, size, src,
	thumbColor, title, tooltip, vAlign, vOffset, vScrollBar, value, visible,
	width, window, wrap
*/

"use strict";

var license_info = null;
var accept = null;
var acceptShadow = null;
var decline = null;
var declineInstruction = null;
var declineInstruction2 = null;
var declineShadow = null;
var license = null;
var theLicenseFrame = null;
var widgetTitle = null;
var licenseTaFrame = null;
var licenseVsb = null;
var GNU_GPL = widget.extractFile("Resources/License/GNU-GPL.html");

function showLicense() {
	if (system.event.altKey) {
		filesystem.open(GNU_GPL);
	}
}

function closeTheWidget() {
	closeWidget();
}

function acceptLicense() {
	var mainWindow = license_info.mainWindow;
	license_info.visible = false;
	mainWindow.visible = true;
	mainWindow.focus();

	theLicenseFrame.opacity = 0;
	widgetTitle.opacity = 0;
	declineInstruction.opacity = 0;
	declineInstruction2.opacity = 0;
	license.opacity = 0;
	acceptShadow.opacity = 0;
	accept.opacity = 0;
	declineShadow.opacity = 0;
	decline.opacity = 0;

	preferences.licenseHide.value = "1";
}

function displayLicense() {
	theLicenseFrame.opacity = 255;
	widgetTitle.opacity = 255;
	declineInstruction.opacity = 255;
	declineInstruction2.opacity = 255;
	license.opacity = 255;
	acceptShadow.opacity = 255;
	accept.opacity = 255;
	declineShadow.opacity = 255;
	decline.opacity = 255;

	preferences.licenseHide.value = "0";
	license_info.visible = true;
}

function testLicense() {
	if (license_info.visible) {
		closeWidget();
	}
}

function createLicense(mainWindow) {	// mainWindow parameter is a window
	license_info = new Window();

	license_info.mainWindow = mainWindow;

	license_info.title = "License Agreement";
	license_info.alignment = "left";
	license_info.hOffset = 400;
	license_info.vOffset = 150;
	license_info.width = 365;
	license_info.height = 310;
	license_info.visible = false;
	license_info.shadow = false;

	theLicenseFrame = new Image();
	theLicenseFrame.window = license_info;
	theLicenseFrame.src = "Resources/License/Frame.png";
	theLicenseFrame.hOffset = 0;
	theLicenseFrame.vOffset = 0;
	theLicenseFrame.width = 365;
	theLicenseFrame.height = 310;

	widgetTitle = new Text();
	widgetTitle.window = license_info;
	widgetTitle.data = "License Agreement";
	widgetTitle.hOffset = 34;
	widgetTitle.vOffset = 34;
	widgetTitle.alignment = "left";
	widgetTitle.font = "Helvetica, Arial Bold";
	widgetTitle.size = 11;
	widgetTitle.color = "#FFFFFF";

	declineInstruction2 = new Text();
	declineInstruction2.window = license_info;
	declineInstruction2.data = "If you do not agree with the terms set forth above, please click the";
	declineInstruction2.alignment = "center";
	declineInstruction2.hOffset = 183;
	declineInstruction2.vOffset = 236;
	declineInstruction2.font = "Helvetica";
	declineInstruction2.size = 9;
	declineInstruction2.color = "#FFFFFF";

	declineInstruction = new Text();
	declineInstruction.window = license_info;
	declineInstruction.data = "Decline button below and destroy this Widget and its documentation.";
	declineInstruction.alignment = "center";
	declineInstruction.hOffset = 183;
	declineInstruction.vOffset = 248;
	declineInstruction.font = "Helvetica";
	declineInstruction.size = 9;
	declineInstruction.color = "#FFFFFF";

	licenseTaFrame = new Frame();					// new in version 5.0
	license_info.appendChild(licenseTaFrame);
	licenseTaFrame.hOffset = 35;
	licenseTaFrame.vOffset = 45;
	licenseTaFrame.width = 296;
	licenseTaFrame.height = 177;
	licenseTaFrame.hAlign = "left";
	licenseTaFrame.vAlign = "top";
	licenseTaFrame.tooltip = "Alt-click to see the full license text.";

	licenseVsb = new ScrollBar();					// new in version 5.0
	license_info.appendChild(licenseVsb);
	licenseVsb.orientation = "vertical";
	licenseVsb.opacity = "128";
	licenseVsb.height = "177";
	licenseVsb.hOffset = "318";
	licenseVsb.vOffset = "45";
	licenseVsb.thumbColor = "#000000";

	licenseTaFrame.vScrollBar = licenseVsb;

	license = new Text();							// was TextArea
	licenseTaFrame.appendChild(license);
	license.data = "";
	license.hOffset = 0;
	license.vOffset = 0;
	license.width = 284;
	license.height = 275;
	license.hAlign = "left";
	license.font = "Helvetica";
	license.size = 11;
	license.color = "#FFFFFF";
	license.bgColor = "#25443C";
	license.opacity = 255;
	license.bgOpacity = 192;
	license.wrap = true;
	license.onMouseUp = showLicense;

	acceptShadow = new Text();
	acceptShadow.window = license_info;
	acceptShadow.data = "Accept";
	acceptShadow.hOffset = 329;
	acceptShadow.vOffset = 279;
	acceptShadow.alignment = "right";
	acceptShadow.font = "Helvetica, Arial Bold";
	acceptShadow.size = 11;
	acceptShadow.color = "#FFFFFF";
	acceptShadow.opacity = 192;
	acceptShadow.onMouseUp = acceptLicense;

	accept = new Text();
	accept.window = license_info;
	accept.data = "Accept";
	accept.hOffset = 329;
	accept.vOffset = 278;
	accept.alignment = "right";
	accept.font = "Helvetica, Arial Bold";
	accept.size = 11;
	accept.color = "#000000";
	accept.opacity = 192;

	declineShadow = new Text();
	declineShadow.window = license_info;
	declineShadow.data = "Decline";
	declineShadow.hOffset = 236;
	declineShadow.vOffset = 279;
	declineShadow.alignment = "left";
	declineShadow.font = "Helvetica, Arial Bold";
	declineShadow.size = 11;
	declineShadow.color = "#FFFFFF";
	declineShadow.opacity = 192;
	declineShadow.onMouseUp = closeTheWidget;

	decline = new Text();
	decline.window = license_info;
	decline.data = "Decline";
	decline.hOffset = 236;
	decline.vOffset = 278;
	decline.alignment = "left";
	decline.font = "Helvetica, Arial Bold";
	decline.size = 11;
	decline.color = "#000000";
	decline.opacity = 192;

	license.data = filesystem.readFile("Resources/License/license.txt");

	if (preferences.licenseHide.value === "0") {
		mainWindow.visible = false;
		license_info.visible = true;
		license_info.focus();
	} else {
		license_info.visible = false;
		mainWindow.visible = true;
		mainWindow.focus();
	}
}
