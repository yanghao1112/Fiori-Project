sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter"],
function(BaseObject, Filter, FilterOperator, Sorter) {
	"use strict";
	return BaseObject.extend("sap.ui.demo.wt.util.DataManager", {

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
		getClientListData: function() {

			var oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();
				this.oDataModel.read("/ZClientList", {
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
		getClientInfoListData: function(aFilterOption) {

			var oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();

				var oFilterArray = [];
				[
					{key:"zbukrs",	value:aFilterOption.ClientCode},
					{key:"zbu",		value:aFilterOption.ClientName},
					{key:"zyear",	value:aFilterOption.LCP},
					{key:"zbu",		value:aFilterOption.Company},
					{key:"zyear",	value:aFilterOption.BU},
					{key:"AnalysisOption",	value:aFilterOption.AnalysisOption}
				].forEach(function(aCurrentValue, aIndex, aArr) {

					var oFilter = new Filter(aCurrentValue.key, FilterOperator.Contains, aCurrentValue.value) 
					oFilterArray.push(oFilter);
				})
				
				this.oDataModel.read("/ClientInfoList", {
//					filters: oFilterArray,
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
		getGroupListData: function(aAnalysisOption, aType, aLCP, aClientCode) {

			var oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();

				var oFilterArray = [];
				[
					{key:"aAnalysisOption",	value: aAnalysisOption},
					{key:"aType",		value: aType},
					{key:"aLCP",	value: aLCP},
					{key:"aClientCode",	value: aClientCode}
				].forEach(function(aCurrentValue, aIndex, aArr) {

					var oFilter = new Filter(aCurrentValue.key, FilterOperator.Equal, aCurrentValue.value) 
					oFilterArray.push(oFilter);
				})
				
				this.oDataModel.read("/GroupList", {
//					filters: oFilterArray,
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
		getClientSummaryData: function(aAnalysisOption, aType, aLCP, aClientCode) {

			var oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();

				var oFilterArray = [];
				[
					{key:"aAnalysisOption",	value: aAnalysisOption},
					{key:"aType",		value: aType},
					{key:"aLCP",	value: aLCP},
					{key:"aClientCode",	value: aClientCode}
				].forEach(function(aCurrentValue, aIndex, aArr) {

					var oFilter = new Filter(aCurrentValue.key, FilterOperator.Equal, aCurrentValue.value) 
					oFilterArray.push(oFilter);
				})
				
				this.oDataModel.read("/ClientSummary", {
//					filters: oFilterArray,
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
		
		getUserListData:  function() {

			var oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();
				
				this.oDataModel.read("/UserList", {
//					filters: oFilterArray,
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
		getGroupData: function(aAnalysisOption, aType, aLCP, aClientCode, aLEPM) {

			var oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();

				var oFilterArray = [];
				[
					{key:"aAnalysisOption",	value: aAnalysisOption},
					{key:"aType",		value: aType},
					{key:"aLCP",	value: aLCP},
					{key:"aClientCode",	value: aClientCode},
					{key:"aLEPM",	value: aLEPM}
				].forEach(function(aCurrentValue, aIndex, aArr) {

					var oFilter = new Filter(aCurrentValue.key, FilterOperator.Equal, aCurrentValue.value) 
					oFilterArray.push(oFilter);
				})
				
				this.oDataModel.read("/Group", {
//					filters: oFilterArray,
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
		getEngageData: function(aAnalysisOption, aType, aLCP, aClientCode, aLEPM) {

			var oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();

				var oFilterArray = [];
				[
					{key:"aAnalysisOption",	value: aAnalysisOption},
					{key:"aType",		value: aType},
					{key:"aLCP",	value: aLCP},
					{key:"aClientCode",	value: aClientCode},
					{key:"aLEPM",	value: aLEPM}
				].forEach(function(aCurrentValue, aIndex, aArr) {

					var oFilter = new Filter(aCurrentValue.key, FilterOperator.Equal, aCurrentValue.value) 
					oFilterArray.push(oFilter);
				})
				
				this.oDataModel.read("/EngagementListData", {
//					filters: oFilterArray,
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
		getAssignList: function(aAnalysisOption, aType, aLCP, aClientCode, aLEPM) {

			var oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();

				var oFilterArray = [];
				[
					{key:"aAnalysisOption",	value: aAnalysisOption},
					{key:"aType",		value: aType},
					{key:"aLCP",	value: aLCP},
					{key:"aClientCode",	value: aClientCode},
					{key:"aLEPM",	value: aLEPM}
				].forEach(function(aCurrentValue, aIndex, aArr) {

					var oFilter = new Filter(aCurrentValue.key, FilterOperator.Equal, aCurrentValue.value) 
					oFilterArray.push(oFilter);
				})
				
				this.oDataModel.read("/AssignList", {
//					filters: oFilterArray,
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
		getTalentInfo: function(aTalentCode) {

			var oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();

				var oFilterArray = [];
				[
					{key:"aTalentCode",	value: aTalentCode}
				].forEach(function(aCurrentValue, aIndex, aArr) {

					var oFilter = new Filter(aCurrentValue.key, FilterOperator.Equal, aCurrentValue.value) 
					oFilterArray.push(oFilter);
				})
				
				this.oDataModel.read("/TalentInfo", {
//					filters: oFilterArray,
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
		getQRM: function(aAnalysisOption, aType, aLCP, aClientCode, aLEPM) {

			var oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();

				var oFilterArray = [];
				[
					{key:"aAnalysisOption",	value: aAnalysisOption},
					{key:"aType",		value: aType},
					{key:"aLCP",	value: aLCP},
					{key:"aClientCode",	value: aClientCode},
					{key:"aLEPM",	value: aLEPM}
				].forEach(function(aCurrentValue, aIndex, aArr) {

					var oFilter = new Filter(aCurrentValue.key, FilterOperator.Equal, aCurrentValue.value) 
					oFilterArray.push(oFilter);
				})
				
				this.oDataModel.read("/QRM", {
//					filters: oFilterArray,
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