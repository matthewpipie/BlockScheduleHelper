"use strict";var testconstructor=function(a,b,c,d,e,f){this.id=a,this.className=b,this.starttime=c,this.endtime=d,this.isBreak=e,this.isGlobal=f},adddatebox={sortedSchedule:"",showWeekendAndDate:!0,hasSetDayCounter:!1,daycounter:0,currentlyEditing:{},datebox:'<div id="datebox"><span id="leftbutton"><span id="bar1"></span><span id="bar2"></span></span><span id="date"></span><span id="rightbutton"><span id="bar3"></span><span id="bar4"></span></span></div>',days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],waitUntilDateSet:function(){return dateConverter.dateSet?(setTimeout(dateConverter.resetDateSet,11),adddatebox.hasSetDayCounter||adddatebox.showWeekendAndDate?void localforage.getItem("dateformat").then(function(a){void 0==a&&(a=0,localforage.setItem("dateformat",a)),localforage.getItem("twelveHourTime").then(function(b){void 0==b&&(b=!1,localforage.setItem("twelveHourTime",b));var c=adddatebox.days[dateConverter.currentDate.getDay()].substr(0,3)+" ",d=(parseInt(dateConverter.currentDate.getMonth())+1).toString(),e=dateConverter.currentDate.getDate();dateConverter.currentDate.getFullYear();switch(a){case 1:c+=e+"/"+d;break;case 2:1==d.length&&(d="0"+d),1==e.toString().length&&(e="0"+e),c+="--"+d+"-"+e;break;default:c+=d+"/"+e}0==dateConverter.currentDate.getDay()||6==dateConverter.currentDate.getDay()?($("#date").text(c),adddatebox.updateDateBox(null)):($("#date").text("Day "+parseInt(dateConverter.currentDay+1).toString()+" - "+c),adddatebox.updateDateBox(dateConverter.currentDay,b))})}):(adddatebox.hasSetDayCounter=!0,void localforage.getItem("currentDay").then(function(a){dateConverter.currentDay=a,adddatebox.changeCounter(a)}))):void setTimeout(adddatebox.waitUntilDateSet,10)},updateDay:function(a){if(""===a)dateConverter.currentDate.setTime((new Date).getTime());else for(var b=0;b<Math.abs(a);b++)Math.abs(a)===a?dateConverter.currentDate.setDate(dateConverter.currentDate.getDate()+1):dateConverter.currentDate.setDate(dateConverter.currentDate.getDate()-1);dateConverter.getDay(),adddatebox.waitUntilDateSet()},convertTimeToTwelveHour:function(a,b){if(!b){var c=a.substr(0,2);return c!=parseInt(c).toString()?a.substr(1):a}var d="",e=parseInt(a.substr(0,2));return 12==e?d=a+" PM":0==e?(d+="12",d+=a.substr(2),d+=" AM"):e%12!=e?(d+=e%12,d+=a.substr(2),d+=" PM"):(d+=e,d+=a.substr(2),d+=" AM"),d},updateDateBox:function(a,b){var c=$("#scheduletable");if(c.html("<tr><th>Time</th><th>Class</th></tr>"),null!=a&&null!=adddatebox.sortedSchedule[a])for(var d=0;d<adddatebox.sortedSchedule[a].length;d++)c.append("<tr class='rowid"+(adddatebox.sortedSchedule[a][d].isBreak?" break":"")+(adddatebox.sortedSchedule[a][d].isGlobal?" global":"")+"' id='row"+adddatebox.sortedSchedule[a][d].id+"'><td>"+adddatebox.convertTimeToTwelveHour(adddatebox.sortedSchedule[a][d].starttime,b)+" - "+adddatebox.convertTimeToTwelveHour(adddatebox.sortedSchedule[a][d].endtime,b)+"</td><td>"+adddatebox.sortedSchedule[a][d].className+(""==adddatebox.sortedSchedule[a][d].room||adddatebox.sortedSchedule[a][d].isBreak?"":" ("+adddatebox.sortedSchedule[a][d].room+")"))},decompress:function(a,b){for(var c=[],d=0;d<a.length;d++){for(var e=[],f=0;f<a[d].length;f++){var g=a[d][f].starttime.split(":");e.push({id:a[d][f].id,starttime:parseInt(60*g[0]+g[1])})}for(var h=0;h<b.length;h++){var g=b[h].starttime.split(":");e.push({id:b[h].id,starttime:parseInt(60*g[0]+g[1])})}var i=[];e.sort(function(a,b){return parseInt(a.starttime,10)-parseInt(b.starttime,10)});for(var j=0;j<e.length;j++){var k=a[d].filter(function(a){return a.id==e[j].id})[0],l=b.filter(function(a){return a.id==e[j].id})[0];void 0!=k&&i.push(k),void 0!=l&&i.push(l)}c[d]=i}return console.log(c),c},scheduleCallback:function(a,b,c){if(void 0==c&&(c=7,localforage.setItem("daysperweek",c)),void 0==a){$("#content").append("Create a schedule by clicking on the menu icon!"),a=[];for(var d=0;d<c;d++)a.push([]);localforage.setItem("schedule",a)}void 0==b&&(b=[],localforage.setItem("globalSchedule",b)),adddatebox.sortedSchedule=adddatebox.decompress(a,b)},changeCounter:function(a){adddatebox.removeClickies(adddatebox.daycounter),localforage.getItem("daysperweek").then(function(b){void 0==b&&(localforage.setItem("daysperweek",7),b=7),localforage.getItem("twelveHourTime").then(function(c){void 0==c&&(localforage.setItem("twelveHourTime",!1),c=!1),adddatebox.daycounter+=a,adddatebox.daycounter%=b,adddatebox.daycounter<0&&(adddatebox.daycounter+=b),$("#date").text("Day "+parseInt(adddatebox.daycounter+1).toString()),adddatebox.updateDateBox(adddatebox.daycounter,c),console.log(adddatebox.daycounter),adddatebox.updateClickies(adddatebox.daycounter)})})},gotClick:function(a){adddatebox.showWeekendAndDate?adddatebox.updateDay(a):adddatebox.changeCounter(a)},setUpClicks:function(){$("#leftbutton").click(function(){adddatebox.gotClick(-1)}),$("#rightbutton").click(function(){adddatebox.gotClick(1)}),$("#formsubmit").click(function(a){a.preventDefault(),adddatebox.handleSubmit()}),$("#formremove").click(function(a){a.preventDefault(),adddatebox.confirmRemove()}),$(".plusbuttonholder").click(function(){adddatebox.addSchoolClass(adddatebox.daycounter)}),$("#formname").click(function(){$(this).select()})},confirmRemove:function(){navigator.notification.confirm("Are you sure you want to remove this class?  This action can NOT be undone.",adddatebox.removeForm,"Delete Class")},pagecontainerbeforeshow:function(){$("#content").prepend(adddatebox.datebox)},deviceready:function(){localforage.getItem("schedule").then(function(a){localforage.getItem("globalSchedule").then(function(b){localforage.getItem("daysperweek").then(function(c){adddatebox.scheduleCallback(a,b,c)})})}),adddatebox.updateDay(0),adddatebox.setUpClicks()},addSchoolClass:function(a){for(var b=-1,c=0;c<adddatebox.sortedSchedule.length;c++)for(var d=0;d<adddatebox.sortedSchedule[c].length;d++)parseInt(adddatebox.sortedSchedule[c][d].id)>b&&(b=parseInt(adddatebox.sortedSchedule[c][d].id));var e={className:"New Class",starttime:"00:00",endtime:"00:00",id:(b+1).toString(),isBreak:!1,isGlobal:!1,room:""};adddatebox.editSchoolClass(e,a,!0)},editSchoolClass:function(a,b,c){c?($(".ui-block-a").css("display","none"),$(".ui-block-b").css("width","100%")):($(".ui-block-a").css("display","block"),$(".ui-block-b").css("width","50%")),console.log(a),$("#formname").val(a.className),4==a.starttime.length&&(a.starttime="0"+a.starttime),$("#formstarttime").val(a.starttime),4==a.endtime.length&&(a.endtime="0"+a.endtime),$("#formendtime").val(a.endtime),a.isBreak?($("#formbreak")[0].checked=!0,$("#formbreak").flipswitch("refresh")):($("#formbreak")[0].checked=!1,$("#formbreak").flipswitch("refresh")),a.isGlobal?($("#formglobal")[0].checked=!0,$("#formglobal").flipswitch("refresh")):($("#formglobal")[0].checked=!1,$("#formglobal").flipswitch("refresh")),$("#formroom").val(a.room),adddatebox.currentlyEditing={schoolClass:a,dayofschoolweek:b,isNew:c},$("#openpopup").popup("open")},removeForm:function(a){if(1==a){if($("#openpopup").popup("close"),adddatebox.currentlyEditing.isNew)return;localforage.getItem("schedule").then(function(a){localforage.getItem("globalSchedule").then(function(b){if(adddatebox.currentlyEditing.schoolClass.isGlobal){var c=0;for(c=0;c<b.length&&b[c].id!=adddatebox.currentlyEditing.schoolClass.id;c++);b.splice(c,1),localforage.setItem("globalSchedule",b).then(function(b){adddatebox.scheduleCallback(a,b),adddatebox.changeCounter(0)})}else{var c;for(c=0;c<a[adddatebox.currentlyEditing.dayofschoolweek].length&&a[adddatebox.currentlyEditing.dayofschoolweek][c].id!=adddatebox.currentlyEditing.schoolClass.id;c++);a[adddatebox.currentlyEditing.dayofschoolweek].splice(c,1),localforage.setItem("schedule",a).then(function(a){adddatebox.scheduleCallback(a,b),adddatebox.changeCounter(0)})}})}),adddatebox.currentlyEditing.dayofschoolweek}},removeClickies:function(a){$(".rowid").unbind("click"),console.log("removeing click")},updateClickies:function(a){console.log("updating clickies"),$(".rowid").click(function(){console.log("clickerino"),console.log(adddatebox.sortedSchedule[a]),console.log(a);for(var b=0;b<adddatebox.sortedSchedule[a].length;b++)"string"==typeof $(this).attr("id")&&adddatebox.sortedSchedule[a][b].id==$(this).attr("id").substr(3)&&adddatebox.editSchoolClass(adddatebox.sortedSchedule[a][b],a,!1)})},handleSubmit:function(){return $("#openpopup").popup("close"),""==$("#formstarttime").val()||""==$("#formendtime").val()?void navigator.notification.alert("Error in saving data.  Did you fill out all forms?",null,"Error","OK"):void localforage.getItem("schedule").then(function(a){localforage.getItem("globalSchedule").then(function(b){void 0==a[adddatebox.currentlyEditing.dayofschoolweek]&&(a[adddatebox.currentlyEditing.dayofschoolweek]=[]),adddatebox.currentlyEditing.isNew&&a[adddatebox.currentlyEditing.dayofschoolweek].push(adddatebox.currentlyEditing.schoolClass);var c={id:adddatebox.currentlyEditing.schoolClass.id};if(c.className=$("#formname").val(),c.starttime=$("#formstarttime").val(),c.endtime=$("#formendtime").val(),c.isBreak=$("#formbreak")[0].checked,c.isGlobal=$("#formglobal")[0].checked,c.room=$("#formroom").val(),c.isGlobal&&!adddatebox.currentlyEditing.schoolClass.isGlobal){var d=0;for(d=0;d<a[adddatebox.currentlyEditing.dayofschoolweek].length&&a[adddatebox.currentlyEditing.dayofschoolweek][d].id!=c.id;d++);a[adddatebox.currentlyEditing.dayofschoolweek].splice(d,1),b.push(c),localforage.setItem("globalSchedule",b).then(function(b){localforage.setItem("schedule",a).then(function(a){adddatebox.scheduleCallback(a,b),adddatebox.changeCounter(0)})})}else if(!c.isGlobal&&adddatebox.currentlyEditing.schoolClass.isGlobal){var d=0;for(d=0;d<b.length&&b[d].id!=c.id;d++);b.splice(d,1),a[adddatebox.currentlyEditing.dayofschoolweek].push(c),localforage.setItem("globalSchedule",b).then(function(b){localforage.setItem("schedule",a).then(function(a){adddatebox.scheduleCallback(a,b),adddatebox.changeCounter(0)})})}else if(c.isGlobal&&adddatebox.currentlyEditing.schoolClass.isGlobal){var d;for(d=0;d<b.length&&b[d].id!=c.id;d++);b[d]=c,localforage.setItem("globalSchedule",b).then(function(b){adddatebox.scheduleCallback(a,b),adddatebox.changeCounter(0)})}else{var d;for(d=0;d<a[adddatebox.currentlyEditing.dayofschoolweek].length&&a[adddatebox.currentlyEditing.dayofschoolweek][d].id!=c.id;d++);a[adddatebox.currentlyEditing.dayofschoolweek][d]=c,localforage.setItem("schedule",a).then(function(a){adddatebox.scheduleCallback(a,b),adddatebox.changeCounter(0)})}})})}};