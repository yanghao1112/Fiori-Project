sap.ui.define([ "sap/ui/base/Object", "sap/m/MessageBox" ], function(
		BaseObject, MessageBox) {
	"use strict";
	return BaseObject.extend("sap.pwaa.util.MessageDisplayer", {
		constructor : function(aComponent) {
			this._nCounter = 0;
			this.oDataModel = aComponent.getModel();
			this.oBundle = aComponent.getModel("i18n").getResourceBundle();
		},

		_showHttpRequestError : function(aError) {
			MessageBox.error(aError.statusText);
		},
		_showBackEndError : function(aError) {
			let oMessage = aError.returnMessage;
			let bArray =  oMessage instanceof Array;
			if (bArray) {
				MessageBox.show("Error message", {
					icon: MessageBox.Icon.ERROR,
					title: "Error",
					actions: [MessageBox.Action.CLOSE],
					details: oMessage
				});
			} else {
				MessageBox.show(oMessage, {
					icon: MessageBox.Icon.ERROR,
					title: "Error",
					actions: [MessageBox.Action.CLOSE]
				});
			}
		},
		showSingleError: function(aError) {
			MessageBox.error(
					aError
			);
		},
		showError : function(aError) {
			switch (aError["ErrorType"]) {
			case "0":
				this._showHttpRequestError(aError["Error"]);
				break;
			case "1":
				this._showBackEndError(aError["Error"]);
				break;
			default:
			}
		}

	})
});