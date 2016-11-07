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

 var setUpStorage = {

	storage: false,

	pagecontainerbeforeshow: function() {},

	deviceready: function() {
		localforage.defineDriver(window.cordovaSQLiteDriver).then(function() {
			return localforage.setDriver([
					// Try setting cordovaSQLiteDriver if available,
				window.cordovaSQLiteDriver._driver,
					// otherwise use one of the default localforage drivers as a fallback.
					// This should allow you to transparently do your tests in a browser
				localforage.INDEXEDDB,
				localforage.WEBSQL,
				localforage.LOCALSTORAGE
			]);
		}).then(function() {
	  // this should alert "cordovaSQLiteDriver" when in an emulator or a device
			//alert(localforage.driver());
			storage = true;
			
			localforage.getItem("themeDark").then(function(dark) {
				if (dark == undefined) {
					dark = false;
					localforage.setItem("themeDark", false);
				}
				if (dark) {
					$("body").addClass("themeDark");
				}
			});

			cordova.plugins.notification.local.on('trigger', function(noti, str) {console.log("triggered :O"); console.log(str); setUpSettings.scheduleNextEventAndClear(noti, false)});
			localforage.getItem('pushNotifications').then(function(val) {
				if (val == undefined) {
					val = false;
					localforage.setItem('pushNotifications', val);
				}
				if (val == false) {
					return;
				}
				cordova.plugins.notification.local.getAllIds(function (ids) {
					if (ids.length) {
						return;
					}
					localforage.getItem("schedule").then(function(val) {
						var scheduleContainsNothing = true;
						for (var a = 0; a < val.length; a++) {
							if (val[a].length) {
								scheduleContainsNothing = false;
								break;
							}
						}
						if (scheduleContainsNothing) {
							return;
						}
						cordova.plugins.notification.local.cancelAll(function() {
							setUpSettings.scheduleNextEventAndClear(null, true);
						});
					});
				});
			});

			app.mainSetUp();
		});
	}
};
