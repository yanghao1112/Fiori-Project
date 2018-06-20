sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ZZZ01/ZFILEUPLOAD/js/sheet",
	"sap/ZZZ01/ZFILEUPLOAD/js/FileSaver",
	"sap/ZZZ01/ZFILEUPLOAD/js/csv"
], function(Controller, JSONModel, sheet, FileSaver, CSV222) {
	"use strict";
	
	return Controller.extend("sap.ZZZ01.ZFILEUPLOAD.controller.ZZmain", {
		
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
					sErrorIcon : "sap-icon://status-negative",
					sInitGUIID: "00000000-0000-0000-0000-000000000000"
				}
			var oSummaryJSONModel = new JSONModel();
			var oMessageJSONModel = new JSONModel();
			this.getView().setModel(oSummaryJSONModel,"Summary");
			this.getView().setModel(oMessageJSONModel,"Message");
			
			this._oViewModel = this._createViewModel();

			this.getView().setModel(this._oViewModel, "ViewModel");

			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
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
			var oDialog = this.getView().byId("BusyDialog");
			if (sStatus === 201) {
				var sResponseRaw = oControlEvent.getParameter("responseRaw");
				var oResponseRaw = JSON.parse(sResponseRaw);
				var oMessageList = JSON.parse(oResponseRaw.d.Message)
				
				//Set Return Data to Summary Model
				this.getView().getModel("Message").setData(oMessageList,false);
				var oSummaryJSONModel = this.getView().getModel("Summary");
				oSummaryJSONModel.setData(oResponseRaw.d,false);
				
				oSummaryJSONModel.setProperty("/FileAddress",this.getView().byId("FileUploader").getValue());
				
				//Set Return Message Data to Message Model
				var oSelect = this.getView().byId("messageTablefilter");
				oSelect.setSelectedKey(this.oConstant.sTotal);
				var oItem = this.getView().byId("MessageTable").getBinding("rows");
				if (oItem) {
					oItem.filter([], "Application");
				}
				

				if (oResponseRaw.d.GUIID !== this.oConstant.sInitGUIID) {

					this._toConfirmView();
				} else {
					this._showSuccessMessage(this.oBundle.getText("ZMSG001"),3000);
				}
				
				oDialog.close();
			} else {
				oDialog.close();
			}
		},
		
		/**
		 * Event handler for Cancel Button press Event.
		 * @public
		 */
		onCancel: function() {
			this._exitConfirmView();
		},
		
		/**
		 * Event handler for Cancel Button press Event.
		 * @public
		 */
		onSave: function() {
			this.getOwnerComponent().oDataManager.saveUploadData({
				GUIID:	this.getView().getModel("Summary").getProperty("/GUIID")
			}).then(function() {
				this._exitConfirmView();
				this._showSuccessMessage(this.oBundle.getText("ZMSG001"),3000);
			}.bind(this));
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
			this._setUploadVariant();
			var oPromise = this._setCSRFTOKEN();
			this._upload(oPromise);
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
			return oPromise;
		},


		/**
		 * upload File to Backend after CSRFToken is got
		 * @private
		 */
		_upload: function(aPromise) {
			aPromise.then(function() {
				var oDataModel = this.getView().getModel();
				this.getView().byId("csrfToken").setValue(oDataModel.getSecurityToken());
				var oController = this.getView().byId("FileUploader");
//				var reader = new FileReader();
//				reader.readAsBinaryString(oController.oFileUpload.files[0]);  
//                reader.onload = function(e){  
//                	    var data = e.target.result;
//                	    //if(!rABS) data = new Uint8Array(data);
//                	    var workbook = sheet.read(data, {type:'binary'});
//                	    var sheet1 = workbook.Sheets[workbook.SheetNames[0]];
//                	    var xxx = sheet.utils.sheet_to_csv(sheet1);
//                	    var xxx = sheet.utils.sheet_to_csv(sheet1,{raw:true,header:1});
//                	    
//                	    /* DO SOMETHING WITH workbook HERE */
//                }  
				var value = oController.getValue();
				if (value) {

					oController.upload();
					var oDialog = this.getView().byId("BusyDialog");
					oDialog.open();
				}
//			    var files = oController.oFileUpload.files[0];
//			    if( typeof(FileReader) !== 'undefined' ){    //H5
//			        var reader = new FileReader();
//			        reader.readAsText( files );            //以文本格式读取
//			        reader.onload = function(evt){
//			            var data = evt.target.result;        //读到的数据
//			            var x = CSV.parse(data)
//                console.log(data);
//                
//			        }
//			    }
			}.bind(this));
		},
		
		/**
		 * create a JSONModel for view configuration
		 * @private
		 */
		_createViewModel : function() {
			return new JSONModel({
				elementEnabled: true,
				confirmElementVisible: false,
				uploadButtonVisible: true
			});
		},
		
		/**
		 * confirm view configuration
		 * @private
		 */
		_toConfirmView : function() {
			this._oViewModel.setProperty("/elementEnabled", false);
			this._oViewModel.setProperty("/confirmElementVisible", true);
			this._oViewModel.setProperty("/uploadButtonVisible", false);
		},
		
		/**
		 * upload view configuration
		 * @private
		 */
		_exitConfirmView : function() {
			this._oViewModel.setProperty("/elementEnabled", true);
			this._oViewModel.setProperty("/confirmElementVisible", false);
			this._oViewModel.setProperty("/uploadButtonVisible", true);
		},
		
		/**
		 * show success message Toast
		 * @private
		 */
		_showSuccessMessage: function(aMessage, aDuration) {
			sap.m.MessageToast.show(aMessage, {
				animationDuration: aDuration
			});
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