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
var schoolClasses={schoolClasses:[],palette:[],currentlyEditing:{},updateClassList:function(){schoolClasses.removeClickies();var a=$("#classtable");a.html("<tr><th>Class</th></tr>");for(var b=0;b<schoolClasses.schoolClasses.length;b++)a.append("<tr class='rowid' id='row"+schoolClasses.schoolClasses[b].id+"'><td style='background: "+schoolClasses.schoolClasses[b].bgcolor+"; color: "+(schoolClasses.schoolClasses[b].whiteText?"white":"black")+";'>"+schoolClasses.schoolClasses[b].className+(""==schoolClasses.schoolClasses[b].room?"":" ("+schoolClasses.schoolClasses[b].room+")")+"</td></tr>");schoolClasses.setUpClickies()},setUpClicks:function(){$("#formsubmit").on("touchend",function(){addmenu.checkOpen()||schoolClasses.handleSubmit()}),$("#formremove").on("touchend",function(){addmenu.checkOpen()||navigator.notification.confirm("Are you sure you want to remove this class?  This action can NOT be undone.",schoolClasses.removeForm,"Delete Class")}),$(".plusbuttonholder").on("touchend",function(a){addmenu.checkOpen()||(a.preventDefault(),schoolClasses.addNewClass())}),$("#formname").on("touchend",function(){addmenu.checkOpen()||$(this).select()})},setUpSpectrum:function(){$("#formbgcolor").spectrum({showInitial:!0,showPalette:!0,showButtons:!1,allowEmpty:!0,containerClassName:"formcolorContainer",replacerClassName:"formcolorReplacer",preferredFormat:"hex",maxSelectionSize:0,palette:schoolClasses.palette,show:schoolClasses.lockPopup,hide:schoolClasses.unlockPopup})},spectrumChange:function(a){if(void 0==a&&(a=$("#formbgcolor").spectrum("get")),null!=a){for(var b=!1,c=a.toHexString(),d=0;d<schoolClasses.palette.length;d++){for(var e=0;e<schoolClasses.palette[d].length;e++)if(console.log(schoolClasses.palette[d][e]),console.log(c),schoolClasses.palette[d][e]==c){b=!0;break}if(b)break}b||(console.log("it wasnt in"),schoolClasses.palette[8].length<8||schoolClasses.palette[8].splice(0,1),schoolClasses.palette[8].push(c),$("#formbgcolor").spectrum("option","palette",schoolClasses.palette),localforage.setItem("palette",schoolClasses.palette))}},deviceready:function(){console.log("moo"),localforage.getItem("schoolClasses").then(function(a){schoolClasses.loadClasses(a),schoolClasses.updateClassList()}),localforage.getItem("palette").then(function(a){void 0==a&&(a=[["#000000","#444444","#666666","#999999","#cccccc","#eeeeee","#f3f3f3","#ffffff"],["#ff0000","#ff9900","#ffff00","#00ff00","#00ffff","#0000ff","#9900ff","#ff00ff"],["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],["#cc0000","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],["#990000","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],["#660000","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"],[]],localforage.setItem("palette",a)),schoolClasses.palette=a,schoolClasses.setUpSpectrum()}),schoolClasses.setUpClicks()},lockPopup:function(){$("#openpopup").popup({dismissible:!1}),$("#formsubmit").button("option","disabled",!0),$("#formremove").button("option","disabled",!0),window.scrollTo(0,document.body.scrollHeight)},unlockPopup:function(){$("#openpopup").popup({dismissible:!0}),$("#formsubmit").button("option","disabled",!1),$("#formremove").button("option","disabled",!1),schoolClasses.spectrumChange()},loadClasses:function(a){void 0==a&&(localforage.setItem("schoolClasses",[]),a=[]),schoolClasses.schoolClasses=a},pagecontainerbeforeshow:function(){},removeClickies:function(){$(".rowid").unbind("click")},setUpClickies:function(){$(".rowid").on("touchend",function(a){if(!addmenu.checkOpen()){a.preventDefault();for(var b=0;b<schoolClasses.schoolClasses.length;b++)"string"==typeof $(this).attr("id")&&schoolClasses.schoolClasses[b].id==$(this).attr("id").substr(3)&&schoolClasses.editSchoolClass(schoolClasses.schoolClasses[b],!1)}})},addNewClass:function(){console.log("adding new");for(var a=-1,b=0;b<schoolClasses.schoolClasses.length;b++)parseInt(schoolClasses.schoolClasses[b].id)>a&&(a=parseInt(schoolClasses.schoolClasses[b].id));var c={className:"New Class",id:(a+1).toString(),room:"",bgcolor:null,whiteText:!1};schoolClasses.editSchoolClass(c,!0)},editSchoolClass:function(a,b){b?($(".ui-block-a").css("display","none"),$(".ui-block-b").css("width","100%")):($(".ui-block-a").css("display","block"),$(".ui-block-b").css("width","50%")),console.log(a),$("#formname").val(a.className),$("#formroom").val(a.room),$("#formbgcolor").spectrum("set",a.bgcolor),a.whiteText?($("#formtextcolor")[0].checked=!0,$("#formtextcolor").flipswitch("refresh")):($("#formtextcolor")[0].checked=!1,$("#formtextcolor").flipswitch("refresh")),schoolClasses.currentlyEditing={schoolClass:a,isNew:b},$("#openpopup").popup("open"),setTimeout(function(){document.activeElement.blur()},10)},removeForm:function(a){if(1==a){if($("#openpopup").popup("close"),schoolClasses.currentlyEditing.isNew)return;var b;for(b=0;b<schoolClasses.schoolClasses.length&&schoolClasses.schoolClasses[b].id!=schoolClasses.currentlyEditing.schoolClass.id;b++);schoolClasses.schoolClasses.splice(b,1),localforage.setItem("schoolClasses",schoolClasses.schoolClasses).then(function(a){schoolClasses.loadClasses(a),schoolClasses.updateClassList()}),localforage.getItem("schedule").then(function(a){for(var b=0;b<a.length;b++)if(void 0!=a[b])for(var c=a[b].length-1;c<=0;c++)a[b][c].className==schoolClasses.currentlyEditing.schoolClass.id&&a[b].splice(c,1);else a[b]=[];localforage.setItem("schedule",a).then(function(){localforage.getItem("globalSchedule").then(function(a){for(var b=a.length;b<=0;b++)a[b].className==schoolClasses.currentlyEditing.schoolClass.id&&a.splice(b,1);localforage.setItem("globalSchedule",a).then(function(){localforage.getItem("pushNotifications").then(function(a){a&&cordova.plugins.notification.local.cancelAll(function(){setUpSettings.scheduleNextEventAndClear(null,!0,!1)})})})})})})}},handleSubmit:function(){if($("#openpopup").popup("close"),""==$("#formname").val())return void navigator.notification.alert("Error in saving data.  Did you fill out all forms?",null,"Error","OK");var a={id:schoolClasses.currentlyEditing.schoolClass.id};a.className=$("#formname").val(),a.room=$("#formroom").val(),a.bgcolor=$("#formbgcolor").spectrum("get"),void 0!=a.bgcolor&&(a.bgcolor=a.bgcolor.toHexString()),a.whiteText=$("#formtextcolor")[0].checked;var b;for(b=0;b<schoolClasses.schoolClasses.length&&schoolClasses.schoolClasses[b].id!=a.id;b++);schoolClasses.schoolClasses[b]=a,localforage.setItem("schoolClasses",schoolClasses.schoolClasses).then(function(a){schoolClasses.loadClasses(a),schoolClasses.updateClassList()})}};