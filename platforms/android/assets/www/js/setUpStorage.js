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
var setUpStorage={storage:!1,pagecontainerbeforeshow:function(){},deviceready:function(){localforage.defineDriver(window.cordovaSQLiteDriver).then(function(){return localforage.setDriver([window.cordovaSQLiteDriver._driver,localforage.INDEXEDDB,localforage.WEBSQL,localforage.LOCALSTORAGE])}).then(function(){storage=!0,cordova.plugins.notification.local.on("trigger",function(a,b){console.log("triggered :O"),console.log(b),setUpSettings.scheduleNextEventAndClear(a,!1)}),app.mainSetUp()})}};