sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"],
function(BaseObject, Filter, FilterOperator) {
	"use strict";
	return BaseObject.extend("ShipmentHF.util.DataManager", {

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
			this.oDataModel = aComponent.getModel("oDataModel");
			this.oBundle = aComponent.getModel("i18n").getResourceBundle();
		},

		/**
		 * get Shipment Data
		 * 
		 * @private
		 */
		getAvailableYear: function() {
			var oDataGot = new Promise(function(fnResolve, fnReject) {
				this.oDataModel.read("/YearhelpSet", {
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
		 * get Shipment Data
		 * 
		 * @private
		 */
		getShipmentData: function(aYear) {
			var oFilterArray = []
			var oYear = {};
			aYear.results.forEach(function(aValue, aIndex) {
				if (!oYear[aValue.Year]) {
					oYear[aValue.Year] = 1;
					var oFilter = new Filter("Year", FilterOperator.EQ, aValue.Year) 
					oFilterArray.push(oFilter);
				}
			}.bind(this));
			
			var oDataFilter = new Filter({
			    filters: oFilterArray,
			    and: false
			  });
			var oDataGot = new Promise(function(fnResolve, fnReject) {
				this.oDataModel.read("/Shipment_hfSet", {
					urlParameters: {
						"$select": "Month,Year,Period,Plnmg,Fplnmg"
					},
					filters: [oDataFilter],
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