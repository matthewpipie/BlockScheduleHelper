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
