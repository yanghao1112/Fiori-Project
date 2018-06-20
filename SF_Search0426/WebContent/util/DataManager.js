sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter"],
function(BaseObject, Filter, FilterOperator, Sorter) {
	"use strict";
	return BaseObject.extend("sap.pwaa.util.DataManager", {

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
			//$.get("demo_ajax_load.txt", function(result){

		},

		/**
		 * get Data by Request
		 * 'Get' Type
		 * @private
		 */
		getRequestByAjax: function(aUrl, aOptionData) {
			let oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();
				$.ajax({
					type: "GET",
					url: "proxy" + aUrl,
					data: aOptionData,
					dataType: "json",
					success: function(aData){
						if (aData["returnCode"] === "0") {

							fnResolve(aData["results"]);
						} else {

							fnReject({
								Error: aData,
								ErrorType: "1" //Backend Process
							});
						}
						this._hideBusy(true);
					}.bind(this),
					error: function(aError){
						fnReject({
							Error: aError,
							ErrorType: "0" //HTTP Request Error (500,404)
						});
						this._hideBusy(true);
					}.bind(this)
				});
			}.bind(this));
			return oDataGot;
		},
		

		/**
		 * Post Data by Request
		 * 'Post' Type
		 * @private
		 */
		postRequestByAjax: function(aUrl, aOptionData, aData) {
			let oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();
				$.ajax({
					type: "POST",
					url: "proxy" + aUrl,
					data: aData,
					dataType: "json",
					success: function(aData){
						if (aData["returnCode"] === "0") {

							fnResolve(aData["results"]);
						} else {

							fnReject(aData);
						}
						this._hideBusy(true);
					}.bind(this),
					error: function(aError){
						fnReject(aError);
						this._hideBusy(true);
					}.bind(this)
				});
			}.bind(this));
			return oDataGot;
		},

		/**
		 * Delete Data by Request
		 * 'Delete' Type
		 * @private
		 */
		deleteRequestByAjax: function(aUrl, aOptionData) {
			let oDataGot = new Promise(function(fnResolve, fnReject) {
				this._showBusy();
				$.ajax({
					type: "Delete",
					url: "proxy" + aUrl,
					data: aOptionData,
					dataType: "json",
					success: function(aData){
						if (aData["returnCode"] === "0") {

							fnResolve(aData["results"]);
						} else {

							fnReject(aData);
						}
						this._hideBusy(true);
					}.bind(this),
					error: function(aError){
						fnReject(aError);
						this._hideBusy(true);
					}.bind(this)
				});
			}.bind(this));
			return oDataGot;
		},
		/**
		 * get Data by Request
		 * 'Get' Type
		 * @private
		 */
		getClientInfoData:  function() {
			let sRequestUrl = "/pwaa/SABM001/search";
			let oGotPromise = this.getRequestByAjax(sRequestUrl, {P001:"0150",P002:"1019"})
			return oGotPromise;
		},
		getInitData:  function() {
			let sRequestUrl = "/pwaa/PWS001/init";
			let oOptionData = {};
			let oGotPromise = this.getRequestByAjax(sRequestUrl, oOptionData)
			return oGotPromise;
		},

		/**
		 * get Data
		 * 
		 * @private
		 */
		getClientInfoListData: function(aFilterOption) {

			let sRequestUrl = "/pwaa/SABM001/search";
			let oOptionData = {};
			[
				{key:"P001",	value:aFilterOption.Company},
				{key:"P002",	value:aFilterOption.Industry},
				{key:"P003",	value:aFilterOption.LCP},
				{key:"P004",	value:aFilterOption.ClientCode}
			].forEach(function(aCurrentValue, aIndex, aArr) {
				if (aCurrentValue.value) {
					oOptionData[aCurrentValue.key] = aCurrentValue.value
				}
			})
			
			let oGotPromise = this.getRequestByAjax(sRequestUrl, oOptionData)
			return oGotPromise;
		},

		/**
		 * get Data
		 * 
		 * @private
		 */
		getClientDetailData: function(aFilterOption) {

			let sRequestUrl = "/pwaa/PWS002/clientInfo";
			let oOptionData = {};
			[
				//{key:"Z_P001",	value:aFilterOption.Period},
				{key:"Z_P002",	value:aFilterOption.ClientCode},
				{key:"Z_P003",	value:aFilterOption.AnalysisGroupUnit},
				{key:"Z_P004",	value:aFilterOption.MemberAssigned}
			].forEach(function(aCurrentValue, aIndex, aArr) {
				if (aCurrentValue.value) {
					oOptionData[aCurrentValue.key] = aCurrentValue.value
				}
			});
			let oGotPromise = this.getRequestByAjax(sRequestUrl, oOptionData)
			return oGotPromise;
		},


		/**
		 * get Data
		 * 
		 * @private
		 */
		deleteFilebyID: function(aFileID) {
			
			if (aFileID) {
				let sRequestUrl = "/pwaa/PWS002/delete?FILE_ID=" + aFileID;
				let oGotPromise = this.deleteRequestByAjax(sRequestUrl, null)
				return oGotPromise;
			} else {
				return Promise.reject();
			}
		},
		
		saveCommentData: function(aData) {
			let sRequestUrl = "/pwaa/SABM00122222222/search";
			let oOptionData = {};
			let oPostPromise = this.postRequestByAjax(sRequestUrl, oOptionData, aData)
			return oPostPromise;
		},
		
		deleteCommentData: function(aData) {
			let sRequestUrl = "/pwaa/SABM00122222222/delete";
			let oOptionData = {};
			let oPostPromise = this.postRequestByAjax(sRequestUrl, oOptionData, aData)
			return oPostPromise;
		},

		/**
		 * get Data
		 * 
		 * @private
		 */
		getEngageDetailData: function(aEngageCode) {
			
			let sRequestUrl = "/pwaa/PWS006/engageInfo";
			let oOptionData = {};
			[
				{key:"Z_P009",	value:aEngageCode}
			].forEach(function(aCurrentValue, aIndex, aArr) {
				if (aCurrentValue.value) {
					oOptionData[aCurrentValue.key] = aCurrentValue.value
				}
			});
			let oGotPromise = this.getRequestByAjax(sRequestUrl, oOptionData)
			return oGotPromise;
		},
		
		/**
		 * get Data
		 * 
		 * @private
		 */
		getGroupDetailData: function(aFilterOption) {

//			var oDataGot = new Promise(function(fnResolve, fnReject) {
//				this._showBusy();
//				this.oDataModel.read("/GroupDetail", {
//					success: function(aData) {
//						this._hideBusy(true);
//						fnResolve(aData.results[0]);
//					}.bind(this),
//					error: function(aError) {
//						this._hideBusy(true);
//						fnReject(aError);
//					}.bind(this)
//				});
//			}.bind(this));
//			return oDataGot;
			
			//  sample: pwaa/PWS003/groupInfo?Z_P002=AAA1002746&Z_P003=0&Z_P004=0&Z_P007=JP50001899

//			{key:"Z_P002",	value:aFilterOption.ClientCode},
//			{key:"Z_P003",	value:aFilterOption.AnalysisGroupUnit},
//			{key:"Z_P004",	value:aFilterOption.MemberAssigned}
			
			let sRequestUrl = "/pwaa/PWS003/groupInfo";
			let oOptionData = {};
			[
//				{key:"Z_P001",	value:aFilterOption.ClientCode},
				{key:"Z_P002",	value:aFilterOption.ClientCode},
				{key:"Z_P003",	value:aFilterOption.AnalysisGroupUnit},
				{key:"Z_P004",	value:aFilterOption.MemberAssigned},
				{key:"Z_P005",	value:aFilterOption.GroupCode},
				{key:"Z_P006",	value:aFilterOption.GroupName},
				{key:"Z_P007",	value:aFilterOption.LEPCode},
				{key:"Z_P008",	value:aFilterOption.LEMCode},
				{key:"Z_P009",	value:aFilterOption.EngCode},
				{key:"Z_P010",	value:aFilterOption.ImpEventName}
			].forEach(function(aCurrentValue, aIndex, aArr) {
				if (aCurrentValue.value) {
					oOptionData[aCurrentValue.key] = aCurrentValue.value
				}
			});
			let oGotPromise = this.getRequestByAjax(sRequestUrl, oOptionData)
			return oGotPromise;
			
		},

		/**
		 * get Data
		 * 
		 * @private
		 */
		getTalentInfo: function(aTalentCode) {

//			var oDataGot = new Promise(function(fnResolve, fnReject) {
//				this._showBusy();
//
//				var oFilterArray = [];
//				[
//					{key:"aTalentCode",	value: aTalentCode}
//				].forEach(function(aCurrentValue, aIndex, aArr) {
//
//					var oFilter = new Filter(aCurrentValue.key, FilterOperator.Equal, aCurrentValue.value) 
//					oFilterArray.push(oFilter);
//				})
//				
//				this.oDataModel.read("/TalentInfo", {
////					filters: oFilterArray,
//					success: function(aData) {
//						this._hideBusy(true);
//						fnResolve(aData);
//					}.bind(this),
//					error: function(aError) {
//						this._hideBusy(true);
//						fnReject(aError);
//					}.bind(this)
//				});
//			}.bind(this));
//			return oDataGot;
			
			// sample: pwaa/PWS007/empInfo?Z_P011=JP50016437
			
			let sRequestUrl = "/pwaa/PWS007/empInfo";
			let oOptionData = {};
			[
				{key:"Z_P011",	value:aTalentCode}
			].forEach(function(aCurrentValue, aIndex, aArr) {
				if (aCurrentValue.value) {
					oOptionData[aCurrentValue.key] = aCurrentValue.value
				}
			});
			let oGotPromise = this.getRequestByAjax(sRequestUrl, oOptionData)
			return oGotPromise;
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