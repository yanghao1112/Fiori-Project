sap.ui.define([
		"soreturn/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("soreturn.controller.Full", {

			onInit : function () {
				var oViewModel,
				fnSetAppNotBusy,
				oListSelector = this.getOwnerComponent().oListSelector,
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			}

		});

	}
);