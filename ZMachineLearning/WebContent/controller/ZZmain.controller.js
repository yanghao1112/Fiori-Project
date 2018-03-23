sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
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
		onStart: function(oControlEvent) {
			//var oController = this.getView().byId("FileUploader");
			var x = 1;
		},
		onUpload: function(oControlEvent) {
//			//Create JSON Model with URL
//			var oModel = new sap.ui.model.json.JSONModel();
//
//			//API Key for API Sandbox
//			var sHeaders = {"Content-Type":"multipart/form-data","Accept":"application/json","APIKey":"odUFoo6mbv0DRdCt3wkLSZAmmw0oCZcW"}
//
//			//sending request
//			//API endpoint for API sandbox 
//			var oData = {
//				"files":"iVBORw0KGgoAAAANSUhEUgAAADIAAAAaCAYAAAD1wA/qAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MGFjMmVmMS00ZjcwLTc4NDMtOWIwZC03ZWIyZWMwMWZkYjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzU1RTc4RUEzNDA2MTFFNzk2RjRBMEU0MTVCNzA0NzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzU1RTc4RTkzNDA2MTFFNzk2RjRBMEU0MTVCNzA0NzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODBhYzJlZjEtNGY3MC03ODQzLTliMGQtN2ViMmVjMDFmZGI1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjgwYWMyZWYxLTRmNzAtNzg0My05YjBkLTdlYjJlYzAxZmRiNSIv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"
//				
//				};
//			oModel.setData(oData,true);
//			oModel.loadData("https://sandbox.api.sap.com/ml/imageclassifier/inference_sync", null, true, "POST", null, false, sHeaders);
//
//			//You can assign the created data model to a View and UI5 controls can be bound to it. Please refer documentation available at the below link for more information.
//			//https://sapui5.hana.ondemand.com/#docs/guide/96804e3315ff440aa0a50fd290805116.html#loio96804e3315ff440aa0a50fd290805116
//
//			//The below code snippet for printing on the console is for testing/demonstration purpose only. This must not be done in real UI5 applications.
//			oModel.attachRequestCompleted(function(oEvent){
//			    var oData = oEvent.getSource().oData;
//			    var sData = JSON.stringify(oData);
//			    console.log(sData);
//			});
			
			
			
			var data = {
					"request": {
					files	: "[{\"fileName\":\"image\",\"fileExt\":\"png\",\"Type\":\"FILE\",\"files\":\"iVBORw0KGgoAAAANSUhEUgAAADIAAAAaCAYAAAD1wA/qAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MGFjMmVmMS00ZjcwLTc4NDMtOWIwZC03ZWIyZWMwMWZkYjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzU1RTc4RUEzNDA2MTFFNzk2RjRBMEU0MTVCNzA0NzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzU1RTc4RTkzNDA2MTFFNzk2RjRBMEU0MTVCNzA0NzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODBhYzJlZjEtNGY3MC03ODQzLTliMGQtN2ViMmVjMDFmZGI1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjgwYWMyZWYxLTRmNzAtNzg0My05YjBkLTdlYjJlYzAxZmRiNSIv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\"}]",
			}};

			var xhr = new XMLHttpRequest();
			xhr.withCredentials = false;

			xhr.addEventListener("readystatechange", function () {
			  if (this.readyState === this.DONE) {
			    console.log(this.responseText);
			  }
			});

			//setting request method
			//API endpoint for API sandbox 
			xhr.open("POST", "https://sandbox.api.sap.com/ml/prodimgclassifier/inference_sync");

			//adding request headers
			xhr.setRequestHeader("Content-Type", "multipart/form-data");
			xhr.setRequestHeader("Accept", "application/json");
			//API Key for API Sandbox
			xhr.setRequestHeader("APIKey", "odUFoo6mbv0DRdCt3wkLSZAmmw0oCZcW");

			
			
			var data2 = {
			method: "POST",
			request	: [{"fileName":"image","fileExt":"png","Type":"FILE","files":"iVBORw0KGgoAAAANSUhEUgAAADIAAAAaCAYAAAD1wA/qAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MGFjMmVmMS00ZjcwLTc4NDMtOWIwZC03ZWIyZWMwMWZkYjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzU1RTc4RUEzNDA2MTFFNzk2RjRBMEU0MTVCNzA0NzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzU1RTc4RTkzNDA2MTFFNzk2RjRBMEU0MTVCNzA0NzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODBhYzJlZjEtNGY3MC03ODQzLTliMGQtN2ViMmVjMDFmZGI1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjgwYWMyZWYxLTRmNzAtNzg0My05YjBkLTdlYjJlYzAxZmRiNSIv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"}],
			toRequestHeaders:	[{name: "DataServiceVersion", value: "2.0"},
								{name: "APIKey", value: "odUFoo6mbv0DRdCt3wkLSZAmmw0oCZcW"},
								{name: "Content-Type", value: "multipart/form-data"},
								{name: "Accept", value: "application/json"}],
			url	:	"https://sandbox.api.sap.com/ml/imageclassifier/inference_sync",
			__metadata	:	{type: "HttpModel.WebClient"}
			}
				
			//sending request
			var formData  = new FormData();
			//formData.append("TYPE","FILE");
			formData.append("files", this.getView().byId("FileUploader").FUEl.files[0], this.getView().byId("FileUploader").FUEl.files[0].name);
			
			//formData.append("request","{\"fileName\":\"image\",\"fileExt\":\"png\",\"Type\":\"FILE\",\"files\":\"iVBORw0KGgoAAAANSUhEUgAAADIAAAAaCAYAAAD1wA/qAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MGFjMmVmMS00ZjcwLTc4NDMtOWIwZC03ZWIyZWMwMWZkYjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzU1RTc4RUEzNDA2MTFFNzk2RjRBMEU0MTVCNzA0NzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzU1RTc4RTkzNDA2MTFFNzk2RjRBMEU0MTVCNzA0NzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODBhYzJlZjEtNGY3MC03ODQzLTliMGQtN2ViMmVjMDFmZGI1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjgwYWMyZWYxLTRmNzAtNzg0My05YjBkLTdlYjJlYzAxZmRiNSIv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\"}")
			
//			xhr.send("files=iVBORw0KGgoAAAANSUhEUgAAADIAAAAaCAYAAAD1wA/qAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo4MGFjMmVmMS00ZjcwLTc4NDMtOWIwZC03ZWIyZWMwMWZkYjUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzU1RTc4RUEzNDA2MTFFNzk2RjRBMEU0MTVCNzA0NzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzU1RTc4RTkzNDA2MTFFNzk2RjRBMEU0MTVCNzA0NzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODBhYzJlZjEtNGY3MC03ODQzLTliMGQtN2ViMmVjMDFmZGI1IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjgwYWMyZWYxLTRmNzAtNzg0My05YjBkLTdlYjJlYzAxZmRiNSIv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");
			xhr.send(formData);
//			var oController = this.getView().byId("FileUploader");
//			oController.upload();
			
//			this._setUploadVariant();
//			this._setCSRFTOKEN();
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
															null));
			oBUCodeVariant.push(this._makeRangeVariantObj("I",
														sap.ui.model.FilterOperator.EQ,
														oBUCode.getSelectedKey(),
														null));
			oRevTypeVariant.push(this._makeRangeVariantObj("I",
														sap.ui.model.FilterOperator.EQ,
														oRevType.getSelectedKey(),
														null));
			oPeriodVariant.push(this._makeRangeVariantObj("I",
														sap.ui.model.FilterOperator.EQ,
														oPeriod.getSelectedButton().getText(),
														null));
			
			var oVariant = {
					CompanyCode : oCompanyCodeVariant,
					BUCode : oBUCodeVariant,
					RevType : oRevTypeVariant,
					Period : oPeriodVariant,
			}
			
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
				sign : aSign,
				option : aOption,
				low : aLow,
				high : aHigh,
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