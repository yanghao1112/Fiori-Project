sap.ui.define([ "sap/ui/core/mvc/Controller" ], function(Controller) {
	"use strict";

	return Controller.extend("sap.ZZZ01.YY_TS_SETTING.controller.ZZmain", {
		onInit : function(evt) {
			var x = 1;

		},
		onStart: function(evt) {
			var x = 1;
		},
		onComplete: function(evt) {
			var x = 1;
		},
		onPressDownload: function(evt) {
			var controller =  this.getView().byId("fileup");
			controller.upload();
		}
	});

});