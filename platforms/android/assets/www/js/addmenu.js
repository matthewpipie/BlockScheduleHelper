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

var addmenu = {
	mainpanel: "" +
"<h2 class='ui-header ui-bar-inherit'>Menu</h2>" +
"<ul>" +
	"<a href='index.html' data-ajax=false><li id='schedulelink'>Schedule</li></a>" +
	"<a href='editor.html' data-ajax=false><li id='editorlink'>Schedule Editor</li></a>" +
	"<a href='classes.html' data-ajax=false><li id='classeslink'>Class Editor</li></a>" +
	"<a href='settings.html' data-ajax=false><li id='settingslink'>Settings</li></a>" +
"</ul>",

	button: "" +
'<a href="#mainpanel" class="hamburger" data-inline="true" data-iconpos="notext" data-corners="false">' +
	'<span class="hamburger-box">' +
		'<span class="hamburger-inner"></span>' +
	'</span>' +
'</a>',

	pagecontainerbeforeshow: function() {
		$('#mainpanel').html(addmenu.mainpanel);
		$('[data-role="header"]').append(addmenu.button);
	},

	deviceready: function() {
		$('[data-role=page]').trigger('create');
		$('#' + $('[data-role=page]').attr('id') + 'link').addClass('selected');
		addmenu.enableSwipe();
	},

	enableSwipe: function() {
		$( document ).on( "swiperight", "[data-role=page]", function( e ) {
		// We check if there is no open panel on the page because otherwise
		// a swipe to close the left panel would also open the right panel (and v.v.).
		// We do this by checking the data that the framework stores on the page element (panel: open).
			if ( $.mobile.activePage.jqmData( "panel" ) !== "open" && $('.in').length == 0) {
				$( "#mainpanel" ).panel( "open" );
			}
		});
		console.log('swipe enabled');
	},
	checkOpen: function() {
		if ($('.ui-panel-dismiss-open').length == 1) {
			return true;
		}
		else {
			return false;
		}
	}

};
