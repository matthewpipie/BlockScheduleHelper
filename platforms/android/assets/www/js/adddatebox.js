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
var adddatebox = {
	sortedSchedule: "",
	showWeekendAndDate: true,
	hasSetDayCounter: false,
	daycounter: 0,
	currentlyEditing: {},
	schoolClasses: {},
	datebox: '' +
'<div id="datebox">' +
	'<span id="leftbutton"><span id="bar1"></span><span id="bar2"></span></span>' +
	'<span id="date"></span>' +
	'<span id="rightbutton"><span id="bar3"></span><span id="bar4"></span></span>' +
'</div>',
	days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
	startEndDifferenceMS: 60,

	waitUntilDateSet: function() {
		if (!dateConverter.dateSet) {
			setTimeout(adddatebox.waitUntilDateSet, 10);
			return;
		}
		setTimeout(dateConverter.resetDateSet, 11);

		if (!adddatebox.hasSetDayCounter && !adddatebox.showWeekendAndDate) {
			adddatebox.hasSetDayCounter = true;
			localforage.getItem('currentDay').then(function(value) {
				dateConverter.currentDay = value;
				adddatebox.changeCounter(value);
			});
			return;
		}

		localforage.getItem('dateformat').then(function(value) {

			if (value == undefined) {
				value = 0;
				localforage.setItem('dateformat', value);
			}

			localforage.getItem('twelveHourTime').then(function(value2) {

				if (value2 == undefined) {
					value2 = false;
					localforage.setItem('twelveHourTime', value2);
				}

				var formatteddate = adddatebox.days[dateConverter.currentDate.getDay()].substr(0, 3) + " ";
				var month = (parseInt(dateConverter.currentDate.getMonth()) + 1).toString();
				var day = dateConverter.currentDate.getDate();
				switch(value) {
					case 1:
						formatteddate += day + "/" + month;
						break;
					case 2:
						if (month.length == 1) {
							month = "0" + month;
						}
						if (day.toString().length == 1) {
							day = "0" + day;
						}
						formatteddate += "--" + month + "-" + day;
						break;
					default:
						formatteddate += month + "/" + day;
						break;
				}

				var today = new Date();

				if (today.toDateString() === dateConverter.currentDate.toDateString()) {
					$("#date").addClass("currentDay");
				}
				else {
					$("#date").removeClass("currentDay");
				}

				if (dateConverter.currentDate.getDay() == 0 || dateConverter.currentDate.getDay() == 6) {
					$("#date").text(formatteddate);
					adddatebox.updateDateBox(null)
				} else {
					$("#date").text("Day " + parseInt(dateConverter.currentDay + 1).toString() + " - " + formatteddate);

					adddatebox.updateDateBox(dateConverter.currentDay, value2);
				}
			});
			

		});

	},

	updateDay: function(amt) {
		if (amt === "") {
			dateConverter.currentDate.setTime(new Date().getTime());
		} else {
			for (var i = 0; i < Math.abs(amt); i++) {
				if (Math.abs(amt) === amt) {
					dateConverter.currentDate.setDate(dateConverter.currentDate.getDate() + 1);
				} else {
					dateConverter.currentDate.setDate(dateConverter.currentDate.getDate() - 1);
				}
			}
		}

		dateConverter.getDay();
		adddatebox.waitUntilDateSet();

	},

	convertTimeToTwelveHour: function(time, continuer) {
		if (!continuer) {
			var hoursS = time.substr(0, 2);
			if (hoursS != parseInt(hoursS).toString()) {
				return time.substr(1);
			}
			else {
				return time;
			}
		}

		var finalTime = "";
		var hours = parseInt(time.substr(0, 2));

		if (hours == 12) {
			finalTime = time + " PM";
		}
		else if (hours == 0) {
			finalTime += "12";
			finalTime += time.substr(2);
			finalTime += " AM";
		}
		else if (hours % 12 != hours) {
			finalTime += hours % 12;
			finalTime += time.substr(2);
			finalTime += " PM";
		}
		else {
			finalTime += hours;
			finalTime += time.substr(2);
			finalTime += " AM";
		}

		return finalTime;

	},

	findClass: function(schoolClassIDToFind, partToFind) {
		for (var i = 0; i < adddatebox.schoolClasses.length; i++) {
			if (adddatebox.schoolClasses[i]['id'] == schoolClassIDToFind) {
				return adddatebox.schoolClasses[i][partToFind];
			}
		}
	},

	updateDateBox: function(blockDay, twelveHourTime) {
		var $scheduletable = $("#scheduletable");
		$scheduletable.html("<tr><th>Time</th><th>Class</th></tr>");
		if (blockDay != null && adddatebox.sortedSchedule[blockDay] != null) {

			for (var i = 0; i < adddatebox.sortedSchedule[blockDay].length; i++) {
//TODO:
//look for proper actual class in localforage(classes)
//
				$scheduletable.append("<tr class='rowid" + (adddatebox.sortedSchedule[blockDay][i]['isGlobal'] ? " global" : "") + "' id='row" + adddatebox.sortedSchedule[blockDay][i]['id'] + "' style='color: " +
					(adddatebox.findClass(adddatebox.sortedSchedule[blockDay][i]['className'], 'whiteText') ? "white" : "black") +
					";'><td>" +
					adddatebox.convertTimeToTwelveHour(adddatebox.sortedSchedule[blockDay][i]['starttime'], twelveHourTime) +
					" - " +
					adddatebox.convertTimeToTwelveHour(adddatebox.sortedSchedule[blockDay][i]['endtime'], twelveHourTime) +
					"</td><td>" +
					adddatebox.findClass(adddatebox.sortedSchedule[blockDay][i]['className'], 'className') +
					(adddatebox.findClass(adddatebox.sortedSchedule[blockDay][i]['className'], 'room') == "" ? "" : " (" + adddatebox.findClass(adddatebox.sortedSchedule[blockDay][i]['className'], 'room') + ")"));
				$("#row" + adddatebox.sortedSchedule[blockDay][i]['id'] + " td").css('background', adddatebox.findClass(adddatebox.sortedSchedule[blockDay][i]['className'], 'bgcolor'));
			}
			
		}
	},

	decompress: function(infos, infos2) {
		var sortedinfos = [];
		for (var i = 0; i < infos.length; i++) {
			if (infos[i] == undefined) {
				infos[i] = [];
			}
			var temp = [];
			for (var j = 0; j < infos[i].length; j++) {
				var temptime = infos[i][j]['starttime'].split(":");
				temp.push({'id': infos[i][j]['id'], 'starttime': parseInt(temptime[0] * 60 + temptime[1])});
			}
			for (var l = 0; l < infos2.length; l++) {
				var temptime = infos2[l]['starttime'].split(":");
				temp.push({'id': infos2[l]['id'], 'starttime': parseInt(temptime[0] * 60 + temptime[1])});
			}

			var sortedinfo = [];

			temp.sort(function(a, b) {return parseInt(a['starttime'], 10) - parseInt(b['starttime'], 10);})

			for (var k = 0; k < temp.length; k++) {
				var filter1 = infos[i].filter(function(obj) {return obj.id == temp[k]['id'];})[0];
				var filter2 = infos2.filter(function(obj) {return obj.id == temp[k]['id'];})[0];
				if (filter1 != undefined) {
					sortedinfo.push(filter1);
				}
				if (filter2 != undefined) {
					sortedinfo.push(filter2);
				}
			}
			sortedinfos[i] = sortedinfo;
		}

		console.log(sortedinfos);
		return sortedinfos;
	},

	scheduleCallback: function(value, value2, value3) {
		if (value3 == undefined) {
			value3 = 7;
			localforage.setItem('daysperweek', value3);
		}
		if (adddatebox.schoolClasses.length == 0) {
			$('.plusbuttonholder').css('display', 'none');
			$('#content').append("<p>Add some classes by clicking on the menu and navigating to the Class Editor.  Then, after adding classes, go to the Schedule Editor to add them into a place on your schedule at a specific day.  Go to settings to change the current school day to something else.</p>");
		}
		if (value == undefined) {
			value = [];
			for (var i = 0; i < value3; i++) {
				value[i] = [];
			}
			localforage.setItem('schedule', value);
			dateConverter.setDateDay("", 0);

		}
		if (value.length == 0) {
			value = [];
			for (var i = 0; i < value3; i++) {
				value[i] = [];
			}
			localforage.setItem('schedule', value);
		}
		if (value2 == undefined) {
			value2 = [];
			localforage.setItem('globalSchedule', value2);
		}

		if (value3) {
			value.length = value3;
			localforage.setItem('schedule', value);
		}

		adddatebox.sortedSchedule = adddatebox.decompress(value, value2);
	},

	changeCounter: function(direction) {
		adddatebox.removeClickies(adddatebox.daycounter);
		localforage.getItem('daysperweek').then(function(value) {
			if (value == undefined) {
				localforage.setItem('daysperweek', 7);
				value = 7;
			}
			localforage.getItem('twelveHourTime').then(function(value2) {
				if (value2 == undefined) {
					localforage.setItem('twelveHourTime', false);
					value2 = false;
				}

				adddatebox.daycounter += direction;
				adddatebox.daycounter %= value;

				if (adddatebox.daycounter < 0) {
					adddatebox.daycounter += value;
				}

				$("#date").text("Day " + parseInt(adddatebox.daycounter + 1).toString());
				adddatebox.updateDateBox(adddatebox.daycounter, value2);
				console.log(adddatebox.daycounter);
				adddatebox.updateClickies(adddatebox.daycounter);

			});

		});

	},

	gotClick: function(direction) {
		if (adddatebox.showWeekendAndDate) {
			adddatebox.updateDay(direction);
		}
		else {
			adddatebox.changeCounter(direction);
		}
	},

	calculateTimeDifference: function() {
		var newStart = $("#formstarttime").val();
		var newEnd = $("#formendtime").val();
		
		var startDate = new Date()
		startDate.setHours(newStart.substr(0,2));
		startDate.setMinutes(newStart.substr(3));
		startDate.setSeconds(0);
		startDate.setMilliseconds(0);

		var endDate = new Date()
		endDate.setHours(newEnd.substr(0,2));
		endDate.setMinutes(newEnd.substr(3));
		endDate.setSeconds(0);
		endDate.setMilliseconds(0);


		adddatebox.startEndDifferenceMS = endDate - startDate;
	},

	startTimeChange: function() {
		var newVal = $('#formstarttime').val();
		if (newVal !== "") {
			var newDate = new Date()
			newDate.setHours(newVal.substr(0,2));
			newDate.setMinutes(newVal.substr(3));
			newDate.setSeconds(0);
			newDate.setMilliseconds(adddatebox.startEndDifferenceMS);
			var hours = newDate.getHours();
			var minutes = newDate.getMinutes();
			var addZeroHours = '';
			var addZeroMinutes = '';
			if (hours < 10) {
				addZeroHours = '0';
			}
			if (minutes < 10) {
				addZeroMinutes = '0';
			}
			$("#formendtime").val(addZeroHours + hours + ':' + addZeroMinutes + minutes);
		}
	},

	setUpClicks: function() {
		$('#leftbutton').on('touchend', function() {if (addmenu.checkOpen()) {return} adddatebox.gotClick(-1);});
		$('#rightbutton').on('touchend', function() {if (addmenu.checkOpen()) {return} adddatebox.gotClick(1);});
		$('#formsubmit').on('touchend', function(ev) {if (addmenu.checkOpen()) {return} ev.preventDefault(); adddatebox.handleSubmit()});
		$('#formremove').on('touchend', function(ev) {if (addmenu.checkOpen()) {return} ev.preventDefault(); adddatebox.confirmRemove();});
		$('.plusbuttonholder').on('touchend', function(ev) {if (addmenu.checkOpen()) {return} ev.preventDefault(); adddatebox.addSchoolClass(adddatebox.daycounter)})
		$('#formname').on('touchend', function() {if (addmenu.checkOpen()) {return} $(this).select();});
		$('#formstarttime').change(adddatebox.startTimeChange);
		$('#formendtime').change(adddatebox.calculateTimeDifference);
	},

	confirmRemove: function() {
		navigator.notification.confirm("Are you sure you want to remove this entry?  This action can NOT be undone.", adddatebox.removeForm, "Delete Entry");
	},

	pagecontainerbeforeshow: function() {
		$('#content').prepend(adddatebox.datebox);
	},

	deviceready: function() {
		localforage.getItem('schedule').then(function(value) {
			localforage.getItem('globalSchedule').then(function(value2) {
				localforage.getItem('daysperweek').then(function(value3) {
					localforage.getItem('schoolClasses').then(function(value4) {
						adddatebox.loadClasses(value4);
						adddatebox.scheduleCallback(value, value2, value3);
						adddatebox.updateDay(0);
					});
				});
			});
		});
		//adddatebox.scheduleCallback([[new testconstructor('0', 'math', '13:45', '13:46', false, false), new testconstructor('1', 'english', '14:05', '19:05', true, false)], [new testconstructor('2', 'study hallo', '8:56', '12:45', false, false)]], [new testconstructor('3', 'globaltest', '13:45', '21:43', false, true)]);
		adddatebox.setUpClicks();

	},

	loadClasses: function(value4) {
		if (value4 == undefined) {
			value4 = [];
		}
		adddatebox.schoolClasses = value4; //[{name: "Math", color: "#123456", id=4, whiteText: false, room: "M169"}]

		for (var i = 0; i < adddatebox.schoolClasses.length; i++) {
			$('#formname').append("<option value='" + adddatebox.schoolClasses[i]['id'] + "'>" + adddatebox.schoolClasses[i]['className'] +
				(adddatebox.schoolClasses[i]['room'] == "" ? "" : " (" + adddatebox.schoolClasses[i]['room'] + ")") + "</option>");
		}


	},

	//EDITING

	addSchoolClass: function(dayofschoolweek) { //generate blank class with id
		//make sure to store into localforage at the end, then call editschoolclass()
		//find highest id rn
		var highest = -1;
		for (var i = 0; i < adddatebox.sortedSchedule.length; i++) {
			if (adddatebox.sortedSchedule[i] == undefined) {continue;}
			for (var j = 0; j < adddatebox.sortedSchedule[i].length; j++) {
				if (parseInt(adddatebox.sortedSchedule[i][j]['id']) > highest) {
					highest = parseInt(adddatebox.sortedSchedule[i][j]['id']);
				}
			}
		}
		var classList = $(".rowid");
		var st = "";
		if (classList.length) {
			var classElementID = classList[classList.length - 1].id.substr(3);
			for (var i = 0; i < adddatebox.sortedSchedule.length; i++) {
				if (adddatebox.sortedSchedule[i] == undefined) {continue;}
				for (var j = 0; j < adddatebox.sortedSchedule[i].length; j++) {
					if (adddatebox.sortedSchedule[i][j]['id'] === classElementID) {
						st = adddatebox.sortedSchedule[i][j]['endtime'];
						break;
					}
				}
			}
		}
		
		if (st === "") {
			st = "07:30";
		}
		localforage.getItem('schoolClasses').then(function(val) {
			var tempSchoolClass = {'className': val[0].id, 'starttime': st, 'endtime': "00:00", 'id': (highest + 1).toString(), 'isGlobal': false};
			adddatebox.startEndDifferenceMS = 3600000;
			adddatebox.editSchoolClass(tempSchoolClass, dayofschoolweek, true);
		});

	},

	editSchoolClass: function(schoolClass, dayofschoolweek, isNew) {
		//edit popup
		//set up submit button (maybe in setbinds) to set it in storage

		if (isNew) {
			$('.ui-block-a').css('display', 'none');
			$('.ui-block-b').css('width', '100%');
		}
		else {
			$('.ui-block-a').css('display', 'block');
			$('.ui-block-b').css('width', '50%');
		}


		console.log(schoolClass);
		$('#formname').val(schoolClass['className']).change();
		if (schoolClass['starttime'].length == 4) {
			schoolClass['starttime'] = "0" + schoolClass['starttime'];
		}
		$('#formstarttime').val(schoolClass['starttime']);
		
		if (schoolClass['endtime'].length == 4) {
			schoolClass['endtime'] = "0" + schoolClass['endtime'];
		}
		$('#formendtime').val(schoolClass['endtime']);

		if (schoolClass['isGlobal']) {
			$('#formglobal')[0].checked = true;
			$("#formglobal").flipswitch("refresh");
		} else {
			$('#formglobal')[0].checked = false;
			$("#formglobal").flipswitch("refresh");
		}

		adddatebox.currentlyEditing = {'schoolClass': schoolClass, 'dayofschoolweek': dayofschoolweek, 'isNew': isNew};

		if (isNew) {
			adddatebox.startTimeChange();
		}

		adddatebox.calculateTimeDifference();

		$('#openpopup').popup('open');
		setTimeout(function() {document.activeElement.blur();}, 10);
	},


	//MANAGING CLICKS
	removeForm: function(buttonIndex) {
		if (buttonIndex == 1) {
			$('#openpopup').popup('close');
			if (adddatebox.currentlyEditing['isNew']) {return;}
			localforage.getItem('schedule').then(function(unmodSchedule) {
				localforage.getItem('globalSchedule').then(function(unmodGlobalSchedule) {
					if (adddatebox.currentlyEditing['schoolClass']['isGlobal']) {
					//remove globally
						var i = 0;
						for (i = 0; i < unmodGlobalSchedule.length; i++) {
							if (unmodGlobalSchedule[i]['id'] == adddatebox.currentlyEditing['schoolClass']['id']) {
								break;
							}
						}

						unmodGlobalSchedule.splice(i, 1);
						localforage.setItem('globalSchedule', unmodGlobalSchedule).then(function(value) {
							adddatebox.scheduleCallback(unmodSchedule, value, false);
							adddatebox.changeCounter(0);
							localforage.getItem('pushNotifications').then(function(val) {
								if (val) {
									cordova.plugins.notification.local.cancelAll(function() {
										setUpSettings.scheduleNextEventAndClear(null, true, false);
									});
								}
							});
						});
					} else {
						//remove on day
						var i;
						for (i = 0; i < unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']].length; i++) {
							if (unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']][i]['id'] == adddatebox.currentlyEditing['schoolClass']['id']) {
								break;
							}
						}
						unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']].splice(i, 1);
						localforage.setItem('schedule', unmodSchedule).then(function(value) {
							adddatebox.scheduleCallback(value, unmodGlobalSchedule, false);
							adddatebox.changeCounter(0);
							localforage.getItem('pushNotifications').then(function(val) {
								if (val) {
									cordova.plugins.notification.local.cancelAll(function() {
										setUpSettings.scheduleNextEventAndClear(null, true, false);
									});
								}
							});
						});
					}
				});
				
			});

		}
	},

	removeClickies: function(dayofschoolweek) {
		$('.rowid').unbind('click');
		console.log('removeing click');
	},

	updateClickies: function(dayofschoolweek) {
		console.log('updating clickies');
		$('.rowid').on('touchend', function(ev) {
			if (addmenu.checkOpen()) {return}
			ev.preventDefault();
			console.log('clickerino');
			console.log(adddatebox.sortedSchedule[dayofschoolweek]);
			console.log(dayofschoolweek);
			for (var i = 0; i < adddatebox.sortedSchedule[dayofschoolweek].length; i++) {
				if (typeof($(this).attr('id')) == "string") {
					if (adddatebox.sortedSchedule[dayofschoolweek][i]['id'] == $(this).attr('id').substr(3)) {
						adddatebox.editSchoolClass(adddatebox.sortedSchedule[dayofschoolweek][i], dayofschoolweek, false);
					}
				}
			}
		});
	},

	handleSubmit: function() {
		$('#openpopup').popup('close');

		if ($('#formstarttime').val() == "" || $('#formendtime').val() == "" || $('#formname').val() == undefined) {

			navigator.notification.alert("Error in saving data.  Did you fill out all forms?", null, "Error", "OK");
			return;
		}

		localforage.getItem('schedule').then(function(unmodSchedule) {
			localforage.getItem('globalSchedule').then(function(unmodGlobalSchedule) {

				if (unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']] == undefined) {
					unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']] = [];
				}
				if (adddatebox.currentlyEditing['isNew']) {
					unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']].push(adddatebox.currentlyEditing['schoolClass'])
				}

				var correctClass = {'id': adddatebox.currentlyEditing['schoolClass']['id']};
				correctClass['className'] = $("#formname").val();
				correctClass['starttime'] = $("#formstarttime").val();
				correctClass['endtime'] = $("#formendtime").val();
				correctClass['isGlobal'] = $('#formglobal')[0].checked;

				if (correctClass['isGlobal'] && !adddatebox.currentlyEditing['schoolClass']['isGlobal']) {
					//USER MADE IT GLOBAL
					//pop old one using filter
					var i = 0;
					for (i = 0; i < unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']].length; i++) {
						if (unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']][i]['id'] == correctClass['id']) {
							break;
						}
					}

					unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']].splice(i, 1);
					unmodGlobalSchedule.push(correctClass);

					localforage.setItem('globalSchedule', unmodGlobalSchedule).then(function(val) {
						localforage.setItem('schedule', unmodSchedule).then(function(val2) {
							adddatebox.scheduleCallback(val2, val, false);
							adddatebox.changeCounter(0);
							localforage.getItem('pushNotifications').then(function(val) {
								if (val) {
									cordova.plugins.notification.local.cancelAll(function() {
										setUpSettings.scheduleNextEventAndClear(null, true, false);
									});
								}
							});
						});
					});

				} else if (!correctClass['isGlobal'] && adddatebox.currentlyEditing['schoolClass']['isGlobal']) {
					//USER MADE IT NON-GLOBAL
					var i = 0;

					for (i = 0; i < unmodGlobalSchedule.length; i++) {
						if (unmodGlobalSchedule[i]['id'] == correctClass['id']) {
							break;
						}
					}

					unmodGlobalSchedule.splice(i, 1);

					unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']].push(correctClass);

					localforage.setItem('globalSchedule', unmodGlobalSchedule).then(function(val) {
						localforage.setItem('schedule', unmodSchedule).then(function(val2) {
							adddatebox.scheduleCallback(val2, val, false);
							adddatebox.changeCounter(0);
							localforage.getItem('pushNotifications').then(function(val) {
								if (val) {
									cordova.plugins.notification.local.cancelAll(function() {
										setUpSettings.scheduleNextEventAndClear(null, true, false);
									});
								}
							});
						});
					});

				} else if (correctClass['isGlobal'] && adddatebox.currentlyEditing['schoolClass']['isGlobal']) {
					//WAS STILL GLOBAL
					var i;
					for (i = 0; i < unmodGlobalSchedule.length; i++) {
						if (unmodGlobalSchedule[i]['id'] == correctClass['id']) {
							break;
						}
					}
					unmodGlobalSchedule[i] = correctClass;

					localforage.setItem('globalSchedule', unmodGlobalSchedule).then(function(val) {
						adddatebox.scheduleCallback(unmodSchedule, val, false);
						adddatebox.changeCounter(0);
						localforage.getItem('pushNotifications').then(function(val) {
							if (val) {
								cordova.plugins.notification.local.cancelAll(function() {
									setUpSettings.scheduleNextEventAndClear(null, true, false);
								});
							}
						});
					});
				} else {
					//STILL NOT GLOBAL
					var i;
					for (i = 0; i < unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']].length; i++) {
						if (unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']][i]['id'] == correctClass['id']) {
							break;
						}
					}

					unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']][i] = correctClass;

					localforage.setItem('schedule', unmodSchedule).then(function(val) {
						adddatebox.scheduleCallback(val, unmodGlobalSchedule, false);
						adddatebox.changeCounter(0);
						localforage.getItem('pushNotifications').then(function(val) {
							if (val) {
								cordova.plugins.notification.local.cancelAll(function() {
									setUpSettings.scheduleNextEventAndClear(null, true, false);
								});
							}
						});
					});
				}
			});
		});

		//edit object, store back into localforage, re-decompress and refresh display
	}

}

/*
EXAMPLE SCHEDULE:

[[{class, starttime, endtime, id}, second class object in day 1] day 2]

[[{'id': '0', 'class': 'Math', 'starttime': '13:45', 'endtime': '13:46'}, {'id': '1', 'class': 'Math2', 'starttime': '13:50', 'endtime': '13:55'}]]

*/
