/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
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
		$('#formsubmit').click(schoolClasses.handleSubmit);
		$('#formremove').click(function() {navigator.notification.confirm("Are you sure you want to remove this class?  This action can NOT be undone.", schoolClasses.removeForm, "Delete Class");});
		$('.plusbuttonholder').click(schoolClasses.addNewClass);
		$('#formname').click(function() {$(this).select();});
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
			change: schoolClasses.spectrumChange,
			show: schoolClasses.lockPopup,
			hide: schoolClasses.unlockPopup
		});
	},

	spectrumChange: function(tinycolor) {

		if (tinycolor == undefined) {return;}

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
	},

	unlockPopup: function() {
		$('#openpopup').popup({
		  dismissible: true
		});
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
		$('.rowid').click(function() {
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
					if (value[i] == undefined) {continue;}
					for (var j = 0; j < value[i].length; j++) {
						if (value[i][j]['className'] == schoolClasses.currentlyEditing['schoolClass']['id']) {
							value[i].splice(j, 1);
						}
					}
				}
				localforage.setItem('schedule', value);
			});
			localforage.getItem('globalSchedule').then(function(value2) {
				for (var i = 0; i < value2.length; i++) {
					if (value2[i]['className'] == schoolClasses.currentlyEditing['schoolClass']['id']) {
						value2.splice(i, 1);
					}
				}
				localforage.setItem('globalSchedule', value2);
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

