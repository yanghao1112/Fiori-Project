sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter"],
function(BaseObject, Filter, FilterOperator, Sorter) {
	"use strict";
	return BaseObject.extend("sap.ZG001.Sample.CO114.util.DataManager", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the data manager object is to be created.
		 * @public
		 */
		constructor : function(aComponent) {
			this._nCounter = 0;
			this._busyDialog = new sap.m.BusyDialog();
			this.oDataModel = aComponent.getModel();
			this.oBundle = aComponent.getModel("i18n").getResourceBundle();
		},

		/**
		 * get Data
		 * 
		 * @private
		 */
		getCVPData: function(sCompany, sBU, sYear) {

			var oFilterArray = [];
			[
				{key:"zbukrs",	value:sCompany},
				{key:"zbu",		value:sBU},
				{key:"zyear",	value:sYear}
			].forEach(function(aCurrentValue, aIndex, aArr) {

				var oFilter = new Filter(aCurrentValue.key, FilterOperator.EQ, aCurrentValue.value) 
				oFilterArray.push(oFilter);
			})

			var oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();
				this.oDataModel.read("/ZCVP_BY_PERIOD", {
					filters: oFilterArray,
					success: function(aData) {
						this._hideBusy(true);
						fnResolve(aData);
					}.bind(this),
					error: function(aError) {
						this._hideBusy(true);
						fnReject(aError);
					}.bind(this)
				});
			}.bind(this));
			return oDataGot;
		},
		
		/**
		 * get Data
		 * 
		 * @private
		 */
		getCVPCompanyBU: function() {

			var oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();
				this.oDataModel.read("/ZCVP_COMPANY_BU", {
					success: function(aData) {
						this._hideBusy(true);
						fnResolve(aData);
					}.bind(this),
					error: function(aError) {
						this._hideBusy(true);
						fnReject(aError);
					}.bind(this)
				});
			}.bind(this));
			return oDataGot;
		},
		
		/**
		 * get Data
		 * 
		 * @private
		 */
		getCVPYear: function() {

			var oSorter = new Sorter("CVPYear", false) 
			var oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();
				this.oDataModel.read("/ZCVP_YEAR", {
					sorters: [oSorter],
					success: function(aData) {
						this._hideBusy(true);
						fnResolve(aData);
					}.bind(this),
					error: function(aError) {
						this._hideBusy(true);
						fnReject(aError);
					}.bind(this)
				});
			}.bind(this));
			return oDataGot;
		},
		/**
		 * set the screen in busy status
		 * 
		 * @private
		 */
		_showBusy : function() {
			"use strict";
			this._nCounter++;
			if (this._nCounter === 1) {
				this._busyDialog.open();
			}
		},

		/**
		 * relieve busy status of screen
		 * 
		 * @private
		 */
		_hideBusy : function(aForceHide) {
			"use strict";
			if (this._nCounter === 0) {
				return;
			}
			this._nCounter = aForceHide ? 0 : Math.max(0, this._nCounter - 1);
			if (this._nCounter > 0) {
				return;
			}
			this._busyDialog.close();
		}

	});
});