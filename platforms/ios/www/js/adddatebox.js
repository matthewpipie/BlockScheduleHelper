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
"use strict";var adddatebox={sortedSchedule:"",showWeekendAndDate:!0,hasSetDayCounter:!1,daycounter:0,currentlyEditing:{},schoolClasses:{},datebox:'<div id="datebox"><span id="leftbutton"><span id="bar1"></span><span id="bar2"></span></span><span id="date"></span><span id="rightbutton"><span id="bar3"></span><span id="bar4"></span></span></div>',days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],startEndDifferenceMS:60,waitUntilDateSet:function(){return dateConverter.dateSet?(setTimeout(dateConverter.resetDateSet,11),adddatebox.hasSetDayCounter||adddatebox.showWeekendAndDate?void localforage.getItem("dateformat").then(function(a){void 0==a&&(a=0,localforage.setItem("dateformat",a)),localforage.getItem("twelveHourTime").then(function(b){void 0==b&&(b=!1,localforage.setItem("twelveHourTime",b));var c=adddatebox.days[dateConverter.currentDate.getDay()].substr(0,3)+" ",d=(parseInt(dateConverter.currentDate.getMonth())+1).toString(),e=dateConverter.currentDate.getDate();switch(a){case 1:c+=e+"/"+d;break;case 2:1==d.length&&(d="0"+d),1==e.toString().length&&(e="0"+e),c+="--"+d+"-"+e;break;default:c+=d+"/"+e}var f=new Date;f.toDateString()===dateConverter.currentDate.toDateString()?$("#date").addClass("currentDay"):$("#date").removeClass("currentDay"),0==dateConverter.currentDate.getDay()||6==dateConverter.currentDate.getDay()?($("#date").text(c),adddatebox.updateDateBox(null)):($("#date").text("Day "+parseInt(dateConverter.currentDay+1).toString()+" - "+c),adddatebox.updateDateBox(dateConverter.currentDay,b))})}):(adddatebox.hasSetDayCounter=!0,void localforage.getItem("currentDay").then(function(a){dateConverter.currentDay=a,adddatebox.changeCounter(a)}))):void setTimeout(adddatebox.waitUntilDateSet,10)},updateDay:function(a){if(""===a)dateConverter.currentDate.setTime((new Date).getTime());else for(var b=0;b<Math.abs(a);b++)Math.abs(a)===a?dateConverter.currentDate.setDate(dateConverter.currentDate.getDate()+1):dateConverter.currentDate.setDate(dateConverter.currentDate.getDate()-1);dateConverter.getDay(),adddatebox.waitUntilDateSet()},convertTimeToTwelveHour:function(a,b){if(!b){var c=a.substr(0,2);return c!=parseInt(c).toString()?a.substr(1):a}var d="",e=parseInt(a.substr(0,2));return 12==e?d=a+" PM":0==e?(d+="12",d+=a.substr(2),d+=" AM"):e%12!=e?(d+=e%12,d+=a.substr(2),d+=" PM"):(d+=e,d+=a.substr(2),d+=" AM"),d},findClass:function(a,b){for(var c=0;c<adddatebox.schoolClasses.length;c++)if(adddatebox.schoolClasses[c].id==a)return adddatebox.schoolClasses[c][b]},updateDateBox:function(a,b){var c=$("#scheduletable");if(c.html("<tr><th>Time</th><th>Class</th></tr>"),null!=a&&null!=adddatebox.sortedSchedule[a])for(var d=0;d<adddatebox.sortedSchedule[a].length;d++)c.append("<tr class='rowid"+(adddatebox.sortedSchedule[a][d].isGlobal?" global":"")+"' id='row"+adddatebox.sortedSchedule[a][d].id+"' style='color: "+(adddatebox.findClass(adddatebox.sortedSchedule[a][d].className,"whiteText")?"white":"black")+";'><td>"+adddatebox.convertTimeToTwelveHour(adddatebox.sortedSchedule[a][d].starttime,b)+" - "+adddatebox.convertTimeToTwelveHour(adddatebox.sortedSchedule[a][d].endtime,b)+"</td><td>"+adddatebox.findClass(adddatebox.sortedSchedule[a][d].className,"className")+(""==adddatebox.findClass(adddatebox.sortedSchedule[a][d].className,"room")?"":" ("+adddatebox.findClass(adddatebox.sortedSchedule[a][d].className,"room")+")")),$("#row"+adddatebox.sortedSchedule[a][d].id+" td").css("background",adddatebox.findClass(adddatebox.sortedSchedule[a][d].className,"bgcolor"))},decompress:function(a,b){for(var c=[],d=0;d<a.length;d++){void 0==a[d]&&(a[d]=[]);for(var e=[],f=0;f<a[d].length;f++){var g=a[d][f].starttime.split(":");e.push({id:a[d][f].id,starttime:parseInt(60*g[0]+g[1])})}for(var h=0;h<b.length;h++){var g=b[h].starttime.split(":");e.push({id:b[h].id,starttime:parseInt(60*g[0]+g[1])})}var i=[];e.sort(function(a,b){return parseInt(a.starttime,10)-parseInt(b.starttime,10)});for(var j=0;j<e.length;j++){var k=a[d].filter(function(a){return a.id==e[j].id})[0],l=b.filter(function(a){return a.id==e[j].id})[0];void 0!=k&&i.push(k),void 0!=l&&i.push(l)}c[d]=i}return console.log(c),c},scheduleCallback:function(a,b,c){if(void 0==c&&(c=7,localforage.setItem("daysperweek",c)),0==adddatebox.schoolClasses.length&&($(".plusbuttonholder").css("display","none"),$("#content").append("<p>Add some classes by clicking on the menu and navigating to the Class Editor.  Then, after adding classes, go to the Schedule Editor to add them into a place on your schedule at a specific day.  Go to settings to change the current school day to something else.</p>")),void 0==a){a=[];for(var d=0;d<c;d++)a[d]=[];localforage.setItem("schedule",a),dateConverter.setDateDay("",0)}if(0==a.length){a=[];for(var d=0;d<c;d++)a[d]=[];localforage.setItem("schedule",a)}void 0==b&&(b=[],localforage.setItem("globalSchedule",b)),c&&(a.length=c,localforage.setItem("schedule",a)),adddatebox.sortedSchedule=adddatebox.decompress(a,b)},changeCounter:function(a){adddatebox.removeClickies(adddatebox.daycounter),localforage.getItem("daysperweek").then(function(b){void 0==b&&(localforage.setItem("daysperweek",7),b=7),localforage.getItem("twelveHourTime").then(function(c){void 0==c&&(localforage.setItem("twelveHourTime",!1),c=!1),adddatebox.daycounter+=a,adddatebox.daycounter%=b,adddatebox.daycounter<0&&(adddatebox.daycounter+=b),$("#date").text("Day "+parseInt(adddatebox.daycounter+1).toString()),adddatebox.updateDateBox(adddatebox.daycounter,c),console.log(adddatebox.daycounter),adddatebox.updateClickies(adddatebox.daycounter)})})},gotClick:function(a){adddatebox.showWeekendAndDate?adddatebox.updateDay(a):adddatebox.changeCounter(a)},calculateTimeDifference:function(){var a=$("#formstarttime").val(),b=$("#formendtime").val(),c=new Date;c.setHours(a.substr(0,2)),c.setMinutes(a.substr(3)),c.setSeconds(0),c.setMilliseconds(0);var d=new Date;d.setHours(b.substr(0,2)),d.setMinutes(b.substr(3)),d.setSeconds(0),d.setMilliseconds(0),adddatebox.startEndDifferenceMS=d-c},startTimeChange:function(){var a=$("#formstarttime").val();if(""!==a){var b=new Date;b.setHours(a.substr(0,2)),b.setMinutes(a.substr(3)),b.setSeconds(0),b.setMilliseconds(adddatebox.startEndDifferenceMS);var c=b.getHours(),d=b.getMinutes(),e="",f="";c<10&&(e="0"),d<10&&(f="0"),$("#formendtime").val(e+c+":"+f+d)}},setUpClicks:function(){$("#leftbutton").on("touchend",function(){addmenu.checkOpen()||adddatebox.gotClick(-1)}),$("#rightbutton").on("touchend",function(){addmenu.checkOpen()||adddatebox.gotClick(1)}),$("#formsubmit").on("touchend",function(a){addmenu.checkOpen()||(a.preventDefault(),adddatebox.handleSubmit())}),$("#formremove").on("touchend",function(a){addmenu.checkOpen()||(a.preventDefault(),adddatebox.confirmRemove())}),$(".plusbuttonholder").on("touchend",function(a){addmenu.checkOpen()||(a.preventDefault(),adddatebox.addSchoolClass(adddatebox.daycounter))}),$("#formname").on("touchend",function(){addmenu.checkOpen()||$(this).select()}),$("#formstarttime").change(adddatebox.startTimeChange),$("#formendtime").change(adddatebox.calculateTimeDifference)},confirmRemove:function(){navigator.notification.confirm("Are you sure you want to remove this entry?  This action can NOT be undone.",adddatebox.removeForm,"Delete Entry")},pagecontainerbeforeshow:function(){$("#content").prepend(adddatebox.datebox)},deviceready:function(){localforage.getItem("schedule").then(function(a){localforage.getItem("globalSchedule").then(function(b){localforage.getItem("daysperweek").then(function(c){localforage.getItem("schoolClasses").then(function(d){adddatebox.loadClasses(d),adddatebox.scheduleCallback(a,b,c),adddatebox.updateDay(0)})})})}),adddatebox.setUpClicks()},loadClasses:function(a){void 0==a&&(a=[]),adddatebox.schoolClasses=a;for(var b=0;b<adddatebox.schoolClasses.length;b++)$("#formname").append("<option value='"+adddatebox.schoolClasses[b].id+"'>"+adddatebox.schoolClasses[b].className+(""==adddatebox.schoolClasses[b].room?"":" ("+adddatebox.schoolClasses[b].room+")")+"</option>")},addSchoolClass:function(a){for(var b=-1,c=0;c<adddatebox.sortedSchedule.length;c++)if(void 0!=adddatebox.sortedSchedule[c])for(var d=0;d<adddatebox.sortedSchedule[c].length;d++)parseInt(adddatebox.sortedSchedule[c][d].id)>b&&(b=parseInt(adddatebox.sortedSchedule[c][d].id));var e=$(".rowid"),f="";if(e.length)for(var g=e[e.length-1].id.substr(3),c=0;c<adddatebox.sortedSchedule.length;c++)if(void 0!=adddatebox.sortedSchedule[c])for(var d=0;d<adddatebox.sortedSchedule[c].length;d++)if(adddatebox.sortedSchedule[c][d].id===g){f=adddatebox.sortedSchedule[c][d].endtime;break}""===f&&(f="07:30"),localforage.getItem("schoolClasses").then(function(c){var d={className:c[0].id,starttime:f,endtime:"00:00",id:(b+1).toString(),isGlobal:!1};adddatebox.startEndDifferenceMS=36e5,adddatebox.editSchoolClass(d,a,!0)})},editSchoolClass:function(a,b,c){c?($(".ui-block-a").css("display","none"),$(".ui-block-b").css("width","100%")):($(".ui-block-a").css("display","block"),$(".ui-block-b").css("width","50%")),console.log(a),$("#formname").val(a.className).change(),4==a.starttime.length&&(a.starttime="0"+a.starttime),$("#formstarttime").val(a.starttime),4==a.endtime.length&&(a.endtime="0"+a.endtime),$("#formendtime").val(a.endtime),a.isGlobal?($("#formglobal")[0].checked=!0,$("#formglobal").flipswitch("refresh")):($("#formglobal")[0].checked=!1,$("#formglobal").flipswitch("refresh")),adddatebox.currentlyEditing={schoolClass:a,dayofschoolweek:b,isNew:c},c&&adddatebox.startTimeChange(),adddatebox.calculateTimeDifference(),$("#openpopup").popup("open"),setTimeout(function(){document.activeElement.blur()},10)},removeForm:function(a){if(1==a){if($("#openpopup").popup("close"),adddatebox.currentlyEditing.isNew)return;localforage.getItem("schedule").then(function(a){localforage.getItem("globalSchedule").then(function(b){if(adddatebox.currentlyEditing.schoolClass.isGlobal){var c=0;for(c=0;c<b.length&&b[c].id!=adddatebox.currentlyEditing.schoolClass.id;c++);b.splice(c,1),localforage.setItem("globalSchedule",b).then(function(b){adddatebox.scheduleCallback(a,b,!1),adddatebox.changeCounter(0),localforage.getItem("pushNotifications").then(function(a){a&&cordova.plugins.notification.local.cancelAll(function(){setUpSettings.scheduleNextEventAndClear(null,!0,!1)})})})}else{var c;for(c=0;c<a[adddatebox.currentlyEditing.dayofschoolweek].length&&a[adddatebox.currentlyEditing.dayofschoolweek][c].id!=adddatebox.currentlyEditing.schoolClass.id;c++);a[adddatebox.currentlyEditing.dayofschoolweek].splice(c,1),localforage.setItem("schedule",a).then(function(a){adddatebox.scheduleCallback(a,b,!1),adddatebox.changeCounter(0),localforage.getItem("pushNotifications").then(function(a){a&&cordova.plugins.notification.local.cancelAll(function(){setUpSettings.scheduleNextEventAndClear(null,!0,!1)})})})}})})}},removeClickies:function(a){$(".rowid").unbind("click"),console.log("removeing click")},updateClickies:function(a){console.log("updating clickies"),$(".rowid").on("touchend",function(b){if(!addmenu.checkOpen()){b.preventDefault(),console.log("clickerino"),console.log(adddatebox.sortedSchedule[a]),console.log(a);for(var c=0;c<adddatebox.sortedSchedule[a].length;c++)"string"==typeof $(this).attr("id")&&adddatebox.sortedSchedule[a][c].id==$(this).attr("id").substr(3)&&adddatebox.editSchoolClass(adddatebox.sortedSchedule[a][c],a,!1)}})},handleSubmit:function(){return $("#openpopup").popup("close"),""==$("#formstarttime").val()||""==$("#formendtime").val()||void 0==$("#formname").val()?void navigator.notification.alert("Error in saving data.  Did you fill out all forms?",null,"Error","OK"):void localforage.getItem("schedule").then(function(a){localforage.getItem("globalSchedule").then(function(b){void 0==a[adddatebox.currentlyEditing.dayofschoolweek]&&(a[adddatebox.currentlyEditing.dayofschoolweek]=[]),adddatebox.currentlyEditing.isNew&&a[adddatebox.currentlyEditing.dayofschoolweek].push(adddatebox.currentlyEditing.schoolClass);var c={id:adddatebox.currentlyEditing.schoolClass.id};if(c.className=$("#formname").val(),c.starttime=$("#formstarttime").val(),c.endtime=$("#formendtime").val(),c.isGlobal=$("#formglobal")[0].checked,c.isGlobal&&!adddatebox.currentlyEditing.schoolClass.isGlobal){var d=0;for(d=0;d<a[adddatebox.currentlyEditing.dayofschoolweek].length&&a[adddatebox.currentlyEditing.dayofschoolweek][d].id!=c.id;d++);a[adddatebox.currentlyEditing.dayofschoolweek].splice(d,1),b.push(c),localforage.setItem("globalSchedule",b).then(function(b){localforage.setItem("schedule",a).then(function(a){adddatebox.scheduleCallback(a,b,!1),adddatebox.changeCounter(0),localforage.getItem("pushNotifications").then(function(a){a&&cordova.plugins.notification.local.cancelAll(function(){setUpSettings.scheduleNextEventAndClear(null,!0,!1)})})})})}else if(!c.isGlobal&&adddatebox.currentlyEditing.schoolClass.isGlobal){var d=0;for(d=0;d<b.length&&b[d].id!=c.id;d++);b.splice(d,1),a[adddatebox.currentlyEditing.dayofschoolweek].push(c),localforage.setItem("globalSchedule",b).then(function(b){localforage.setItem("schedule",a).then(function(a){adddatebox.scheduleCallback(a,b,!1),adddatebox.changeCounter(0),localforage.getItem("pushNotifications").then(function(a){a&&cordova.plugins.notification.local.cancelAll(function(){setUpSettings.scheduleNextEventAndClear(null,!0,!1)})})})})}else if(c.isGlobal&&adddatebox.currentlyEditing.schoolClass.isGlobal){var d;for(d=0;d<b.length&&b[d].id!=c.id;d++);b[d]=c,localforage.setItem("globalSchedule",b).then(function(b){adddatebox.scheduleCallback(a,b,!1),adddatebox.changeCounter(0),localforage.getItem("pushNotifications").then(function(a){a&&cordova.plugins.notification.local.cancelAll(function(){setUpSettings.scheduleNextEventAndClear(null,!0,!1)})})})}else{var d;for(d=0;d<a[adddatebox.currentlyEditing.dayofschoolweek].length&&a[adddatebox.currentlyEditing.dayofschoolweek][d].id!=c.id;d++);a[adddatebox.currentlyEditing.dayofschoolweek][d]=c,localforage.setItem("schedule",a).then(function(a){adddatebox.scheduleCallback(a,b,!1),adddatebox.changeCounter(0),localforage.getItem("pushNotifications").then(function(a){a&&cordova.plugins.notification.local.cancelAll(function(){setUpSettings.scheduleNextEventAndClear(null,!0,!1)})})})}})})}};