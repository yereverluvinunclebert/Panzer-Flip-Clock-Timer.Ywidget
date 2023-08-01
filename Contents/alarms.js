/*
    Alarm Sounds
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

    Alarm Sounds - version 1.0.1
    7 October, 2018
    Copyright © 2008-2018 Harry Whitfield
    mailto:g6auc@arrl.net
*/

/*jslint for */

/*property
    alarmPref, alarmSoundPref, copy, createDirectory, dataType,
    deleteSoundPref, getDirectoryContents, isDirectory, itemExists, items,
    lastIndexOf, length, option, remove, substring, value, widgetDataFolder
*/

"use strict";

var gDefaultFile = "G6AUC.wav"; // in Resources folder
var gSoundFile = preferences.alarmSoundPref.value;
var gSoundFiles = [gDefaultFile];
var eprint;

function getSoundFiles() {
    var directory = system.widgetDataFolder + "/Alarms";
    var files = filesystem.getDirectoryContents(directory, false);
    var fileArray = [];
    var n = 1;
    var i;

    fileArray[0] = gDefaultFile;
    if (files !== null) {
        for (i = 0; i < files.length; i += 1) {
            if (files[i] !== ".DS_Store") {
                fileArray[n] = files[i];
                n += 1;
            }
        }
    }
    eprint("getSoundFiles: " + fileArray);
    return fileArray;
}

function makeAlarmDir() {
    var path = system.widgetDataFolder + "/Alarms";

    if (filesystem.itemExists(path) && filesystem.isDirectory(path)) {
        return;
    }
    eprint("makeAlarmDir:mkdir=" + filesystem.createDirectory(path));
}

function updateAlarmPrefs() {
    var file = preferences.alarmSoundPref.value;

    if (preferences.deleteSoundPref.value === "1") { // delete selected sound file
        preferences.deleteSoundPref.value = "0";
        if (file !== gDefaultFile) {
            filesystem.remove(system.widgetDataFolder + "/Alarms/" + file);
            gSoundFiles = getSoundFiles();
            preferences.alarmSoundPref.option = gSoundFiles;
            if (file === gSoundFile) {
                gSoundFile = gDefaultFile;
            }
        } else {
            beep();
        }
        preferences.alarmSoundPref.value = gSoundFile;
    } else {
        gSoundFile = file;
    }
}

function playAlarm() {
    if (preferences.alarmPref.value !== "1") {
        return;
    }
    if (gSoundFile === gDefaultFile) {
        play("Resources/sounds/" + gDefaultFile, true);
    } else {
        play(system.widgetDataFolder + "/Alarms/" + gSoundFile, true);
    }
}

makeAlarmDir();
gSoundFiles = getSoundFiles();
preferences.alarmSoundPref.option = gSoundFiles;
