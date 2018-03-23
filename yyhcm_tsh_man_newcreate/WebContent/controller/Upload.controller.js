sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";
	
	return Controller.extend("soreturn.controller.Upload", {
		
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		
		/**
		 * Called when the controller is instantiated. It sets up the constant and JSON Model.
		 * @public
		 */
		onInit : function(evt) {
			this.oConstant = {
					sTotal: "T",
					sWarning : "W",
					sSuccess : "S",
					sError : "E",
					sWarningText : "Warning",
					sSuccessText : "Success",
					sErrorText : "Error",
					sWarningIcon : "sap-icon://status-inactive",
					sSuccessIcon : "sap-icon://status-positive",
					sErrorIcon : "sap-icon://status-negative"
				}
			var oSummaryJSONModel = new JSONModel();
			var oMessageJSONModel = new JSONModel();
			this.getView().setModel(oSummaryJSONModel,"Summary");
			this.getView().setModel(oMessageJSONModel,"Message");
		},
		
		
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */
		
		/**
		 * Event handler for upload process is finished from backend server.
		 * Set the response to the screen
		 * @public
		 */
		onComplete: function(oControlEvent) {
			var sStatus = oControlEvent.getParameter("status");
			if (sStatus === 201) {
				var sResponseRaw = oControlEvent.getParameter("responseRaw");
				var oResponseRaw = JSON.parse(sResponseRaw);
				var oMessageList = JSON.parse(oResponseRaw.d.Message)
				
				this.getView().getModel("Message").setData(oMessageList,false);
				var oSummaryJSONModel = this.getView().getModel("Summary");
				oSummaryJSONModel.setData(oResponseRaw.d,false);
				oSummaryJSONModel.setProperty("/FileAddress",this.getView().byId("FileUploader").getValue());
				

				var oSelect = this.getView().byId("messageTablefilter");
				oSelect.setSelectedKey(this.oConstant.sTotal);
				var oItem = this.getView().byId("MessageTable").getBinding("rows");
				if (oItem) {
					oItem.filter([], "Application");
				}

				var oDialog = this.getView().byId("BusyDialog");
				oDialog.close();
			}
		},
		
		/**
		 * Event handler for Message Filter Event.
		 * @public
		 */
		onFilterMessage: function(oControlEvent) {
			var oSelect = oControlEvent.getSource();
			var sKey = oSelect.getSelectedKey();
			var oMessageTable = this.getView().byId("MessageTable");
			var aFilters = [];
			if (sKey !== this.oConstant.sTotal) {
				aFilters.push(new sap.ui.model.Filter("TYPE", sap.ui.model.FilterOperator.EQ, sKey));
			}
			
			var oItem = oMessageTable.getBinding("rows");
			if (oItem) {
				oItem.filter(aFilters, "Application");
			}
		},
		
		/**
		 * Event handler for Upload Event.
		 * @public
		 */
		onUpload: function(oControlEvent) {
//			this._setUploadVariant();
			this._setCSRFTOKEN();
		},

		/**
		 * Event handler for Expand Event.
		 * @public
		 */
		onExpand: function(oControlEvent) {
			var oPanel = oControlEvent.getSource();
			var oMessageTable = this.getView().byId("MessageTable");
			if (oPanel.getExpanded()) {
				oMessageTable.setVisibleRowCount(5);
				
			} else {
				oMessageTable.setVisibleRowCount(10);
			}
		},
		
		onNavBack: function(oEvent) {
			
			sap.ui.core.UIComponent.getRouterFor(this).navTo("master", {}, false);
		},
		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */
		
		/**
		 * Prepare Upload Variant and set to FileUploaderParameter 'slug'
		 * @private
		 */
		_setUploadVariant: function() {
			var oCompanyCode = this.getView().byId("CompanyCode");
			var oBUCode = this.getView().byId("BUCode");
			var oRevType = this.getView().byId("RevType");
			var oPeriod = this.getView().byId("Period");
			var oCompanyCodeVariant = [];
			var oBUCodeVariant = [];
			var oRevTypeVariant = [];
			var oPeriodVariant = [];
			
			oCompanyCodeVariant.push(this._makeRangeVariantObj("I",
															sap.ui.model.FilterOperator.EQ,
															oCompanyCode.getSelectedKey(),
															''));
			oBUCodeVariant.push(this._makeRangeVariantObj("I",
														sap.ui.model.FilterOperator.EQ,
														oBUCode.getSelectedKey(),
														''));
			oRevTypeVariant.push(this._makeRangeVariantObj("I",
														sap.ui.model.FilterOperator.EQ,
														oRevType.getSelectedKey(),
														''));
			oPeriodVariant.push(this._makeRangeVariantObj("I",
														sap.ui.model.FilterOperator.EQ,
														oPeriod.getSelectedButton().getText(),
														''));
			
			var oVariant = [];
			oVariant.push({
				NAME: 'CompanyCode',
				SELECTOPTION: oCompanyCodeVariant
			});
			oVariant.push({
				NAME: 'BUCode',
				SELECTOPTION: oBUCodeVariant
			});
			oVariant.push({
				NAME: 'RevType',
				SELECTOPTION: oRevTypeVariant
			});
			oVariant.push({
				NAME: 'Period',
				SELECTOPTION: oPeriodVariant
			});
			
			this.getView().byId("slug").setValue(JSON.stringify(oVariant));
		},
		
		/**
		 * Make the select option to Range type Object
		 * @param {string} aSign	the sign value of range table
		 * @param {string} aOption	the option value of range table
		 * @param {string} aLow		the low value of range table
		 * @param {string} aHigh	the high value of range table
		 * @private
		 */
		_makeRangeVariantObj: function(aSign, aOption, aLow, aHigh) {
			return {
				SIGN : aSign,
				OPTION : aOption,
				LOW : aLow,
				HIGH : aHigh,
			};
		},

		/**
		 * set x-csrf-token to FileUploaderParameter 'csrfToken'
		 * @private
		 */
		_setCSRFTOKEN: function() {
			var oDataModel = this.getView().getModel();
			oDataModel.setTokenHandlingEnabled(true);
			
			//Get Security Token
			var oPromise = new Promise(function(fnResolve) {
				oDataModel.refreshSecurityToken(function() {
					fnResolve()
				}.bind(this));
			})
			
			oPromise.then(function() {
				this.getView().byId("csrfToken").setValue(oDataModel.getSecurityToken());
				var oController = this.getView().byId("FileUploader");
				oController.upload();
				var oDialog = this.getView().byId("BusyDialog");
				oDialog.open();
			}.bind(this));
		},
		
		/* =========================================================== */
		/* begin: format methods                                     */
		/* =========================================================== */
		
		/**
		 * Format output the Date value
		 * @param {date} aDate	Date value
		 * @public
		 */
		ZFormatDateUTCOutput: function(aDate) {
			if (aDate) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "YYYY-MM-dd",UTC:true});
				return oDateFormat.format(new Date(parseInt(aDate.slice(6))));
			}
		},
		
		/**
		 * Format output the Time value
		 * @param {datetime} aTime	Time value
		 * @public
		 */
		ZFormatTimeOutput: function(aTime) {

			if (aTime) {
				var oTimeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "'PT'HH'H'mm'M'ss'S'"});
				var oTimeFormatTo = sap.ui.core.format.DateFormat.getDateTimeInstance({pattern: "HH:mm:ss"});

				return oTimeFormatTo.format(oTimeFormat.parse(aTime));
			}
		},
		
		/**
		 * Format Message Status
		 * @param {string} aStatus	Message Status
		 * @public
		 */		
		ZFormatMessageStatus : function(aStatus) {
			
			switch (aStatus) {
			case this.oConstant.sError:
				return sap.ui.core.ValueState.Error;
				break;
			case this.oConstant.sSuccess:
				return sap.ui.core.ValueState.Success;
				break;
			case this.oConstant.sWarning:
				return sap.ui.core.ValueState.Warning;
				break;
			default:
				return sap.ui.core.ValueState.None;
			}
		},
		
		/**
		 * Format Message Status Icon
		 * @param {string} aStatus	Message Status
		 * @public
		 */			
		ZFormatMessageIcon : function(aStatus) {
			switch (aStatus) {
			case this.oConstant.sError:
				return this.oConstant.sErrorIcon;
				break;
			case this.oConstant.sSuccess:
				return this.oConstant.sSuccessIcon;
				break;
			case this.oConstant.sWarning:
				return this.oConstant.sWarningIcon;
				break;
			default:
				return "";

			}
		},
		
		/**
		 * Format Message Status Text
		 * @param {string} aStatus	Message Status
		 * @public
		 */				
		ZFormatMessageText : function(aStatus) {
			switch (aStatus) {
			case this.oConstant.sError:
				return this.oConstant.sErrorText;
				break;
			case this.oConstant.sSuccess:
				return this.oConstant.sSuccessText;
				break;
			case this.oConstant.sWarning:
				return this.oConstant.sWarningText;
				break;
			default:
				return "";
			}
		},
		
		/**
		 * Format Result Counts
		 * @param {string} aCounts	Result Counts
		 * @public
		 */		
		ZFormatResultCounts : function(aCounts) {

			var oStringType = new sap.ui.model.odata.type.String(
					//oFormatOptions
					{
					},
					//oConstraints?
					{
						isDigitSequence: true
					});
			
			try {
				var sCount = oStringType.parseValue(aCounts, "string");
				if (sCount) {
					return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("ZRESULTCOUNTS", [sCount])
				}
			} catch(e) {
			}
		}
	});

});