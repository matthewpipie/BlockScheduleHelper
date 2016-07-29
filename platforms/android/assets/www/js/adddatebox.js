"use strict";
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var testconstructor = function(id, className, starttime, endtime, isBreak, isGlobal) {
	this.id = id;
	this.className = className;
	this.starttime = starttime;
	this.endtime = endtime;
	this.isBreak = isBreak;
	this.isGlobal = isGlobal;
};

var adddatebox = {
	sortedSchedule: "",
	showWeekendAndDate: true,
	hasSetDayCounter: false,
	daycounter: 0,
	currentlyEditing: {},

	datebox: '' +
'<div id="datebox">' +
	'<span id="leftbutton"><span id="bar1"></span><span id="bar2"></span></span>' +
	'<span id="date"></span>' +
	'<span id="rightbutton"><span id="bar3"></span><span id="bar4"></span></span>' +
'</div>',

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
			var formatteddate;
			var month = (parseInt(dateConverter.currentDate.getMonth()) + 1).toString();
			var day = dateConverter.currentDate.getDate();
			var year = dateConverter.currentDate.getFullYear();
			switch(value) {
				case 1:
					formatteddate = day + "/" + month + "/" + year;
					break;
				case 2:
					formatteddate = year + "/" + month + "/" + day;
					break;
				default:
					formatteddate = month + "/" + day + "/" + year;
					break;
			}

			if (dateConverter.currentDate.getDay() == 0 || dateConverter.currentDate.getDay() == 6) {
				$("#date").text("Weekend - " + formatteddate);
				adddatebox.updateDateBox(null)
			} else {
				$("#date").text("Day " + parseInt(dateConverter.currentDay + 1).toString() + " - " + formatteddate);

				adddatebox.updateDateBox(dateConverter.currentDay);
			}

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

	updateDateBox: function(blockDay) {
		var $scheduletable = $("#scheduletable");
		$scheduletable.html("<tr><th>Time</th><th>Class</th></tr>");
		if (blockDay != null && adddatebox.sortedSchedule[blockDay] != null) {
			for (var i = 0; i < adddatebox.sortedSchedule[blockDay].length; i++) {
				$scheduletable.append("<tr class='rowid" + (adddatebox.sortedSchedule[blockDay][i]['isBreak'] ? " break" : "") + "' id='row" + adddatebox.sortedSchedule[blockDay][i]['id'] + "'><td>" +
					adddatebox.sortedSchedule[blockDay][i]['starttime'] +
					" - " +
					adddatebox.sortedSchedule[blockDay][i]['endtime'] +
					"</td><td>" +
					adddatebox.sortedSchedule[blockDay][i]['className'] +
					" (" +
					adddatebox.sortedSchedule[blockDay][i]['room'] +
					")</td></tr>");
			}
		}
	},

	decompress: function(infos, infos2) {
		var sortedinfos = [];
		for (var i = 0; i < infos.length; i++) {
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

	scheduleCallback: function(value, value2) {
		if (value == undefined) {
			$('#content').append("Create a schedule by clicking on the menu icon!");
			value = [];
			localforage.setItem('schedule', value);
		}
		if (value2 == undefined) {
			value2 = [];
			localforage.setItem('globalSchedule', value2);
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

			adddatebox.daycounter += direction;
			adddatebox.daycounter %= value;

			if (adddatebox.daycounter < 0) {
				adddatebox.daycounter += 7;
			}

			$("#date").text("Day " + parseInt(adddatebox.daycounter + 1).toString());
			adddatebox.updateDateBox(adddatebox.daycounter);

			adddatebox.updateClickies(adddatebox.daycounter);

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

	setUpClicks: function() {
		$('#leftbutton').click(function() {adddatebox.gotClick(-1);});
		$('#rightbutton').click(function() {adddatebox.gotClick(1);});
		$('#formsubmit').click(function(ev) {ev.preventDefault(); adddatebox.handleSubmit()});
		$('.plusbuttonholder').click(function() {adddatebox.addSchoolClass(adddatebox.daycounter)})
	},

	pagecontainerbeforeshow: function() {
	$('#content').prepend(adddatebox.datebox); },

	deviceready: function() {
		localforage.getItem('schedule').then(function(value) {
			localforage.getItem('globalSchedule').then(function(value2) {
				adddatebox.scheduleCallback(value, value2);
			});
		});
		//adddatebox.scheduleCallback([[new testconstructor('0', 'math', '13:45', '13:46', false, false), new testconstructor('1', 'english', '14:05', '19:05', true, false)], [new testconstructor('2', 'study hallo', '8:56', '12:45', false, false)]], [new testconstructor('3', 'globaltest', '13:45', '21:43', false, true)]);
		adddatebox.updateDay(0);
		adddatebox.setUpClicks();

	},

	//EDITING

	addSchoolClass: function(dayofschoolweek) { //generate blank class with id
		//make sure to store into localforage at the end, then call editschoolclass()

		//find highest id rn
		var highest = -1;
		for (var i = 0; i < adddatebox.sortedSchedule.length; i++) {
			for (var j = 0; j < adddatebox.sortedSchedule[i].length; j++) {
				if (parseInt(adddatebox.sortedSchedule[i][j]['id']) > highest) {
					highest = parseInt(adddatebox.sortedSchedule[i][j]['id']);
				}
			}
		}
		var tempSchoolClass = {'className': "New Class", 'starttime': "00:00", 'endtime': "00:00", 'id': (highest + 1).toString(), 'isBreak': false, 'isGlobal': false, 'room': "R1"};
		adddatebox.editSchoolClass(tempSchoolClass, dayofschoolweek, true)

	},

	editSchoolClass: function(schoolClass, dayofschoolweek, isNew) {
		//edit popup
		//set up submit button (maybe in setbinds) to set it in storage
		$('#formname').val(schoolClass['className']);
		if (schoolClass['starttime'].length == 4) {
			schoolClass['starttime'] = "0" + schoolClass['starttime'];
		}
		$('#formstarttime').val(schoolClass['starttime']);
		
		if (schoolClass['endtime'].length == 4) {
			schoolClass['endtime'] = "0" + schoolClass['endtime'];
		}
		$('#formendtime').val(schoolClass['endtime']);

		if (schoolClass['isBreak']) {
			$('#formbreak')[0].checked = true;
			$("#formbreak").flipswitch("refresh");
		} else {
			$('#formbreak')[0].checked = false;
			$("#formbreak").flipswitch("refresh");
		}
		if (schoolClass['isGlobal']) {
			$('#formglobal')[0].checked = true;
			$("#formglobal").flipswitch("refresh");
		} else {
			$('#formglobal')[0].checked = false;
			$("#formglobal").flipswitch("refresh");
		}
		$("#formroom").val(schoolClass['room']);

		adddatebox.currentlyEditing = {'schoolClass': schoolClass, 'dayofschoolweek': dayofschoolweek, 'isNew': isNew};;
		console.log(adddatebox.currentlyEditing);

		$('#openpopup').popup('open');
	},


	//MANAGING CLICKS

	removeClickies: function(dayofschoolweek) {
		$('.rowid').unbind('click');
	},

	updateClickies: function(dayofschoolweek) {
		$('.rowid').click(function() {
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

		if ($('#formstarttime').val() == "" || $('#formendtime').val() == "") {

			navigator.notification.alert("Error in saving data.  Did you fill out all forms?", null, "Error", "OK");
			return;
		}

		localforage.getItem('schedule').then(function(unmodSchedule) {
			localforage.getItem('globalSchedule').then(function(unmodGlobalSchedule) {

				if (unmodSchedule == undefined) {
					console.log(unmodSchedule);
					localforage.setItem('schedule', []);
					unmodSchedule = [];
				}
				if (unmodGlobalSchedule == undefined) {
					localforage.setItem('globalSchedule', []);
					unmodGlobalSchedule = [];
				}
				if (unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']] == undefined) {
					unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']] = [];
				}
				if (adddatebox.currentlyEditing['isNew']) {
					unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']].push(adddatebox.currentlyEditing['schoolClass'])
				}

				var correctClass = adddatebox.currentlyEditing['schoolClass'];
				correctClass['className'] = $("#formname").val();
				correctClass['starttime'] = $("#formstarttime").val();
				correctClass['endtime'] = $("#formendtime").val();
				correctClass['isBreak'] = $('#formbreak')[0].checked;
				correctClass['isGlobal'] = $('#formglobal')[0].checked;

				if (correctClass['isGlobal'] && !adddatebox.currentlyEditing['schoolClass']['isGlobal']) {
					//USER MADE IT GLOBAL
					//pop old one using filter

				} else if (!correctClass['isGlobal'] && adddatebox.currentlyEditing['schoolClass']['isGlobal']) {
					//USER MADE IT NON-GLOBAL
				} else if (correctClass['isGlobal'] && adddatebox.currentlyEditing['schoolClass']['isGlobal']) {
					//WAS STILL GLOBAL
				} else {
					//STILL NOT GLOBAL
					var i;
					console.log(unmodSchedule);
					console.log(adddatebox.currentlyEditing['dayofschoolweek']);
					console.log(unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']]);
					for (i = 0; i < unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']].length; i++) {
						if (unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']][i]['id'] == correctClass['id']) {
							break;
						}
					}

					unmodSchedule[adddatebox.currentlyEditing['dayofschoolweek']][i] = correctClass;

					localforage.setItem('schedule', unmodSchedule).then(function(val) {
						adddatebox.scheduleCallback(val, unmodGlobalSchedule);
						adddatebox.changeCounter(0);
					})
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
