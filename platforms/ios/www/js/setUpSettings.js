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
"use strict";var timeouts=[],setUpSettings={twelveHourTime:!1,pushNotifications:!1,themeDark:!1,dateformat:0,daysperweek:7,ready:!1,day:!1,pagecontainerbeforeshow:function(){},deviceready:function(){setUpSettings.loadSettings(),setUpSettings.updateSettings(),$("#formsubmit").on("touchend",function(a){addmenu.checkOpen()||(a.preventDefault(),setUpSettings.handleSubmit())}),$("#formdays").change(setUpSettings.verifyDay),$("#formtoday").change(setUpSettings.verifyToday),$("#formreset").on("touchend",function(a){addmenu.checkOpen()||(a.preventDefault(),setUpSettings.confirmReset())}),$("#formreset2").on("touchend",function(a){addmenu.checkOpen()||(a.preventDefault(),setUpSettings.confirmReset2())}),$("#formdark").change(setUpSettings.changeTheme);var a=new Date;6!=a.getDay()&&0!=a.getDay()||$("#mondayOrToday").text("Monday")},updateSettings:function(){return setUpSettings.ready?($("#formtime")[0].checked=setUpSettings.twelveHourTime,$("#formtime").flipswitch("refresh"),$("#formnotifications")[0].checked=setUpSettings.pushNotifications,$("#formnotifications").flipswitch("refresh"),$("#formdark")[0].checked=setUpSettings.themeDark,$("#formdark").flipswitch("refresh"),$("#formselect").val(setUpSettings.dateformat).change(),$("#formdays").val(setUpSettings.daysperweek),dateConverter.currentDate=new Date,dateConverter.getDay(),void setTimeout(setUpSettings.checkDateRan,10)):void setTimeout(setUpSettings.updateSettings,10)},changeTheme:function(){var a=$("#formdark")[0].checked;a?$("body").addClass("themeDark"):$("body").removeClass("themeDark")},verifyDay:function(){$("#formdays").val()&&$("#formdays").val()==parseInt($("#formdays").val())?parseInt($("#formdays").val())<1&&$("#formdays").val(1):$("#formdays").val(7),setUpSettings.verifyToday()},verifyToday:function(){var a=parseInt($("#formdays").val()),b=parseInt($("#formtoday").val());$("#formtoday").val()&&$("#formtoday").val()==parseInt($("#formtoday").val())||(b=1),b>a&&(b%=a),b<1&&(b=a),$("#formtoday").val(b)},confirmReset:function(){navigator.notification.confirm("Are you sure you would like to delete your schedule?  This can NOT be undone.",setUpSettings.handleReset,"Reset Schedule")},confirmReset2:function(){navigator.notification.confirm("Are you sure you would like to delete your schedule and all of your classes?  This can NOT be undone.",setUpSettings.handleReset2,"Reset Everything")},handleReset:function(a){1==a&&(localforage.setItem("schedule",void 0),localforage.setItem("globalSchedule",void 0),navigator.notification.alert("Schedule deleted."))},handleReset2:function(a){1==a&&(localforage.setItem("schedule",[]),localforage.setItem("globalSchedule",void 0),localforage.setItem("schoolClasses",void 0),navigator.notification.alert("Schedule and classes deleted."))},scheduleNextEventAndClear:function(a,b,c){void 0==b&&(b=!1),void 0==c&&(c=!0),localforage.getItem("schoolClasses").then(function(a){localforage.getItem("schedule").then(function(d){localforage.getItem("globalSchedule").then(function(e){localforage.getItem("daysperweek").then(function(f){localforage.getItem("dateday").then(function(g){void 0==a&&(a=[],localforage.setItem("schoolClasses",a)),void 0==d&&(d=[],localforage.setItem("schedule",d)),void 0==e&&(e=[],localforage.setItem("globalSchedule",e)),void 0==f&&(f=7,localforage.setItem("daysperweek",f)),void 0==g&&(g={date:(new Date).toString(),day:0});for(var h=new Date,i=0;i<timeouts.length;i++)clearTimeout(timeouts[i]);var j=setUpSettings.calculateDay(g,f,new Date);void 0==d[j]&&(d[j]=[]);for(var k=[],l=0;l<d[j].length;l++){var m=d[j][l].starttime;m=60*parseInt(m.substr(0,2))+parseInt(m.substr(3));var n=d[j][l].endtime;n=60*parseInt(n.substr(0,2))+parseInt(n.substr(3)),k.push({id:d[j][l].id,starttime:m,endtime:n,isGlobal:!1})}for(var i=0;i<e.length;i++){var m=e[i].starttime;m=60*parseInt(m.substr(0,2))+parseInt(m.substr(3));var n=e[i].endtime;n=60*parseInt(n.substr(0,2))+parseInt(n.substr(3)),k.push({id:e[i].id,starttime:m,endtime:n,isGlobal:!0})}var r,i,l,o=k.sort(function(a,b){return parseInt(a.starttime,10)-parseInt(b.starttime,10)}),p=k.sort(function(a,b){return parseInt(a.endtime,10)-parseInt(b.endtime,10)}),q=60*h.getHours()+h.getMinutes(),s=!0,t=!1,u=!1,v=!1;for(i=q;i<1439;i++)if(o.filter(function(a){return a.starttime==i}).length){if(t){u=!0;break}r=i,t=!0}else;if(t||(s=!1),b){var w=o.filter(function(a){return a.starttime<q&&a.endtime>q});(r-q>10||0!=w.length)&&(i=r,u=!0),6!=h.getDay()&&0!=h.getDay()||(s=!1)}if(u||(s=!1),b&&r-q>10)l=i-10,v=!0;else for(l=i;l>=0;l--)if(p.filter(function(a){return a.endtime==l}).length){v=!0;break}v||(s=!1);var x,y,z,A=new Date;if(s)x=i,y=l,x-y>10&&(y=x-10),z=o.filter(function(a){return a.starttime==x})[0],A.setHours(0),A.setSeconds(0),A.setMilliseconds(0),A.setMinutes(y);else{console.log("no bueno");var B=new Date;B.setHours(B.getHours()+24),j=setUpSettings.calculateDay(g,f,B);var D,C=!1;for(D=1;D<29;D++){if(console.log(j),console.log(B),void 0==d[j]&&(d[j]=[]),0!=d[j].length&&B.getDay()<6&&B.getDay()>0){console.log("we out fam"),C=!0;break}console.log("stuck in eternal poo"),B.setHours(B.getHours()+24),j=setUpSettings.calculateDay(g,f,B)}if(!C)return $("#formnotifications")[0].checked=!1,$("#formnotifications").flipswitch("refresh"),navigator.notification.alert("Error: Please create a schedule first."),void setUpSettings.handleSubmit();k=[];for(var l=0;l<d[j].length;l++){var m=d[j][l].starttime;m=60*parseInt(m.substr(0,2))+parseInt(m.substr(3));var n=d[j][l].endtime;n=60*parseInt(n.substr(0,2))+parseInt(n.substr(3)),k.push({id:d[j][l].id,starttime:m,endtime:n,isGlobal:!1})}for(var i=0;i<e.length;i++){var m=e[i].starttime;m=60*parseInt(m.substr(0,2))+parseInt(m.substr(3));var n=e[i].endtime;n=60*parseInt(n.substr(0,2))+parseInt(n.substr(3)),k.push({id:e[i].id,starttime:m,endtime:n,isGlobal:!0})}if(o=k.sort(function(a,b){return parseInt(a.starttime,10)-parseInt(b.starttime,10)}),console.log(o),0==o.length)return;x=o[0].starttime,console.log(x),y=x-10,z=o[0],A=B,A.setHours(0),A.setSeconds(0),A.setMilliseconds(0),A.setMinutes(y),q=-(1440*D)}z=z.isGlobal?e.filter(function(a){return a.id==z.id})[0]:d[j].filter(function(a){return a.id==z.id})[0];var E=setUpSettings.findClass(a,z.className,"bgcolor");console.log(A);var F="Next class: "+setUpSettings.findClass(a,z.className,"className")+(""==setUpSettings.findClass(a,z.className,"room")?"":" ("+setUpSettings.findClass(a,z.className,"room")+")"),G="Starts in "+(x-y).toString()+" minutes";h.toDateString()!=A.toDateString()&&(G=F+" in 10",F="Today is day "+(parseInt(j)+1).toString());var H={id:0,title:F,text:G,at:A,led:null==E?"FFFFFF":E.substr(1)};console.log(H),console.log(x),console.log(x-q),cordova.plugins.notification.local.schedule(H),b&&c&&navigator.notification.alert("Notifications have been turned on.")})})})})})},findClass:function(a,b,c){for(var d=0;d<a.length;d++)if(a[d].id==b)return a[d][c]},calculateDay:function(a,b,c){var d=0,e=new Date(a.date),f=a.day;return d=e<c?dateConverter.newGBDC(e,c)-1:-dateConverter.newGBDC(c,e)+1,d+=f,d%=b,d<0&&(d+=b),d},handleSubmit:function(){console.log("saving"),setUpSettings.verifyDay();var a=$("#formtime")[0].checked,b=$("#formnotifications")[0].checked,c=$("#formselect").val(),d=$("#formdays").val(),e=$("#formtoday").val(),f=$("#formdark")[0].checked;localforage.setItem("twelveHourTime",a),localforage.setItem("pushNotifications",b),localforage.setItem("dateformat",parseInt(c)),localforage.setItem("daysperweek",parseInt(d)),localforage.setItem("currentDay",parseInt(e)),localforage.setItem("themeDark",f),dateConverter.setDateDay("",parseInt(e)-1),b&&!setUpSettings.pushNotifications?cordova.plugins.notification.local.cancelAll(function(){setUpSettings.scheduleNextEventAndClear(null,!0)}):!b&&setUpSettings.pushNotifications&&cordova.plugins.notification.local.cancelAll(function(){navigator.notification.alert("Notifications have been turned off.")}),setUpSettings.twelveHourTime=a,setUpSettings.pushNotifications=b,setUpSettings.dateformat=c,setUpSettings.daysperweek=d,setUpSettings.themeDark=f,navigator.notification.alert("Settings saved.")},loadSettings:function(){localforage.getItem("twelveHourTime").then(function(a){void 0==a&&(a=!1,localforage.setItem("twelveHourTime",a)),localforage.getItem("pushNotifications").then(function(b){void 0==b&&(b=!1,localforage.setItem("pushNotifications",b)),localforage.getItem("dateformat").then(function(c){void 0==c&&(c=0,localforage.setItem("dateformat",c)),localforage.getItem("daysperweek").then(function(d){void 0==d&&(d=7,localforage.setItem("daysperweek",d)),localforage.getItem("themeDark").then(function(e){void 0==e&&(e=!1,localforage.setItem("themeDark",e)),setUpSettings.twelveHourTime=a,setUpSettings.pushNotifications=b,setUpSettings.dateformat=c,setUpSettings.daysperweek=d,setUpSettings.ready=!0,setUpSettings.themeDark=e})})})})})},checkDateRan:function(){if(dateConverter.firstTime)return void setTimeout(setUpSettings.checkDateRan,10);var a=1;6!=(new Date).getDay()&&0!=(new Date).getDay()||(a=2),$("#formtoday").val(dateConverter.firstDay+a),setUpSettings.verifyToday(),setUpSettings.day=dateConverter.firstDay}};