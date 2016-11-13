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

var schoolClasses = {

	schoolClasses: [],
	palette: [],
	currentlyEditing: {},

	updateClassList: function() {
		schoolClasses.removeClickies();
		var $classtable = $("#classtable");
		$classtable.html("<tr><th>Class</th></tr>");
		for (var i = 0; i < schoolClasses.schoolClasses.length; i++) {
//TODO:
//look for proper actual class in localforage(classes)
//
			$classtable.append("<tr class='rowid' id='row" + schoolClasses.schoolClasses[i]['id'] +
				"'><td style='background: " + schoolClasses.schoolClasses[i]['bgcolor'] +
				"; color: " + (schoolClasses.schoolClasses[i]['whiteText'] ? "white" : "black") +
				";'>" + schoolClasses.schoolClasses[i]['className'] +
				(schoolClasses.schoolClasses[i]['room'] == "" ? "" : " (" + schoolClasses.schoolClasses[i]['room'] + ")") +
				"</td></tr>");
		}
		schoolClasses.setUpClickies();
			
	},

	setUpClicks: function() {
		$('#formsubmit').on('touchend', function() {if (addmenu.checkOpen()) {return} schoolClasses.handleSubmit()});
		$('#formremove').on('touchend', function() {if (addmenu.checkOpen()) {return} navigator.notification.confirm("Are you sure you want to remove this class?  This action can NOT be undone.", schoolClasses.removeForm, "Delete Class");});
		$('.plusbuttonholder').on('touchend', function(ev) {if (addmenu.checkOpen()) {return} ev.preventDefault(); schoolClasses.addNewClass();});
		$('#formname').on('touchend', function() {if (addmenu.checkOpen()) {return} $(this).select();});
	},

	setUpSpectrum: function() {
		$("#formbgcolor").spectrum({
			showInitial: true,
			showPalette: true,
			showButtons: false,
			allowEmpty: true,
			containerClassName: 'formcolorContainer',
			replacerClassName: 'formcolorReplacer',
			preferredFormat: 'hex',
			maxSelectionSize: 0,
			palette: schoolClasses.palette,
			show: schoolClasses.lockPopup,
			hide: schoolClasses.unlockPopup
		});
	},

	spectrumChange: function(tinycolor) {

		if (tinycolor == undefined) {tinycolor = $("#formbgcolor").spectrum('get');}
		if (tinycolor == null) {return;}
		var alreadyIn = false;
		var tinycolorhex = tinycolor.toHexString();

		for (var i = 0; i < schoolClasses.palette.length; i++) {
			for (var j = 0; j < schoolClasses.palette[i].length; j++) {
				console.log(schoolClasses.palette[i][j]);
				console.log(tinycolorhex);
				if (schoolClasses.palette[i][j] == tinycolorhex) {
					alreadyIn = true;
					break;
				}
			}
			if (alreadyIn) {break;}
		}

		if (!alreadyIn) {
			console.log('it wasnt in');
			if (!(schoolClasses.palette[8].length < 8)) {
				schoolClasses.palette[8].splice(0, 1);
			}

			schoolClasses.palette[8].push(tinycolorhex);

			$("#formbgcolor").spectrum("option", 'palette', schoolClasses.palette);
			localforage.setItem('palette', schoolClasses.palette);
		}

		
	},

	deviceready: function() {
		console.log('moo');
		localforage.getItem('schoolClasses').then(function(value4) {
			schoolClasses.loadClasses(value4);
			schoolClasses.updateClassList();
		});
		localforage.getItem('palette').then(function(value5) {
			if (value5 == undefined) {
				value5 = [
					["#000000","#444444","#666666","#999999","#cccccc","#eeeeee","#f3f3f3","#ffffff"],
					["#ff0000","#ff9900","#ffff00","#00ff00","#00ffff","#0000ff","#9900ff","#ff00ff"],
					["#f4cccc","#fce5cd","#fff2cc","#d9ead3","#d0e0e3","#cfe2f3","#d9d2e9","#ead1dc"],
					["#ea9999","#f9cb9c","#ffe599","#b6d7a8","#a2c4c9","#9fc5e8","#b4a7d6","#d5a6bd"],
					["#e06666","#f6b26b","#ffd966","#93c47d","#76a5af","#6fa8dc","#8e7cc3","#c27ba0"],
					["#cc0000","#e69138","#f1c232","#6aa84f","#45818e","#3d85c6","#674ea7","#a64d79"],
					["#990000","#b45f06","#bf9000","#38761d","#134f5c","#0b5394","#351c75","#741b47"],
					["#660000","#783f04","#7f6000","#274e13","#0c343d","#073763","#20124d","#4c1130"],
					[]
				];
				localforage.setItem('palette', value5);
			}
			schoolClasses.palette = value5;
			schoolClasses.setUpSpectrum();
		});
		schoolClasses.setUpClicks();
	},

	lockPopup: function() {
		$('#openpopup').popup({
		  dismissible: false
		});
		$('#formsubmit').button('option', 'disabled', true);
		$('#formremove').button('option', 'disabled', true);
		window.scrollTo(0,document.body.scrollHeight);
	},

	unlockPopup: function() {
		$('#openpopup').popup({
		  dismissible: true
		});
		$('#formsubmit').button('option', 'disabled', false);
		$('#formremove').button('option', 'disabled', false);
		schoolClasses.spectrumChange();
	},

	loadClasses: function(value4) {
		if (value4 == undefined) {
			localforage.setItem('schoolClasses', []);
			value4 = [];
		}
		schoolClasses.schoolClasses = value4; //[{className: "Math", bgcolor: "#123456", id: '4', whiteText: false, room: "M169"}]
	},

	pagecontainerbeforeshow: function() {
	},

	removeClickies: function() {
		$('.rowid').unbind('click');
	},

	setUpClickies: function() {
		$('.rowid').on('touchend', function(ev) {
			if (addmenu.checkOpen()) {return}
			ev.preventDefault();
			for (var i = 0; i < schoolClasses.schoolClasses.length; i++) {
				if (typeof($(this).attr('id')) == "string") {
					if (schoolClasses.schoolClasses[i]['id'] == $(this).attr('id').substr(3)) {
						schoolClasses.editSchoolClass(schoolClasses.schoolClasses[i], false);
					}
				}
			}
		});
	},

	addNewClass: function() {
		console.log('adding new');
		var highest = -1;
		for (var i = 0; i < schoolClasses.schoolClasses.length; i++) {
			if (parseInt(schoolClasses.schoolClasses[i]['id']) > highest) {
				highest = parseInt(schoolClasses.schoolClasses[i]['id']);
			}
		}
		var tempSchoolClass = {'className': "New Class", 'id': (highest + 1).toString(), 'room': "", 'bgcolor': null, 'whiteText': false};
		schoolClasses.editSchoolClass(tempSchoolClass, true)
	},

	editSchoolClass: function(schoolClass, isNew) {
		if (isNew) {
			$('.ui-block-a').css('display', 'none');
			$('.ui-block-b').css('width', '100%');
		}
		else {
			$('.ui-block-a').css('display', 'block');
			$('.ui-block-b').css('width', '50%');
		}


		console.log(schoolClass);
		$('#formname').val(schoolClass['className']);
		$("#formroom").val(schoolClass['room']);
		$('#formbgcolor').spectrum('set', schoolClass['bgcolor']);

		if (schoolClass['whiteText']) {
			$('#formtextcolor')[0].checked = true;
			$("#formtextcolor").flipswitch("refresh");
		} else {
			$('#formtextcolor')[0].checked = false;
			$("#formtextcolor").flipswitch("refresh");
		}		

		schoolClasses.currentlyEditing = {'schoolClass': schoolClass, 'isNew': isNew};;

		$('#openpopup').popup('open');
		setTimeout(function() {document.activeElement.blur();}, 10);
	},

	removeForm: function(buttonIndex) {
		if (buttonIndex == 1) {
			$('#openpopup').popup('close');
			if (schoolClasses.currentlyEditing['isNew']) {return;}

			var i;
			for (i = 0; i < schoolClasses.schoolClasses.length; i++) {
				if (schoolClasses.schoolClasses[i]['id'] == schoolClasses.currentlyEditing['schoolClass']['id']) {
					break;
				}
			}
			schoolClasses.schoolClasses.splice(i, 1);
			localforage.setItem('schoolClasses', schoolClasses.schoolClasses).then(function(value) {
				schoolClasses.loadClasses(value);
				schoolClasses.updateClassList();
			});

			localforage.getItem('schedule').then(function(value) {
				for (var i = 0; i < value.length; i++) {
					if (value[i] == undefined) {value[i] = []; continue;}
					for (var j = value[i].length - 1; j <= 0; j++) {
						if (value[i][j]['className'] == schoolClasses.currentlyEditing['schoolClass']['id']) {
							value[i].splice(j, 1);
						}
					}
				}
				localforage.setItem('schedule', value).then(function() {
					localforage.getItem('globalSchedule').then(function(value2) {
						for (var i = value2.length; i <= 0; i++) {
							if (value2[i]['className'] == schoolClasses.currentlyEditing['schoolClass']['id']) {
								value2.splice(i, 1);
							}
						}
						localforage.setItem('globalSchedule', value2).then(function() {
							localforage.getItem('pushNotifications').then(function(val) {
								if (val) {
									cordova.plugins.notification.local.cancelAll(function() {
										setUpSettings.scheduleNextEventAndClear(null, true, false);
									});
								}
							});
						});
					});
				});
			});
			
			
		}
	},


	handleSubmit: function() {
		$('#openpopup').popup('close');

		if ($('#formname').val() == "") {
			navigator.notification.alert("Error in saving data.  Did you fill out all forms?", null, "Error", "OK");
			return;
		}

				var correctClass = {'id': schoolClasses.currentlyEditing['schoolClass']['id']};
				correctClass['className'] = $("#formname").val();
				correctClass['room'] = $('#formroom').val();
				correctClass['bgcolor'] = $('#formbgcolor').spectrum('get');
				if (correctClass['bgcolor'] != undefined) {
					correctClass['bgcolor'] = correctClass['bgcolor'].toHexString();
				}
				correctClass['whiteText'] = $('#formtextcolor')[0].checked;

					//STILL NOT GLOBAL
					var i;
					for (i = 0; i < schoolClasses.schoolClasses.length; i++) {
						if (schoolClasses.schoolClasses[i]['id'] == correctClass['id']) {
							break;
						}
					}

					schoolClasses.schoolClasses[i] = correctClass;

					localforage.setItem('schoolClasses', schoolClasses.schoolClasses).then(function(val) {
						schoolClasses.loadClasses(val);
						schoolClasses.updateClassList();
					});

		//edit object, store back into localforage, re-decompress and refresh display
	}



};

