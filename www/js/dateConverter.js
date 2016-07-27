var dateConverter = {
	setDay: 0,
	setDateO: {},
	dateToFind: {},
	dateSet: false,
	currentDay: 0,
	currentDate: {},

	getDay: function() {
		dateConverter.dateToFind = new Date(dateConverter.currentDate);

		localforage.getItem('dateday').then(function(value) {
			if (value == undefined) {
				value = dateConverter.setDateDay("", 0);
			}
			dateConverter.setDay = value['day'];
			dateConverter.setDateO = new Date(value['date']);
			localforage.getItem('daysperweek').then(function(value) {
				if (value == undefined) {
					localforage.setItem('daysperweek', 7);
					value = 7;
					console.log("set daysperweek to default");
				}

				dateConverter.currentDay = dateConverter.calculateDay(value);
				dateConverter.dateSet = true;
			});
		});
	},

	setDateDay: function(date, day) {
		console.log('setting ' + date + " to " + day);
		if (typeof(date) == 'string') {
			if (date === "") {
				date = new Date();
			}
			else {
				date = new Date(date);
			}
		}
		var dateDay = {'date': date.toString(), 'day': day};
		localforage.setItem('dateday', dateDay);
		return dateDay;
	},

	getBusinessDatesCount: function(startDate, endDate) {
		var count = 0;
		var curDate = new Date(startDate);

		while (curDate <= endDate) {
			var dayOfWeek = curDate.getDay();
			if(!((dayOfWeek == 6) || (dayOfWeek == 0)))
				count++;
			curDate.setDate(curDate.getDate() + 1);
		}

		return count;
	},
	
	calculateDay: function(daysperweek) {
		var daysBetween = 0;

		if (dateConverter.setDateO <= dateConverter.dateToFind) { //set before datetofind, aka in the past
			daysBetween = (dateConverter.getBusinessDatesCount(dateConverter.setDateO, dateConverter.dateToFind) - 1);
		} else {
			daysBetween = -(dateConverter.getBusinessDatesCount(dateConverter.dateToFind, dateConverter.setDateO));
		}

		daysBetween %= daysperweek;

		if (daysBetween < 0) {
			daysBetween += 7;
		}

		console.log(daysBetween);
		return daysBetween;
	},

	resetDateSet: function() {
		dateConverter.dateSet = false;
	},

	deviceready: function() {
		dateConverter.currentDate = new Date();
	},

	pagecontainerbeforeshow: function() {}

}
