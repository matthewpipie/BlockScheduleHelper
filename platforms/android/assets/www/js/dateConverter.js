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

 var dateConverter = {
	setDay: 0,
	setDateO: {},
	dateToFind: {},
	dateSet: false,
	currentDay: 0,
	currentDate: {},
	firstTime: true,
	firstDay: 0,

	getDay: function() {
		dateConverter.dateToFind = new Date(dateConverter.currentDate);

		localforage.getItem('dateday').then(function(value) {
			if (value == undefined) {
				value = dateConverter.setDateDay("", 0);
			}
			dateConverter.setDay = value['day'];
			dateConverter.setDateO = new Date(value['date']);
			localforage.getItem('daysperweek').then(function(value) {
				if (value == undefined) {
					localforage.setItem('daysperweek', 7);
					value = 7;
				}

				dateConverter.currentDay = dateConverter.calculateDay(value);

				if (dateConverter.firstTime) {
					dateConverter.firstDay = dateConverter.currentDay;
					dateConverter.firstTime = false;
				}
				if (typeof(adddatebox) != "undefined") {
					if (adddatebox.showWeekendAndDate) {
						localforage.setItem('currentDay', dateConverter.currentDay);
					}
				}
				
				dateConverter.dateSet = true;
			});
		});
	},

	setDateDay: function(date, day) {
		if (typeof(date) == 'string') {
			if (date === "") {
				date = new Date();
			}
			else {
				date = new Date(date);
			}
		}
		var dateDay = {'date': date.toString(), 'day': day};
		localforage.setItem('dateday', dateDay);
		return dateDay;
	},

	getBusinessDatesCount: function(startDate, endDate) {
		var count = 0;
		var curDate = new Date(startDate);

		while (curDate <= endDate) {
			var dayOfWeek = curDate.getDay();
			if(!((dayOfWeek == 6) || (dayOfWeek == 0)))
				count++;
			curDate.setDate(curDate.getDate() + 1);
		}

		return count;
	},
	
	calculateDay: function(daysperweek) {
		var daysBetween = 0;

		if (dateConverter.setDateO < dateConverter.dateToFind) { //set before datetofind, aka in the past
			daysBetween = (dateConverter.getBusinessDatesCount(dateConverter.setDateO, dateConverter.dateToFind) - 1);
		} else {
			daysBetween = -(dateConverter.getBusinessDatesCount(dateConverter.dateToFind, dateConverter.setDateO));
		}

		daysBetween += dateConverter.setDay;

		daysBetween %= daysperweek;

		if (daysBetween < 0) {
			daysBetween += daysperweek;

		}
		console.log(dateConverter.setDay);
		return daysBetween;
	},

	resetDateSet: function() {
		dateConverter.dateSet = false;
	},

	deviceready: function() {
		dateConverter.currentDate = new Date();
	},

	pagecontainerbeforeshow: function() {}

}
