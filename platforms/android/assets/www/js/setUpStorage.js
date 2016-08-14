var setUpStorage = {

	storage: false,

	pagecontainerbeforeshow: function() {},

	deviceready: function() {
		localforage.defineDriver(window.cordovaSQLiteDriver).then(function() {
			return localforage.setDriver([
					// Try setting cordovaSQLiteDriver if available,
				window.cordovaSQLiteDriver._driver,
					// otherwise use one of the default localforage drivers as a fallback.
					// This should allow you to transparently do your tests in a browser
				localforage.INDEXEDDB,
				localforage.WEBSQL,
				localforage.LOCALSTORAGE
			]);
		}).then(function() {
	  // this should alert "cordovaSQLiteDriver" when in an emulator or a device
			//alert(localforage.driver());
			storage = true;
			app.mainSetUp();
		});
	}
};
