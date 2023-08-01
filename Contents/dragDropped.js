/*
    Drag and Drop for Panzer Flip Clocks
    Copyright © 2008-2018 Harry Whitfield

    This program is free software; you can redistribute it and/or
    modify it under the terms of the GNU General Public License as
    published by the Free Software Foundation; either version 2 of
    the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public
    License along with this program; if not, write to the Free
    Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston,
    MA  02110-1301  USA

	Drag and Drop for Panzer Flip Clocks - version 1.0
    7 October, 2018
    Copyright © 2008-2018 Harry Whitfield
    mailto:g6auc@arrl.net
*/

/*jslint for, multivar */

/*property
    alarmSoundPref, copy, dataType, items, lastIndexOf, length, option,
    substring, value, widgetDataFolder
*/

"use strict";

var getFileType, getSoundFiles, eprint;

var gDefaultFile = "G6AUC.wav"; // in Resources folder
var gSoundFile = preferences.alarmSoundPref.value;
var gSoundFiles = [gDefaultFile];

function dragDropped(event) {
    var path, i;
    var items = event.items;
    var dataType = event.dataType;  // text, URLs or filenames
    var n = items.length;
    var fileType;

    function fileName(path) {
        var idx = path.lastIndexOf("/");

        return path.substring(idx + 1);
    }

	if (dataType === "filenames") {
		for (i = 0; i < n; i += 1) {
            path = items[i];
            fileType = getFileType(path);
            eprint("dragDropped:fileType: " + fileType);
            if (fileType === "sound") {
                eprint("dragDropped:Sound file: " + path);
                eprint("dragDropped:copy alarm: " + filesystem.copy(path, system.widgetDataFolder + "/Alarms"));
                gSoundFile = fileName(path);
                gSoundFiles = getSoundFiles();
                preferences.alarmSoundPref.option = gSoundFiles;
			} else {
        		beep();
        		eprint("dragDropped: Invalid fileType: " + fileType);
			}
		}
    } else {
        beep();
        eprint("dragDropped: Invalid dropType: " + dataType);
    }
}
