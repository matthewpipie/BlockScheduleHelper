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

var mainpanel = "" +
"<h2 class='ui-header ui-bar-inherit'>Menu</h2>" +
"<ul>" +
    "<li id='schedule'>Schedule</li>" +
    "<li id='editor'>Editor</li>" +
    "<li id='settings'>Settings</li>" +
"</ul>";

var button = "" +
'<a href="#mainpanel" class="hamburger" data-inline="true" data-iconpos="notext" data-corners="false">' +
    '<span class="hamburger-box">' +
        '<span class="hamburger-inner"></span>' +
    '</span>' +
'</a>';

$(document).one('pagebeforeshow', '[data-role="page"]', function(){
    var site = $('#mainpanel').html();
    $('#mainpanel').html(mainpanel);
    $('#' + site).attr('id', 'selected');
    $('[data-role="header"]').append(button);

});

$(document).one('deviceready', function() {

    $('[data-role=page]').trigger('create');


    $( document ).on( "swiperight", "[data-role=page]", function( e ) {
    // We check if there is no open panel on the page because otherwise
    // a swipe to close the left panel would also open the right panel (and v.v.).
    // We do this by checking the data that the framework stores on the page element (panel: open).
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) {
            $( "#mainpanel" ).panel( "open" );
        }
    });
});
