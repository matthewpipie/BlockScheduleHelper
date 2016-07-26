var dateConverter = {
	setDay: 0,
	setDate: {},
	dateToFind: {},
	dateSet: false,
	getDay: function(date) {
		dateConverter.dateToFind = new Date(date);
		localforage.getItem('dateday').then(function(err, value) {
			if (err != null) {
				value = dateConverter.setDateDay(new Date(), 0);
			}
			setDay = value['day'];
			setDate = value['date'];
			localforage.getItem('daysperweek').then(function(err, value) {
				if (err != null) {
					localforage.setItem('daysperweek', 7);
					value = 7;
				}
				dateConverter.currentDay = dateConverter.calculateDay(value);
				dateConverter.setDate = true;
			});
		});
	},
	setDateDay: function(date, day) {
		if (typeof(date) == 'string') {
			date = new Date(date);
		}
		var dateDay = {'date': date, 'day': day};
		localforage.setItem('dateday', dateDay);
		return dateDay;
	},
	getBusinessDatesCount: function(startDate, endDate) {
		var count = 0;
		var curDate = startDate;
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

		if (dateConverter.setDate <= dateConverter.dateToFind) { //set before datetofind, aka in the past
			daysBetween = getBusinessDatesCount(dateConverter.setDate, dateConverter.dateToFind);
		} else {
			daysBetween = getBusinessDatesCount(dateConverter.dateToFind, dateConverter.setDate);
		}

		daysBetween -= 1;
		daysBetween %= daysperweek;

		return daysBetween;

}
