/* Block Schedule Helper - A simple app to keep track of block schedules.
 * Copyright (C) 2016 Matthew Giordano
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Contact the creator (Matthew Giordano) at matthewpipie@gmail.com.
 */

"use strict";
var timeouts = [];
var setUpSettings = {

	twelveHourTime: false,
	pushNotifications: false,
	dateformat: 0,
	daysperweek: 7,
	ready: false,
	day: false,

	pagecontainerbeforeshow: function() {
	},
	deviceready: function() {
		setUpSettings.loadSettings();
		setUpSettings.updateSettings();
		$('#formsubmit').on('touchend', function(ev) {if (addmenu.checkOpen()) {return} ev.preventDefault(); setUpSettings.handleSubmit()});
		$('#formdays').change(setUpSettings.verifyDay);
		$('#formtoday').change(setUpSettings.verifyToday);
		$('#formreset').on('touchend', function(ev) {if (addmenu.checkOpen()) {return} ev.preventDefault(); setUpSettings.confirmReset()});
		$('#formreset2').on('touchend', function(ev) {if (addmenu.checkOpen()) {return} ev.preventDefault(); setUpSettings.confirmReset2()});

		var today = new Date();
		if (today.getDay() == 6 || today.getDay() == 0) {
			$("#mondayOrToday").text("Monday");
		}

	},

	updateSettings: function() {
		if (!setUpSettings.ready) {
			setTimeout(setUpSettings.updateSettings, 10);
			return;
		}
		$("#formtime")[0].checked = setUpSettings.twelveHourTime;
		$("#formtime").flipswitch("refresh");

		$("#formnotifications")[0].checked = setUpSettings.pushNotifications;
		$("#formnotifications").flipswitch("refresh");

		$("#formselect").val(setUpSettings.dateformat).change();

		$("#formdays").val(setUpSettings.daysperweek);
		
		dateConverter.currentDate = new Date();
		dateConverter.getDay();

		setTimeout(setUpSettings.checkDateRan, 10);

	},

	verifyDay: function() {
		if (!$("#formdays").val() || $("#formdays").val() != parseInt($("#formdays").val())) {
			$("#formdays").val(7);
		}
		else if (parseInt($("#formdays").val()) < 1) {
			$("#formdays").val(1);
		}
		setUpSettings.verifyToday();
	},
	verifyToday: function() {
		var daysperweek = parseInt($("#formdays").val());
		var currentDay = parseInt($("#formtoday").val());
		if (!$("#formtoday").val() || $("#formtoday").val() != parseInt($("#formtoday").val())) {
			currentDay = 1;
		}
		if (currentDay > daysperweek) {
			currentDay %= daysperweek;
		}
		if (currentDay < 1) {
			currentDay = daysperweek;
		}
		$('#formtoday').val(currentDay);
	},

	confirmReset: function() {
		navigator.notification.confirm("Are you sure you would like to delete your schedule?  This can NOT be undone.", setUpSettings.handleReset, "Reset Schedule");
	},
	confirmReset2: function() {
		navigator.notification.confirm("Are you sure you would like to delete your schedule and all of your classes?  This can NOT be undone.", setUpSettings.handleReset2, "Reset Everything");
	},
	handleReset: function(buttonIndex) {
		if (buttonIndex == 1) {
			localforage.setItem('schedule', undefined);
			localforage.setItem('globalSchedule', undefined);
			navigator.notification.alert("Schedule deleted.");
		}
	},
	handleReset2: function(buttonIndex) {
		if (buttonIndex == 1) {
			localforage.setItem('schedule', []);
			localforage.setItem('globalSchedule', undefined);
			localforage.setItem('schoolClasses', undefined);
			navigator.notification.alert("Schedule and classes deleted.");
		}
	},

	scheduleNextEventAndClear: function(notification, isInit) {
		if (isInit == undefined) {
			isInit = false;
		}
		//settimout for x minutes to wipe notifications
		//make next notification
		localforage.getItem('schoolClasses').then(function(schoolClasses) {
			localforage.getItem('schedule').then(function(schedule) {
				localforage.getItem('globalSchedule').then(function(globalSchedule) {
					localforage.getItem('daysperweek').then(function(daysperweek) {
						localforage.getItem('dateday').then(function(dateday) {
							if (schoolClasses == undefined) {
								schoolClasses = [];
								localforage.setItem('schoolClasses', schoolClasses);
							}
							if (schedule == undefined) {
								schedule = [];
								localforage.setItem('schedule', schedule);
							}
							if (globalSchedule == undefined) {
								globalSchedule = [];
								localforage.setItem('globalSchedule', globalSchedule);
							}
							if (daysperweek == undefined) {
								daysperweek = 7;
								localforage.setItem('daysperweek', daysperweek);
							}
							if (dateday == undefined) {
								dateday = {'date': new Date().toString(), 'day': 0};
							}

							var now = new Date();

							for (var i = 0; i < timeouts.length; i++) {
								clearTimeout(timeouts[i]);
							}

							var day = setUpSettings.calculateDay(dateday, daysperweek, new Date());
							if (schedule[day] == undefined) {
								schedule[day] = [];
							}

							var timeAndId = []; //{id: '5', starttime: 13546, endtime: 15493, isGlobal: false}
							for (var j = 0; j < schedule[day].length; j++) {
								var starttime = schedule[day][j]['starttime'];
								starttime = parseInt(starttime.substr(0, 2)) * 60 + parseInt(starttime.substr(3));
								var endtime = schedule[day][j]['endtime'];
								endtime = parseInt(endtime.substr(0, 2)) * 60 + parseInt(endtime.substr(3));
								timeAndId.push({'id': schedule[day][j]['id'], 'starttime': starttime, 'endtime': endtime, 'isGlobal': false});
							}
							for (var i = 0; i < globalSchedule.length; i++) {
								var starttime = globalSchedule[i]['starttime'];
								starttime = parseInt(starttime.substr(0, 2)) * 60 + parseInt(starttime.substr(3));
								var endtime = globalSchedule[i]['endtime'];
								endtime = parseInt(endtime.substr(0, 2)) * 60 + parseInt(endtime.substr(3));
								timeAndId.push({'id': globalSchedule[i]['id'], 'starttime': starttime, 'endtime': endtime, 'isGlobal': true});
							}
							var starttimeSorted = timeAndId.sort(function(a, b) {return parseInt(a['starttime'], 10) - parseInt(b['starttime'], 10);})
							var endtimeSorted = timeAndId.sort(function(a, b) {return parseInt(a['endtime'], 10) - parseInt(b['endtime'], 10);})
							
							var nowTime = now.getHours() * 60 + now.getMinutes();


							var firstStartTime;
							var isRegular = true;
							var hasfound1 = false;
							var hasfound2 = false;
							var hasfound3 = false;
							var i;
							var j;
							for (i = nowTime; i < 1439; i++) {
								if (starttimeSorted.filter(function(a) {return a['starttime'] == i}).length) {
									if (!hasfound1) {firstStartTime = i; hasfound1 = true; continue;}
									else {
										hasfound2 = true;
										break;
									}
								}
							}

							if (!hasfound1) {
								isRegular = false;
							}

							if (isInit) {
								var results = starttimeSorted.filter(function(a) {return a['starttime'] < nowTime && a['endtime'] > nowTime});

								if (firstStartTime - nowTime > 10 || results.length != 0) {
									//schedule aft
									i = firstStartTime;
									hasfound2 = true;
								}
								if (now.getDay() == 6 || now.getDay() == 0) {
									isRegular = false;
								}

								/* get closest ahead starttime and endtime before it
								if greater than 10 mins from now till next starttime AND isInit
								if less,
									if you are in a class AND isInit, schedule
									if not, skip one starttime and schedule then*/

							}
							
							if (!hasfound2) {
								isRegular = false;
							}

							if (isInit && firstStartTime - nowTime > 10) {
								j = i - 10;
								hasfound3 = true;
							}
							else {
								for (j = i; j >= 0; j--) {
									if (endtimeSorted.filter(function(a) {return a['endtime'] == j}).length) {
										hasfound3 = true;
										break;
									}
								}
							}

							

							if (!hasfound3) {
								isRegular = false;
							}
							var timeToClear;
							var timeToNotify;
							var classToNotify;
							var dateToNotify = new Date();
							if (isRegular) {
								timeToClear = i;
								timeToNotify = j;
								if (timeToClear - timeToNotify > 10) {
									timeToNotify = timeToClear - 10;
								}
								classToNotify = starttimeSorted.filter(function(a) {return a['starttime'] == timeToClear})[0];
								dateToNotify.setHours(0);
								dateToNotify.setSeconds(0);
								dateToNotify.setMilliseconds(0);
								dateToNotify.setMinutes(timeToNotify);
							}
							else {
								console.log('no bueno');
								var newDate = new Date();
								newDate.setHours(newDate.getHours() + 24);
								day = setUpSettings.calculateDay(dateday, daysperweek, newDate);
								var out = false;
								var k;
								for (k = 1; k < 29; k++) {
									console.log(day);
										console.log(newDate);
									if (schedule[day] == undefined) {
										schedule[day] = [];
									}
									if (schedule[day].length != 0 && newDate.getDay() < 6 && newDate.getDay() > 0) {
										console.log('we out fam');
										out = true;
										break;
									}
									else {
										console.log('stuck in eternal poo');

										newDate.setHours(newDate.getHours() + 24);
										day = setUpSettings.calculateDay(dateday, daysperweek, newDate);
									}
								}

								if (!out) {
									$("#formnotifications")[0].checked = false;
									$("#formnotifications").flipswitch("refresh");
									navigator.notification.alert("Error: Please create a schedule first.");
									setUpSettings.handleSubmit();
									return;
								}

								timeAndId = []; //{id: '5', starttime: 13546, endtime: 15493, isGlobal: false}
								for (var j = 0; j < schedule[day].length; j++) {
									var starttime = schedule[day][j]['starttime'];
									starttime = parseInt(starttime.substr(0, 2)) * 60 + parseInt(starttime.substr(3));
									var endtime = schedule[day][j]['endtime'];
									endtime = parseInt(endtime.substr(0, 2)) * 60 + parseInt(endtime.substr(3));
									timeAndId.push({'id': schedule[day][j]['id'], 'starttime': starttime, 'endtime': endtime, 'isGlobal': false});
								}
								for (var i = 0; i < globalSchedule.length; i++) {
									var starttime = globalSchedule[i]['starttime'];
									starttime = parseInt(starttime.substr(0, 2)) * 60 + parseInt(starttime.substr(3));
									var endtime = globalSchedule[i]['endtime'];
									endtime = parseInt(endtime.substr(0, 2)) * 60 + parseInt(endtime.substr(3));
									timeAndId.push({'id': globalSchedule[i]['id'], 'starttime': starttime, 'endtime': endtime, 'isGlobal': true});
								}
								starttimeSorted = timeAndId.sort(function(a, b) {return parseInt(a['starttime'], 10) - parseInt(b['starttime'], 10);})
								console.log(starttimeSorted);
								if (starttimeSorted.length == 0) {return;}
								timeToClear = starttimeSorted[0]['starttime'];
								console.log(timeToClear);
								timeToNotify = timeToClear - 10;
								classToNotify = starttimeSorted[0];
								dateToNotify = newDate;
								dateToNotify.setHours(0);
								dateToNotify.setSeconds(0);
								dateToNotify.setMilliseconds(0);
								dateToNotify.setMinutes(timeToNotify);
								nowTime = -(k * 1440)
								
							}

							if (classToNotify['isGlobal']) {
								classToNotify = globalSchedule.filter(function(a) {return a['id'] == classToNotify['id']})[0];
							}
							else {
								classToNotify = schedule[day].filter(function(a) {return a['id'] == classToNotify['id']})[0];
							}
							
							timeouts.push(setTimeout(function() {cordova.plugins.notification.local.clearAll();}, 1000 * 60 * (timeToClear - nowTime)));

							var bgcolor = setUpSettings.findClass(schoolClasses, classToNotify['className'], 'bgcolor');

							console.log(dateToNotify);

							var notiTitle = "Next class: " + setUpSettings.findClass(schoolClasses, classToNotify['className'], 'className') +
								(setUpSettings.findClass(schoolClasses, classToNotify['className'], 'room') == "" ? "" : " (" + setUpSettings.findClass(schoolClasses, classToNotify['className'], 'room') + ")");
							var notiText = "Starts in " + (timeToClear - timeToNotify).toString() + " minutes";

							if (now.toDateString() != dateToNotify.toDateString()) {
								notiText = notiTitle + " in 10";
								notiTitle = "Today is day " + (parseInt(day) + 1).toString();
							}

							var scheduleObj = { 
								id: 0,
								title: notiTitle,
								text: notiText,
								at: dateToNotify,
								led: (bgcolor == null ? "FFFFFF" : bgcolor.substr(1))
							};
							console.log(scheduleObj);
							console.log(timeToClear);
							console.log(timeToClear - nowTime);

							/*if (thingo) {
								scheduleObj['sound'] = xyz
							}*/

							cordova.plugins.notification.local.schedule(scheduleObj);
							if (isInit) {
								navigator.notification.alert("Notifications have been turned on.");
							}

						}); //if its past all endtimes, do tomorrow
					});
				});
			});
		});
	},

	findClass: function(schoolClasses, schoolClassIDToFind, partToFind) {
		for (var i = 0; i < schoolClasses.length; i++) {
			if (schoolClasses[i]['id'] == schoolClassIDToFind) {
				return schoolClasses[i][partToFind];
			}
		}
	},

	calculateDay: function(dateday, daysperweek, dateToFind) {
		var daysBetween = 0;
		var setDateO = new Date(dateday['date']);
		var setDay = dateday['day'];

		if (setDateO < dateToFind) { //set before datetofind, aka in the past
			daysBetween = (dateConverter.newGBDC(setDateO, dateToFind) - 1);
		} else {
			daysBetween = -(dateConverter.newGBDC(dateToFind, setDateO)) + 1;
		}

		daysBetween += setDay;

		daysBetween %= daysperweek;

		if (daysBetween < 0) {
			daysBetween += daysperweek;
		}
		return daysBetween;
	},

	handleSubmit: function() {
		console.log('saving');

		setUpSettings.verifyDay();
		var twelveHourTime = $("#formtime")[0].checked;
		var pushNotifications = $("#formnotifications")[0].checked;
		var dateformat = $("#formselect").val();
		var daysperweek = $("#formdays").val();
		var currentDay = $("#formtoday").val();

		localforage.setItem('twelveHourTime', twelveHourTime);
		localforage.setItem('pushNotifications', pushNotifications);
		localforage.setItem('dateformat', parseInt(dateformat));
		localforage.setItem('daysperweek', parseInt(daysperweek));
		localforage.setItem('currentDay', parseInt(currentDay));
		dateConverter.setDateDay("", parseInt(currentDay) - 1);

		if (pushNotifications && !(setUpSettings.pushNotifications)) {
			//turned on notifications
			cordova.plugins.notification.local.cancelAll(function() {
				setUpSettings.scheduleNextEventAndClear(null, true);
			});
		}
		else if (!(pushNotifications) && setUpSettings.pushNotifications) {
			//turned off notifications
			cordova.plugins.notification.local.cancelAll(function() {
				navigator.notification.alert("Notifications have been turned off.");
			});
		}
		setUpSettings.twelveHourTime = twelveHourTime;
		setUpSettings.pushNotifications = pushNotifications;
		setUpSettings.dateformat = dateformat;
		setUpSettings.daysperweek = daysperweek;
		navigator.notification.alert("Settings saved.");

	},
	loadSettings: function() {
		localforage.getItem('twelveHourTime').then(function(twelveHourTime) {
			if (twelveHourTime == undefined) {
				twelveHourTime = false;
				localforage.setItem('twelveHourTime', twelveHourTime);
			}
			localforage.getItem('pushNotifications').then(function(pushNotifications) {
				if (pushNotifications == undefined) {
					pushNotifications = false;
					localforage.setItem('pushNotifications', pushNotifications);
				}
				localforage.getItem('dateformat').then(function(dateformat) {
					if (dateformat == undefined) {
						dateformat = 0;
						localforage.setItem('dateformat', dateformat);
					}
					localforage.getItem('daysperweek').then(function(daysperweek) {
						if (daysperweek == undefined) {
							daysperweek = 7;
							localforage.setItem('daysperweek', daysperweek);
						}

						setUpSettings.twelveHourTime = twelveHourTime;
						setUpSettings.pushNotifications = pushNotifications;
						setUpSettings.dateformat = dateformat;
						setUpSettings.daysperweek = daysperweek;
						setUpSettings.ready = true;

					});
				});
			});
		});
	},
	checkDateRan: function() {
		if (dateConverter.firstTime) {
			setTimeout(setUpSettings.checkDateRan, 10);
			return;
		}

		var toAdd = 1;
		if (new Date().getDay() == 6 || new Date().getDay() == 0) {
			toAdd = 2;
		}

		$("#formtoday").val(dateConverter.firstDay + toAdd);
		setUpSettings.verifyToday();
		setUpSettings.day = dateConverter.firstDay;
	}

}
