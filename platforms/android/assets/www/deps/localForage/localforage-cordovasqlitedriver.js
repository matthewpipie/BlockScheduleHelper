!function(a,b){"object"==typeof exports&&"undefined"!=typeof module?module.exports=b():"function"==typeof define&&define.amd?define(b):a.cordovaSQLiteDriver=b()}(this,function(){"use strict";function a(b){return a.result?a.result:(b&&"function"==typeof b.getSerializer||Promise.reject(new Error("localforage.getSerializer() was not available! localforage v1.4+ is required!")),a.result=b.getSerializer(),a.result)}function b(a,c){return b.result=b.result||{},b.result[c]?b.result[c]:(a&&"function"==typeof a.getDriver||Promise.reject(new Error("localforage.getDriver() was not available! localforage v1.4+ is required!")),b.result[c]=a.getDriver(c),b.result[c])}function c(a){return b(a,a.WEBSQL)}function f(b){var d=this,f={db:null};if(b)for(var g in b)f[g]="string"!=typeof b[g]?b[g].toString():b[g];var h=e.then(function(a){return new Promise(function(b,c){try{f.location=f.location||"default",f.db=a({name:f.name,version:String(f.version),description:f.description,size:f.size,location:f.location})}catch(a){c(a)}f.db.transaction(function(a){a.executeSql("CREATE TABLE IF NOT EXISTS "+f.storeName+" (id INTEGER PRIMARY KEY, key unique, value)",[],function(){d._dbInfo=f,b()},function(a,b){c(b)})})})}),i=a(d),j=c(d);return Promise.all([i,j,h]).then(function(a){return f.serializer=a[0],h})}function h(a){function d(a,b){a[b]=function(){var a=this,d=arguments;return c(a).then(function(c){return c[b].apply(a,d)})}}for(var b=["clear","getItem","iterate","key","keys","length","removeItem","setItem"],e=0,f=b.length;e<f;e++)d(a,b[e])}var d=new Promise(function(a,b){"undefined"!=typeof sqlitePlugin?a():"undefined"==typeof cordova?b():document.addEventListener("deviceready",a,!1)}),e=d.catch(Promise.resolve).then(function(){return new Promise(function(a,b){"undefined"!=typeof sqlitePlugin&&"function"==typeof sqlitePlugin.openDatabase?a(sqlitePlugin.openDatabase):b("SQLite plugin is not present.")})}),g={_driver:"cordovaSQLiteDriver",_initStorage:f,_support:function(){return e.then(function(a){return!!a}).catch(function(){return!1})}};return h(g),g});