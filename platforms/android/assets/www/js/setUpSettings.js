var timeouts=[],setUpSettings={twelveHourTime:!1,pushNotifications:!1,dateformat:0,daysperweek:7,ready:!1,day:!1,pagecontainerbeforeshow:function(){},deviceready:function(){setUpSettings.loadSettings(),setUpSettings.updateSettings(),$("#formsubmit").on("touchend",function(a){a.preventDefault(),setUpSettings.handleSubmit()}),$("#formdays").change(setUpSettings.verifyDay),$("#formtoday").change(setUpSettings.verifyToday),$("#formreset").on("touchend",function(a){a.preventDefault(),setUpSettings.confirmReset()}),$("#formreset2").on("touchend",function(a){a.preventDefault(),setUpSettings.confirmReset2()})},updateSettings:function(){return setUpSettings.ready?($("#formtime")[0].checked=setUpSettings.twelveHourTime,$("#formtime").flipswitch("refresh"),$("#formnotifications")[0].checked=setUpSettings.pushNotifications,$("#formnotifications").flipswitch("refresh"),$("#formselect").val(setUpSettings.dateformat).change(),$("#formdays").val(setUpSettings.daysperweek),dateConverter.currentDate=new Date,dateConverter.getDay(),void setTimeout(setUpSettings.checkDateRan,10)):void setTimeout(setUpSettings.updateSettings,10)},verifyDay:function(){$("#formdays").val()&&$("#formdays").val()==parseInt($("#formdays").val())?parseInt($("#formdays").val())<1&&$("#formdays").val(1):$("#formdays").val(7),setUpSettings.verifyToday()},verifyToday:function(){var a=parseInt($("#formdays").val()),b=parseInt($("#formtoday").val());$("#formtoday").val()&&$("#formtoday").val()==parseInt($("#formtoday").val())||(b=1),b>a&&(b%=a),b<1&&(b=a),$("#formtoday").val(b)},confirmReset:function(){navigator.notification.confirm("Are you sure you would like to delete your schedule?  This can NOT be undone.",setUpSettings.handleReset,"Reset Schedule")},confirmReset2:function(){navigator.notification.confirm("Are you sure you would like to delete your schedule and all of your classes?  This can NOT be undone.",setUpSettings.handleReset2,"Reset Everything")},handleReset:function(a){1==a&&(localforage.setItem("schedule",void 0),localforage.setItem("globalSchedule",void 0),navigator.notification.alert("Schedule deleted."))},handleReset2:function(a){1==a&&(localforage.setItem("schedule",void 0),localforage.setItem("globalSchedule",void 0),localforage.setItem("schoolClasses",void 0),navigator.notification.alert("Schedule and classes deleted."))},scheduleNextEventAndClear:function(a,b){void 0==b&&(b=!1),localforage.getItem("schoolClasses").then(function(a){localforage.getItem("schedule").then(function(c){localforage.getItem("globalSchedule").then(function(d){localforage.getItem("daysperweek").then(function(e){localforage.getItem("dateday").then(function(f){void 0==a&&(a=[],localforage.setItem("schoolClasses",a)),void 0==c&&(c=[],localforage.setItem("schedule",c)),void 0==d&&(d=[],localforage.setItem("globalSchedule",d)),void 0==e&&(e=7,localforage.setItem("daysperweek",e)),void 0==f&&(f={date:(new Date).toString(),day:0},localforage.setItem("dateday",f));for(var g=new Date,h=0;h<timeouts.length;h++)clearTimeout(timeouts[h]);day=setUpSettings.calculateDay(f,e,new Date),void 0==c[day]&&(c[day]=[]);for(var i=[],j=0;j<c[day].length;j++){var k=c[day][j].starttime;k=60*parseInt(k.substr(0,2))+parseInt(k.substr(3));var l=c[day][j].endtime;l=60*parseInt(l.substr(0,2))+parseInt(l.substr(3)),i.push({id:c[day][j].id,starttime:k,endtime:l,isGlobal:!1})}for(var h=0;h<d.length;h++){var k=d[h].starttime;k=60*parseInt(k.substr(0,2))+parseInt(k.substr(3));var l=d[h].endtime;l=60*parseInt(l.substr(0,2))+parseInt(l.substr(3)),i.push({id:d[h].id,starttime:k,endtime:l,isGlobal:!0})}var p,h,j,m=i.sort(function(a,b){return parseInt(a.starttime,10)-parseInt(b.starttime,10)}),n=i.sort(function(a,b){return parseInt(a.endtime,10)-parseInt(b.endtime,10)}),o=60*g.getHours()+g.getMinutes(),q=!0,r=!1,s=!1,t=!1;for(h=o;h<1439;h++)if(m.filter(function(a){return a.starttime==h}).length){if(r){s=!0;break}p=h,r=!0}else;if(r||(q=!1),b){var u=m.filter(function(a){return a.starttime<o&&a.endtime>o});(p-o>10||0!=u.length)&&(h=p,s=!0),6!=g.getDay()&&0!=g.getDay()||(q=!1)}for(s||(q=!1),j=h;j>=0;j--)if(n.filter(function(a){return a.endtime==j}).length){t=!0,firstEndTime=j;break}t||(q=!1);var v,w,x,y=new Date;if(q)v=h,w=j,v-w>10&&(w=v-10),x=m.filter(function(a){return a.starttime==v})[0],y.setHours(0),y.setSeconds(0),y.setMilliseconds(0),y.setMinutes(w);else{console.log("no bueno");var z=new Date;z.setHours(z.getHours()+24),day=setUpSettings.calculateDay(f,e,z);for(var A=!1,B=0;B<28;B++){if(console.log(day),console.log(z),void 0==c[day]&&(c[day]=[]),0!=c[day].length&&z.getDay()<6&&z.getDay()>0){console.log("we out fam"),A=!0;break}console.log("stuck in eternal poo"),z.setHours(z.getHours()+24),day=setUpSettings.calculateDay(f,e,z)}if(!A)return $("#formnotifications")[0].checked=!1,$("#formnotifications").flipswitch("refresh"),navigator.notification.alert("Error: Please create a schedule first."),void setUpSettings.handleSubmit();i=[];for(var j=0;j<c[day].length;j++){var k=c[day][j].starttime;k=60*parseInt(k.substr(0,2))+parseInt(k.substr(3));var l=c[day][j].endtime;l=60*parseInt(l.substr(0,2))+parseInt(l.substr(3)),i.push({id:c[day][j].id,starttime:k,endtime:l,isGlobal:!1})}for(var h=0;h<d.length;h++){var k=d[h].starttime;k=60*parseInt(k.substr(0,2))+parseInt(k.substr(3));var l=d[h].endtime;l=60*parseInt(l.substr(0,2))+parseInt(l.substr(3)),i.push({id:d[h].id,starttime:k,endtime:l,isGlobal:!0})}if(m=i.sort(function(a,b){return parseInt(a.starttime,10)-parseInt(b.starttime,10)}),console.log(m),0==m.length)return;v=m[0].starttime,console.log(v),w=v-10,x=m[0],y=z,y.setHours(0),y.setSeconds(0),y.setMilliseconds(0),y.setMinutes(w)}x=x.isGlobal?d.filter(function(a){return a.id==x.id})[0]:c[day].filter(function(a){return a.id==x.id})[0],timeouts.push(setTimeout(function(){cordova.plugins.notification.local.clearAll()},1e3*(v-o))),console.log(y),scheduleObj={id:0,title:"Next class: "+setUpSettings.findClass(a,x.className,"className")+(""==setUpSettings.findClass(a,x.className,"room")?"":" ("+setUpSettings.findClass(a,x.className,"room")+")"),text:"Starts in "+(v-w).toString()+" minutes",at:y,led:setUpSettings.findClass(a,x.className,"bgcolor").substr(1)},console.log(scheduleObj),cordova.plugins.notification.local.schedule(scheduleObj),navigator.notification.alert("Notifications have been turned on.")})})})})})},findClass:function(a,b,c){for(var d=0;d<a.length;d++)if(a[d].id==b)return a[d][c]},calculateDay:function(a,b,c){var d=0,e=new Date(a.date),f=a.day;return e<=c?(d=dateConverter.getBusinessDatesCount(e,c)-1,d==-1&&(d=0)):d=-dateConverter.getBusinessDatesCount(c,e),d+=f,d%=b,d<0&&(d+=b),d},handleSubmit:function(){console.log("saving");var a=$("#formtime")[0].checked,b=$("#formnotifications")[0].checked,c=$("#formselect").val(),d=$("#formdays").val(),e=$("#formtoday").val();localforage.setItem("twelveHourTime",a),localforage.setItem("pushNotifications",b),localforage.setItem("dateformat",parseInt(c)),localforage.setItem("daysperweek",parseInt(d)),localforage.setItem("currentDay",parseInt(e)),dateConverter.setDateDay("",parseInt(e)-1),b&&!setUpSettings.pushNotifications?cordova.plugins.notification.local.cancelAll(function(){setUpSettings.scheduleNextEventAndClear(null,!0)}):!b&&setUpSettings.pushNotifications&&cordova.plugins.notification.local.cancelAll(function(){navigator.notification.alert("Notifications have been turned off.")}),setUpSettings.twelveHourTime=a,setUpSettings.pushNotifications=b,setUpSettings.dateformat=c,setUpSettings.daysperweek=d,navigator.notification.alert("Settings saved.")},loadSettings:function(){localforage.getItem("twelveHourTime").then(function(a){void 0==a&&(a=!1,localforage.setItem("twelveHourTime",a)),localforage.getItem("pushNotifications").then(function(b){void 0==b&&(b=!1,localforage.setItem("pushNotifications",b)),localforage.getItem("dateformat").then(function(c){void 0==c&&(c=0,localforage.setItem("dateformat",c)),localforage.getItem("daysperweek").then(function(d){void 0==d&&(d=7,localforage.setItem("daysperweek",d)),setUpSettings.twelveHourTime=a,setUpSettings.pushNotifications=b,setUpSettings.dateformat=c,setUpSettings.daysperweek=d,setUpSettings.ready=!0})})})})},checkDateRan:function(){if(dateConverter.firstTime)return void setTimeout(setUpSettings.checkDateRan,10);var a=1;6!=(new Date).getDay()&&0!=(new Date).getDay()||(a=2),$("#formtoday").val(dateConverter.firstDay+a),setUpSettings.verifyToday(),setUpSettings.day=dateConverter.firstDay}};