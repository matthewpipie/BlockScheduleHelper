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

var datebox = '' +
'<div id="datebox">' +
    '<span id="leftbutton"><span id="bar1"></span><span id="bar2"></span></span>' +
    '<span id="date"></span>' +
    '<span id="rightbutton"><span id="bar3"></span><span id="bar4"></span></span>' +
'</div>';

var updateDateBox = function(sortedSchedule, blockDay) {
    $scheduletable = $("#scheduletable");
    for (var i = 0; i < sortedSchedule[blockDay].length; i++) {
        sortedSchedule[blockDay]
    }
}


var decompress = function(infos) {


    var sortedinfos = [];
    for (var i = 0; i < infos.length; i++) {
        var temp = [];
        for (var j = 0; j < infos[i].length; j++) {
            var temptime = infos[i][j]['starttime'].split(":");
            temp.push({'id': infos[i][j]['id'], 'starttime': parseInt(temptime[0] * 60 + temptime[1])});
        }
        var sortedinfo = [];

        temp.sort(function(a, b) {return parseInt(a['starttime'], 10) - parseInt(b['starttime'], 10);})

        for (var k = 0; k < temp.length; k++) {
            sortedinfo.push(infos[i].filter(function(obj) {return obj.id == temp[k]['id'];})[0]);
            
        }
        sortedinfos[i] = sortedinfo;
    }

    return sortedinfos;
};

var scheduleCallback = function(err, value) {
    var schedule;
    if (err != null) {
        $('#content').append("Create a schedule by clicking on the menu icon!");
        schedule = "";
    } else {
        schedule = value;
    }

    sortedSchedule = decompress(schedule);

    updateDateBox(sortedSchedule, 0);

};


$(document).one('pagebeforeshow', '[data-role="page"]', function(){
    $('#content').prepend(datebox);
});

//$(document).one('deviceready', function() {
$(document).ready(function() {
    localforage.getItem('schedule', scheduleCallback)
});



/*
EXAMPLE SCHEDULE:

[[{class, starttime, endtime, id}, second class object in day 1] day 2]

*/