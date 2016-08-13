var timeouts = [];
var setUpSettings = {

	twelveHourTime: false,
	pushNotifications: false,
	dateformat: 0,
	daysperweek: 7,
	ready: false,
	day: false,

	pagecontainerbeforeshow: function() {
	},
	deviceready: function() {
		setUpSettings.loadSettings();
		setUpSettings.updateSettings();
		$('#formsubmit').click(function(ev) {ev.preventDefault(); setUpSettings.handleSubmit()});
		$('#formdays').change(setUpSettings.verifyDay);
		$('#formtoday').change(setUpSettings.verifyToday);
		$('#formreset').click(function(ev) {ev.preventDefault(); setUpSettings.confirmReset()});
		$('#formreset2').click(function(ev) {ev.preventDefault(); setUpSettings.confirmReset2()});
		setUpSettings.makeNewScheduleEvents();
	},

	updateSettings: function() {
		if (!setUpSettings.ready) {
			setTimeout(setUpSettings.updateSettings, 10);
			return;
		}
		$("#formtime")[0].checked = setUpSettings.twelveHourTime;
		$("#formtime").flipswitch("refresh");

		$("#formnotifications")[0].checked = setUpSettings.pushNotifications;
		$("#formnotifications").flipswitch("refresh");

		$("#formselect").val(setUpSettings.dateformat).change();

		$("#formdays").val(setUpSettings.daysperweek);
		
		dateConverter.getDay();

		setTimeout(setUpSettings.checkDateRan, 10);
	},

	verifyDay: function() {
		if (!$("#formdays").val() || $("#formdays").val() != parseInt($("#formdays").val())) {
			$("#formdays").val(7);
		}
		else if (parseInt($("#formdays").val()) < 1) {
			$("#formdays").val(1);
		}
		setUpSettings.verifyToday();
	},
	verifyToday: function() {
		var daysperweek = parseInt($("#formdays").val());
		var currentDay = parseInt($("#formtoday").val());
		if (!$("#formtoday").val() || $("#formtoday").val() != parseInt($("#formtoday").val())) {
			currentDay = 1;
		}
		if (currentDay > daysperweek) {
			currentDay %= daysperweek;
		}
		if (currentDay < 1) {
			currentDay = daysperweek;
		}
		$('#formtoday').val(currentDay);
	},

	confirmReset: function() {
		navigator.notification.confirm("Are you sure you would like to delete your schedule?  This can NOT be undone.", setUpSettings.handleReset, "Reset Schedule");
	},
	confirmReset2: function() {
		navigator.notification.confirm("Are you sure you would like to delete all of your classes?  This can NOT be undone.", setUpSettings.handleReset2, "Reset Classes");
	},
	handleReset: function(buttonIndex) {
		if (buttonIndex == 1) {
			localforage.setItem('schedule', undefined);
			localforage.setItem('globalSchedule', undefined);
			navigator.notification.alert("Schedule deleted.");
		}
	},
	handleReset2: function(buttonIndex) {
		if (buttonIndex == 1) {
			localforage.setItem('schoolClasses', undefined);
			navigator.notification.alert("Classes deleted.");
		}
	},

	scheduleNextEventAndClear: function(notification, isInit) {
		if (isInit == undefined) {
			isInit = false;
		}
		//settimout for x minutes to wipe notifications
		//make next notification
		localforage.getItem('schoolClasses').then(function(schoolClasses) {
			localforage.getItem('schedule').then(function(schedule) {
				localforage.getItem('globalSchedule').then(function(globalSchedule) {
					localforage.getItem('daysperweek').then(function(daysperweek) {
						localforage.getItem('dateday').then(function(dateday) {

							if (schoolClasses == undefined) {
								schoolClasses = [];
								localforage.setItem('schoolClasses', schoolClasses);
							}
							if (schedule == undefined) {
								schedule = [];
								localforage.setItem('schedule', schedule);
							}
							if (globalSchedule == undefined) {
								globalSchedule = [];
								localforage.setItem('globalSchedule', globalSchedule);
							}
							if (daysperweek == undefined) {
								daysperweek = 7;
								localforage.setItem('daysperweek', daysperweek);
							}
							if (dateday == undefined) {
								dateday = {'date': new Date().toString(), 'day': 0};
								localforage.setItem('dateday', dateday);
							}

							var now = new Date();

							for (var i = 0; i < timeouts.length; i++) {
								clearTimeout(timeouts[i]);
							}

							day = setUpSettings.calculateDay(dateday, daysperweek);

							var timeAndId = []; //{id: '5', starttime: 13546, endtime: 15493, isGlobal: false}
							for (var j = 0; j < schedule[day].length; j++) {
								var starttime = schedule[day][j]['starttime'];
								starttime = parseInt(starttime.substr(0, 2)) * 60 + parseInt(starttime.substr(3));
								var endtime = schedule[day][j]['endtime'];
								endtime = parseInt(endtime.substr(0, 2)) * 60 + parseInt(endtime.substr(3));
								timeAndId.push({'id': schedule[day][j]['id'], 'starttime': starttime, 'endtime': endtime, 'isGlobal': false});
							}
							for (var i = 0; i < globalSchedule.length; i++) {
								var starttime = globalSchedule[i]['starttime'];
								starttime = parseInt(starttime.substr(0, 2)) * 60 + parseInt(starttime.substr(3));
								var endtime = globalSchedule[i]['endtime'];
								endtime = parseInt(endtime.substr(0, 2)) * 60 + parseInt(endtime.substr(3));
								timeAndId.push({'id': globalSchedule[i]['id'], 'starttime': starttime, 'endtime': endtime, 'isGlobal': true});
							}
							var starttimeSorted = timeAndId.sort(function(a, b) {return parseInt(a['starttime'], 10) - parseInt(b['starttime'], 10);})
							var endtimeSorted = timeAndId.sort(function(a, b) {return parseInt(a['endtime'], 10) - parseInt(b['endtime'], 10);})
							
							var nowTime = now.getHours() * 60 + now.getMinutes();

							var isInClassAndInit = false;
							if (isInit) {
								var results = starttimeSorted.filter(function(a) {return a['starttime'] < nowTime && a['endtime'] > nowTime});
								isInClassAndInit = (results.length == 0 ? false : true);
								if (nowTime < starttimeSorted[0]['starttime'] - 600) {
									isInClassAndInit = true;
								}
							}

							var hasfound1 = isInClassAndInit;
							var hasfound2 = false;
							var hasfound3 = false;
							for (var i = nowTime; i < 1439; i++) {
								if (starttimeSorted.filter(function(a) {return a['starttime'] == i}).length) {
									if (!hasfound1) {hasfound1 = true; continue;}
									else {
										hasfound2 = true;
										break;
									}
								}
							}
							if (!hasfound2) {
								return;// NEXT THINGO IS TOMORROW TODO TODO AL:DFKJ :KSJDFLKSJDNFLKJSHNDFKJWEBSDFKBVWSKDEFBVKEDWSBFVKWIEJBDFGKIWSUJEBGDFRIKLWEDBGFKIEWBGDR>FKLBGWE>DLKIRFBGEWDIKLJRFBGWKIDBFRG
							}

							for (var j = i; j >= 0; j--) {
								if (endtimeSorted.filter(function(a) {return a['endtime'] == j}).length) {
									hasfound3 = true;
									break;
								}
							}

							if (!hasfound3) {
								return; //someone made their endtimes past their starttimes....
							}

							var timeToClear = i;
							var timeToNotify = j;
							var dateToNotify = new Date();
							console.log(timeToClear);
							console.log(timeToNotify);
							if (timeToClear - timeToNotify > 600) {
								console.log('too biggie');
								timeToNotify = timeToClear - 600;
							}
							var classToNotify = starttimeSorted.filter(function(a) {return a['starttime'] == timeToClear})[0];
							if (classToNotify['isGlobal']) {
								classToNotify = globalSchedule.filter(function(a) {return a['id'] == classToNotify['id']})[0];
							}
							else {
								console.log(schedule);
								console.log(classToNotify);
								classToNotify = schedule[day].filter(function(a) {return a['id'] == classToNotify['id']})[0];
							}
							timeouts.push(setTimeout(function() {cordova.plugins.notification.local.clearAll();}, 1000 * (timeToClear - nowTime)));

							dateToNotify.setHours(0);
							dateToNotify.setSeconds(0);
							dateToNotify.setMilliseconds(0);
							dateToNotify.setMinutes(j);

							scheduleObj = { 
								id: 0,
								title: "Next class: " + setUpSettings.findClass(schoolClasses, classToNotify['className'], 'className') +
									(setUpSettings.findClass(schoolClasses, classToNotify['className'], 'room') == "" ? "" : " (" + setUpSettings.findClass(schoolClasses, classToNotify['className'], 'room') + ")"),
								text: "Starts in " + (timeToClear - timeToNotify).toString() + " minutes",
								at: dateToNotify,
								led: setUpSettings.findClass(schoolClasses, classToNotify['className'], 'bgcolor').substr(1)
							};
							console.log(scheduleObj);

							/*if (thingo) {
								scheduleObj['sound'] = xyz
							}*/

							cordova.plugins.notification.local.schedule(scheduleObj);


						}); //if its past all endtimes, do tomorrow
					});
				});
			});
		});
	},

	findClass: function(schoolClasses, schoolClassIDToFind, partToFind) {
		for (var i = 0; i < schoolClasses.length; i++) {
			if (schoolClasses[i]['id'] == schoolClassIDToFind) {
				return schoolClasses[i][partToFind];
			}
		}
	},

	calculateDay: function(dateday, daysperweek, dateToFind) {
		var daysBetween = 0;
		var setDateO = new Date(dateday['date']);
		var setDay = dateday['day'];

		if (setDateO <= dateToFind) { //set before datetofind, aka in the past
			daysBetween = (dateConverter.getBusinessDatesCount(setDateO, dateToFind) - 1);
		} else {
			daysBetween = -(dateConverter.getBusinessDatesCount(dateToFind, setDateO));
		}

		daysBetween += setDay;

		daysBetween %= daysperweek;

		if (daysBetween < 0) {
			daysBetween += daysperweek;
		}
		return daysBetween;
	},

	makeNewScheduleEvents: function() {

		if (setUpSettings.day === false) {
			setTimeout(setUpSettings.makeNewScheduleEvents, 10);
			return;
		}

		cordova.plugins.notification.local.cancelAll(function() {
			cordova.plugins.notification.local.on('trigger', setUpSettings.scheduleNextEventAndClear);
			setUpSettings.scheduleNextEventAndClear(null, true);
		});
	},

	handleSubmit: function() {
		console.log('saving');
		var twelveHourTime = $("#formtime")[0].checked;
		var pushNotifications = $("#formnotifications")[0].checked;
		var dateformat = $("#formselect").val();
		var daysperweek = $("#formdays").val();
		var currentDay = $("#formtoday").val();

		localforage.setItem('twelveHourTime', twelveHourTime);
		localforage.setItem('pushNotifications', pushNotifications);
		localforage.setItem('dateformat', parseInt(dateformat));
		localforage.setItem('daysperweek', parseInt(daysperweek));
		localforage.setItem('currentDay', parseInt(currentDay));
		dateConverter.setDateDay("", parseInt(currentDay) - 1);

		if (pushNotifications && !(setUpSettings.pushNotifications)) {
			//turned on notifications
			setUpSettings.scheduleNextEventAndClear()
		}
		else if (!(pushNotifications) && setUpSettings.pushNotifications) {
			//turned off notifications
			cordova.plugins.notification.local.cancelAll(function() {
				navigator.notification.alert("Notifications have been turned off.");
			});
		}

	},
	loadSettings: function() {
		localforage.getItem('twelveHourTime').then(function(twelveHourTime) {
			if (twelveHourTime == undefined) {
				console.log('spaghetti');
				twelveHourTime = false;
				localforage.setItem('twelveHourTime', twelveHourTime);
			}
			localforage.getItem('pushNotifications').then(function(pushNotifications) {
				if (pushNotifications == undefined) {
					pushNotifications = false;
					localforage.setItem('pushNotifications', pushNotifications);
				}
				localforage.getItem('dateformat').then(function(dateformat) {
					if (dateformat == undefined) {
						dateformat = 0;
						localforage.setItem('dateformat', dateformat);
					}
					localforage.getItem('daysperweek').then(function(daysperweek) {
						if (daysperweek == undefined) {
							daysperweek = 7;
							localforage.setItem('daysperweek', daysperweek);
						}

						setUpSettings.twelveHourTime = twelveHourTime;
						console.log(twelveHourTime);
						console.log(setUpSettings.twelveHourTime);
						setUpSettings.pushNotifications = pushNotifications;
						setUpSettings.dateformat = dateformat;
						setUpSettings.daysperweek = daysperweek;
						setUpSettings.ready = true;

					});
				});
			});
		});
	},
	checkDateRan: function() {
		if (dateConverter.firstTime) {
			setTimeout(setUpSettings.checkDateRan, 10);
			return;
		}

		$("#formtoday").val(dateConverter.firstDay + 1);
		setUpSettings.day = dateConverter.firstDay;
	}

}