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
var app={id:"",showWeekendAndDate:!0,loadClassesNotDatebox:!1,isSettings:!1,initialize:function(a,b,c){app.showWeekendAndDate=a,app.loadClassesNotDatebox=b,app.isSettings=c,app.bindEvents()},bindEvents:function(){navigator.userAgent.indexOf("Android")!=-1?document.addEventListener("deviceready",app.onDeviceReady,!1):$(document).ready(app.onDeviceReady),$(document).one("pagecontainerbeforeshow",app.pagecontainerbeforeshow)},onDeviceReady:function(){app.receivedEvent("deviceready")},pagecontainerbeforeshow:function(){app.receivedEvent("pagecontainerbeforeshow")},mainSetUp:function(){addmenu[app.id](),app.loadClassesNotDatebox?(schoolClasses[app.id](),console.log(app.id),console.log("lol")):(dateConverter[app.id](),app.isSettings?setUpSettings[app.id]():(adddatebox.showWeekendAndDate=app.showWeekendAndDate,adddatebox[app.id]()))},receivedEvent:function(a){app.id=a,"deviceready"!=a&&app.mainSetUp(),setUpStorage[app.id]()}};