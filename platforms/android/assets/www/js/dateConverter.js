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
"use strict";var dateConverter={setDay:0,setDateO:{},dateToFind:{},dateSet:!1,currentDay:0,currentDate:{},firstTime:!0,firstDay:0,getDay:function(){dateConverter.dateToFind=new Date(dateConverter.currentDate),localforage.getItem("dateday").then(function(a){dateConverter.setDay=a.day,dateConverter.setDateO=new Date(a.date),localforage.getItem("daysperweek").then(function(a){void 0==a&&(localforage.setItem("daysperweek",7),a=7),dateConverter.currentDay=dateConverter.calculateDay(a),dateConverter.firstTime&&(dateConverter.firstDay=dateConverter.currentDay,dateConverter.firstTime=!1),"undefined"!=typeof adddatebox&&adddatebox.showWeekendAndDate&&localforage.setItem("currentDay",dateConverter.currentDay),dateConverter.dateSet=!0})})},setDateDay:function(a,b){"string"==typeof a&&(a=""===a?new Date:new Date(a)),6==a.getDay()?a.setHours(a.getHours()+48):0==a.getDay()&&a.setHours(a.getHours()+24);var c={date:a.toString(),day:b};return localforage.setItem("dateday",c),c},getBusinessDatesCount:function(a,b){for(var c=0,d=new Date(a);d<=b;){var e=d.getDay();6!=e&&0!=e&&c++,d.setDate(d.getDate()+1)}return c},newGBDC:function(a,b){for(var c=new Date(a),d=new Date(b),e=1;c.toDateString()!==d.toDateString();)c.setHours(c.getHours()+24),0!=c.getDay()&&6!=c.getDay()&&e++;return e},calculateDay:function(a){var b=0;return b=dateConverter.setDateO<dateConverter.dateToFind?dateConverter.newGBDC(dateConverter.setDateO,dateConverter.dateToFind)-1:-dateConverter.newGBDC(dateConverter.dateToFind,dateConverter.setDateO)+1,b+=dateConverter.setDay,b%=a,b<0&&(b+=a),console.log(dateConverter.setDay),b},resetDateSet:function(){dateConverter.dateSet=!1},deviceready:function(){dateConverter.currentDate=new Date},pagecontainerbeforeshow:function(){}};