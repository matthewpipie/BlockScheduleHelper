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

var testconstructor = function(id, className, starttime, endtime) {
	this.id = id;
	this.className = className;
	this.starttime = starttime;
	this.endtime = endtime;
};

var adddatebox = {
	sortedSchedule: "",
	showWeekendAndDate: true,
	hasSetDayCounter: false,
	daycounter: 0,

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
				console.log('getting currentDay as ' + value);
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
			console.log('updating day');
			for (var i = 0; i < Math.abs(amt); i++) {
				if (Math.abs(amt) === amt) {
					dateConverter.currentDate.setDate(dateConverter.currentDate.getDate() + 1);
				} else {
					dateConverter.currentDate.setDate(dateConverter.currentDate.getDate() - 1);
				}
			}
		}

		console.log(dateConverter.currentDate.getDate());

		dateConverter.getDay();
		adddatebox.waitUntilDateSet();

	},

	updateDateBox: function(blockDay) {
		$scheduletable = $("#scheduletable");
		$scheduletable.text("");
		if (blockDay != null) {
			for (var i = 0; i < adddatebox.sortedSchedule[blockDay].length; i++) {
				$scheduletable.append("<tr href='#popupid'" + adddatebox.sortedSchedule[blockDay][i]['id'] + " data-rel='popup' data-transition='fade' class='rowid' id='row" + adddatebox.sortedSchedule[blockDay][i]['id'] + "'><td>" +
					adddatebox.sortedSchedule[blockDay][i]['starttime'] +
					" - " +
					adddatebox.sortedSchedule[blockDay][i]['endtime'] +
					"</td><td>" +
					adddatebox.sortedSchedule[blockDay][i]['className'] +
					"</td></tr>");
			}
		}

	},

	decompress: function(infos) {
		var sortedinfos = [];
		for (var i = 0; i < infos.length; i++) {
			var temp = [];
			for (var j = 0; j < infos[i].length; j++) {
				var temptime = infos[i][j]['starttime'].split(":");
				temp.push({'id': infos[i][j]['id'], 'starttime': parseInt(temptime[0] * 60 + temptime[1])});
			}
			var sortedinfo = [];

			temp.sort(function(a, b) {return parseInt(a['starttime'], 10) - parseInt(b['starttime'], 10);})

			for (var k = 0; k < temp.length; k++) {
				sortedinfo.push(infos[i].filter(function(obj) {return obj.id == temp[k]['id'];})[0]);
				
			}
			sortedinfos[i] = sortedinfo;
		}

		return sortedinfos;
	},

	scheduleCallback: function(value) {
		var schedule;
		if (value == undefined) {
			$('#content').append("Create a schedule by clicking on the menu icon!");
			schedule = "";
		} else {
			schedule = value;
		}

		adddatebox.sortedSchedule = adddatebox.decompress(schedule);
	},

	changeCounter: function(direction) {
		console.log('going ' + direction + "days");
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

			console.log(adddatebox.daycounter);

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
	},

	pagecontainerbeforeshow: function() {
		$('#content').prepend(adddatebox.datebox);
	},

	deviceready: function() {
		//localforage.getItem('schedule', adddatebox.scheduleCallback)
		adddatebox.scheduleCallback([[new testconstructor('0', 'math', '13:45', '13:46'), new testconstructor('1', 'english', '14:05', '19:05')], [new testconstructor('2', 'study hallo', '8:56', '12:45')]]);
		adddatebox.updateDay(0);
		adddatebox.setUpClicks();

	},

	//EDITING

	addSchoolClass: function(dayofschoolweek) { //generate blank class with id
		
	},

	editSchoolClass: function(schoolClass, dayofschoolweek, classPos) {

	},


	//MANAGING CLICKS

	removeClickies: function(dayofschoolweek) {
		$('.rowid').unbind('click');
	},

	updateClickies: function(dayofschoolweek) {
		$('.rowid').click(function() {
			for (var i = 0; i < adddatebox.sortedSchedule[dayofschoolweek].length; i++) {
				if (adddatebox.sortedSchedule[dayofschoolweek][i]['id'] == $(this).attr('id').substr(3)) {
					alert(adddatebox.sortedSchedule[dayofschoolweek][i]);
					console.log(adddatebox.sortedSchedule[dayofschoolweek][i]);
					editSchoolClass(adddatebox.sortedSchedule[dayofschoolweek][i], dayofschoolweek, i);
				}
			}
		});
	}

}

/*
EXAMPLE SCHEDULE:

[[{class, starttime, endtime, id}, second class object in day 1] day 2]

[[{'id': '0', 'class': 'Math', 'starttime': '13:45', 'endtime': '13:46'}, {'id': '1', 'class': 'Math2', 'starttime': '13:50', 'endtime': '13:55'}]]

*/