var app={initialize:function(){app.bindEvents()},bindEvents:function(){document.addEventListener("deviceready",app.onDeviceReady,!1),$(document).one("pagecontainerbeforeshow",app.pagecontainerbeforeshow)},onDeviceReady:function(){app.receivedEvent("deviceready")},pagecontainerbeforeshow:function(){app.receivedEvent("pagecontainerbeforeshow")},receivedEvent:function(a){setUpStorage[a](),addmenu[a](),dateConverter[a](),setUpSettings[a]()}};app.initialize();