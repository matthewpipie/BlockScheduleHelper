var setUpSettings={pagecontainerbeforeshow:function(){setUpSettings.loadSettings()},deviceready:function(){$("#formsubmit").click(function(a){a.preventDefault(),setUpSettings.handleSubmit()}),$("#formdays").change(setUpSettings.verifyDay),$("#formtoday").change(setUpSettings.verifyToday),$("#formreset").click(function(a){a.preventDefault(),setUpSettings.confirmReset()})},verifyDay:function(){$("#formdays").val()&&$("#formdays").val()==parseInt($("#formdays").val())?parseInt($("#formdays").val())<1&&$("#formdays").val(1):$("#formdays").val(7),setUpSettings.verifyToday()},verifyToday:function(){var a=parseInt($("#formdays").val()),b=parseInt($("#formtoday").val());$("#formtoday").val()&&$("#formtoday").val()==parseInt($("#formtoday").val())||(b=1),b>a&&(b%=a),b<1&&(b=a),$("#formtoday").val(b)},confirmReset:function(){navigator.notification.confirm("Are you sure you would like to delete your schedule?  This can NOT be undone.",setUpSettings.handleReset,"Reset Schedule")},handleReset:function(a){1==a&&(localforage.setItem("schedule",[]),localforage.setItem("globalSchedule",[]),navigator.notification.alert("Schedule cleared."))},handleSubmit:function(){var a=$("#formtime")[0].checked,b=$("#formnotifications")[0].checked,c=$("#formselect").val(),d=$("#formdays").val(),e=$("#formtoday").val();localforage.setItem("twelveHourTime",a),localforage.setItem("pushNotifications",b),localforage.setItem("dateformat",parseInt(c)),localforage.setItem("daysperweek",parseInt(d)),localforage.setItem("currentDay",parseInt(e)),dateConverter.setDateDay("",parseInt(e)-1)},loadSettings:function(){localforage.getItem("twelveHourTime").then(function(a){void 0==a&&(a=!1,localforage.setItem("twelveHourTime",a)),localforage.getItem("pushNotifications").then(function(b){void 0==b&&(b=!1,localforage.setItem("pushNotifications",b)),localforage.getItem("dateformat").then(function(c){void 0==c&&(c=0,localforage.setItem("dateformat",c)),localforage.getItem("daysperweek").then(function(d){void 0==d&&(d=7,localforage.setItem("daysperweek",d)),$("#formtime")[0].checked=a,$("#formtime").flipswitch("refresh"),$("#formnotifications")[0].checked=b,$("#formnotifications").flipswitch("refresh"),$("#formselect").val(c).change(),$("#formdays").val(d),dateConverter.getDay(),setTimeout(setUpSettings.checkDateRan,10)})})})})},checkDateRan:function(){dateConverter.firstTime&&setTimeout(setUpSettings.checkDateRan,10),$("#formtoday").val(dateConverter.firstDay+1)}};