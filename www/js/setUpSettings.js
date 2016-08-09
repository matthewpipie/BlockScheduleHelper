var setUpSettings = {
	pagecontainerbeforeshow: function() {
		setUpSettings.loadSettings();
	},
	deviceready: function() {
		$('#formsubmit').click(function(ev) {ev.preventDefault(); setUpSettings.handleSubmit()});
		$('#formdays').change(setUpSettings.verifyDay);
		$('#formtoday').change(setUpSettings.verifyToday);
		$('#formreset').click(function(ev) {ev.preventDefault(); setUpSettings.confirmReset()});
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
	handleReset: function(buttonIndex) {
		if (buttonIndex == 1) {
			localforage.setItem('schedule', []);
			localforage.setItem('globalSchedule', []);
			navigator.notification.alert("Schedule cleared.");
		}
	},
	handleSubmit: function() {
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
	},
	loadSettings: function() {
		localforage.getItem('twelveHourTime').then(function(twelveHourTime) {
			if (twelveHourTime == undefined) {
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
						
						$("#formtime")[0].checked = twelveHourTime;
						$("#formtime").flipswitch("refresh");

						$("#formnotifications")[0].checked = pushNotifications;
						$("#formnotifications").flipswitch("refresh");

						$("#formselect").val(dateformat).change();

						$("#formdays").val(daysperweek);
						dateConverter.getDay();

						setTimeout(setUpSettings.checkDateRan, 10);

					});
				});
			});
		});
	},
	checkDateRan: function() {
		if (dateConverter.firstTime) {
			setTimeout(setUpSettings.checkDateRan, 10);
		}

		$("#formtoday").val(dateConverter.firstDay + 1);
	}

}