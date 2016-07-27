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

var adddatebox = {

	datebox: '' +
'<div id="datebox">' +
	'<span id="leftbutton"><span id="bar1"></span><span id="bar2"></span></span>' +
	'<span id="date"></span>' +
	'<span id="rightbutton"><span id="bar3"></span><span id="bar4"></span></span>' +
'</div>',

	waitUntilDateSet: function() {
		if (!dateConverter.dateSet) {
			setTimeout(adddatebox.waitUntilDateSet, 100);
			return;
		}
		setTimeout(dateConverter.resetDateSet, 100);
		alert(dateConverter.currentDay);


	},

	updateDay: function(amt) {
		for (var i = 0; i < Math.abs(amt); i++) {
			if (Math.abs(amt) === amt) {
				dateConverter.currentDate.setDate(dateConverter.currentDate.getDate() + 1);
			} else {
				dateConverter.currentDate.setDate(dateConverter.currentDate.getDate() - 1);
			}
		}
		dateConverter.getDay();
		adddatebox.waitUntilDateSet();

	},

	updateDateBox: function(sortedSchedule, blockDay) {
		$scheduletable = $("#scheduletable");
		for (var i = 0; i < sortedSchedule[blockDay].length; i++) {
			$scheduletable.append("<tr><td>" +
				sortedSchedule[blockDay][i]['starttime'] +
				" - " +
				sortedSchedule[blockDay][i]['endtime'] +
				"</td><td>" +
				sortedSchedule[blockDay][i]['class'] +
				"</td></tr>");
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

	scheduleCallback: function(err, value) {
		var schedule;
		if (err != null) {
			$('#content').append("Create a schedule by clicking on the menu icon!");
			schedule = "";
		} else {
			schedule = value;
		}

		sortedSchedule = adddatebox.decompress(schedule);

		adddatebox.updateDateBox(sortedSchedule, 0);

	},

	pagecontainerbeforeshow: function() {
		$('#content').prepend(adddatebox.datebox);
	},

	deviceready: function() {
		//localforage.getItem('schedule', adddatebox.scheduleCallback)
		adddatebox.scheduleCallback(null, [[{'id': '0', 'class': 'Math', 'starttime': '13:45', 'endtime': '13:46'}, {'id': '1', 'class': 'Math2', 'starttime': '13:50', 'endtime': '13:55'}]]);
		adddatebox.updateDay(0);
		//adddatebox.setUpClicks();
	}

}

/*
EXAMPLE SCHEDULE:

[[{class, starttime, endtime, id}, second class object in day 1] day 2]

[[{'id': '0', 'class': 'Math', 'starttime': '13:45', 'endtime': '13:46'}, {'id': '1', 'class': 'Math2', 'starttime': '13:50', 'endtime': '13:55'}]]

*/