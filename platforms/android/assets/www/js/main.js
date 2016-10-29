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
 
var app = {

	id: "",
	showWeekendAndDate: true,
	loadClassesNotDatebox: false,
	isSettings: false,

	initialize: function(showWeekendAndDate, loadClassesNotDatebox, isSettings) {
		app.showWeekendAndDate = showWeekendAndDate;
		app.loadClassesNotDatebox = loadClassesNotDatebox;
		app.isSettings = isSettings;

		app.bindEvents();
	},

	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		if (navigator.userAgent.indexOf("Android") != -1) {
        	document.addEventListener('deviceready', app.onDeviceReady, false);
		} else {
			$(document).ready(app.onDeviceReady);
		}
		//$(document).one('pagebeforeshow', '.page', app.pagebeforeshow);
		//$(document).one('deviceready', app.onDeviceReady);
		$(document).one("pagecontainerbeforeshow", app.pagecontainerbeforeshow);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		app.receivedEvent('deviceready');
	},

	pagecontainerbeforeshow: function() {
		app.receivedEvent('pagecontainerbeforeshow');
	},

	mainSetUp: function() {
		addmenu[app.id]();

		if (app.loadClassesNotDatebox) {
			schoolClasses[app.id]();
			console.log(app.id);
			console.log('lol');
		}

		else {
			dateConverter[app.id]();
			if (app.isSettings) {
				setUpSettings[app.id]();
			}
			else {
				adddatebox.showWeekendAndDate = app.showWeekendAndDate;
				adddatebox[app.id]();
			}
		}
	},

	// Update DOM on a Received Event
	receivedEvent: function(id) {
		app.id = id;

		if (id != 'deviceready') {
			app.mainSetUp();
		}

		setUpStorage[app.id]();

	}
};
