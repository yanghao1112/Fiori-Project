sap.ui.define([
	"sap/ui/base/Object"
], function(BaseObject) {
	"use strict";

	return BaseObject.extend("sap.ZZZ01.ZFILEUPLOAD.util.DataManager", {

		/**
		 * Provides a convenience API for getting data with odata.
		 * function.
		 * @class
		 * @public
		 * @alias sap.ZDEV.ZHCM_OT_MANAGE.model.DataManager
		 */

		constructor: function(aComponent) {
			"use strict";
			this._nCounter = 0;
			this._busyDialog = new sap.m.BusyDialog();
			this.oBundle = aComponent.getModel("i18n").getResourceBundle();
			this.oModel = aComponent.getModel();
			this.oModel.setUseBatch(false);
		},

		/**
		 * save upload data by GUIID
		 * return the deffered object
		 * @param
		 * @public
		 */
		saveUploadData: function(aData) {
			var sPath = "/UploadSet(guid'" + aData.GUIID + "')";
			this._showBusy();
			var oWhenCreateIsDone = new Promise(function(fnResolve, fnReject) {
				var oSelf =this;
				this.oModel.update(
					sPath, aData, {
						success: function(aData) {
							oSelf._hideBusy(true);
							fnResolve(aData);
						},
						error: function(aError) {
							oSelf._hideBusy(true);
							fnReject(aError);
						}
					});
			}.bind(this));
			return oWhenCreateIsDone;
		},
		
		
		/**
		 * set the screen in busy status
		 * @private
		 */
		_showBusy: function() {
			"use strict";
			this._nCounter++;
			if (this._nCounter === 1) {
				this._busyDialog.open();
			}
		},

		/**
		 * relieve busy status of screen
		 * @private
		 */
		_hideBusy: function(aForceHide) {
			"use strict";
			if (this._nCounter === 0) {
				return;
			}
			this._nCounter = aForceHide ? 0 : Math.max(0,
				this._nCounter - 1);
			if (this._nCounter > 0) {
				return;
			}
			this._busyDialog.close();
		}
	})
})