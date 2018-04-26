sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/IconPool",
	"sap/ui/core/Popup",
	"sap/ui/layout/HorizontalLayout",
	"sap/ui/demo/wt/util/formatter",
	"sap/m/TabContainerItem"],
function(Controller, MessageToast, JSONModel, IconPool, Popup, HorizontalLayout , formatter, TabContainerItem) {
	"use strict";
	return Controller.extend("sap.ui.demo.wt.controller.ZZtop", {
		formatter: formatter,
		onInit : function() {
			"use strict";
			var oModel = new JSONModel(jQuery.sap
					.getModulePath("sap.ui.demo.wt.data",
							"/radarOptionTop.json"));
			this.getView().setModel(oModel, "radarOption");
			
			//When detail route matched
			let oComponent = this.getOwnerComponent();
			this._oDataManager = oComponent.oDataManager;
			this.getOwnerComponent().getRouter().getRoute("top").attachPatternMatched(this._onTopMatched, this);
			
			/* attach handlers for validation errors */
			sap.ui.getCore().attachValidationError(function (aEvent) {
				var oControl = aEvent.getParameter("element");
				var sMsg = aEvent.getParameter("message");
				if (oControl && oControl.setValueState) {
					oControl.setValueState("Error");
					oControl.setValueStateText(sMsg);
					oControl.focus();
				}
			});

			/* attach handlers for validation success */
			sap.ui.getCore().attachValidationSuccess(function (aEvent) {
				var oControl = aEvent.getParameter("element");
				if (oControl && oControl.setValueState) {
					oControl.setValueState("None");
				}
			});
            
            /* attach handlers for parse errors */
			sap.ui.getCore().attachParseError(function (aEvent) {
				var oControl = aEvent.getSource();
				var sMsg = aEvent.getParameter("message");
				if (oControl && oControl.setValueState) {
					oControl.setValueState("Error");
					oControl.setValueStateText(sMsg);
				}
			});
		},
		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */
		
		_onTopMatched : function (oEvent) {
			//When detail route matched
			this.sAnalysisOption = oEvent.getParameter("arguments").sAnalysisOption;
			this.sType		 = oEvent.getParameter("arguments").sType;
			this.sLCP		 = oEvent.getParameter("arguments").sLCP;
			this.sClientCode = oEvent.getParameter("arguments").sClientCode;
			
			//Get group data and set it to model
			this.oGroupDataGot =  this._oDataManager.getGroupListData(this.sAnalysisOption, this.sType, this.sLCP, this.sClientCode);
			this.oGroupDataGot.then(function(aData) {
				var oTab1Model = new JSONModel();
				var oTab2Model = new JSONModel();
				var oGroupRadarData = this._mergeGroupRadarData(aData.results);
				var oGroupData = this._mergeGroupData(aData.results);
				
				var oTab1Data = {};
				var oTab2Data = {};
				
				$.extend(true, oTab1Data, {
					group: oGroupData,
					groupRadar: oGroupRadarData.NASAGroupRadarData
				});
				$.extend(true, oTab2Data, {
					group: oGroupData,
					groupRadar: oGroupRadarData.FormalGroupRadarData
				});
				oTab1Model.setData(oTab1Data);
				oTab2Model.setData(oTab2Data);
//				oGroupRadarModel.setData(oGroupRadarData);
				this.getView().byId("idTab1").setModel(oTab1Model,"TabModel");
				this.getView().byId("idTab2").setModel(oTab2Model,"TabModel");
			}.bind(this));
			
			this.oClientDataGot =  this._oDataManager.getClientSummaryData(this.sAnalysisOption, this.sType, this.sLCP, this.sClientCode);
			this.oClientDataGot.then(function(aData) {
				var oClientModel = new JSONModel();
				// Need to modify
				oClientModel.setData(aData.results[0]);
				this.getView().setModel(oClientModel,"Client");
			}.bind(this));
		},
		
		_mergeGroupData: function(aData) {
			$.each(aData, function(aIdx, aItem){
				$.extend(aItem, {
					"NewCreate": false
				});
			});
			
			//for create new group
			aData.push({
				"NewCreate" : true,
				"GroupName" : "",
				"Members" : [
				],
				"NASAFlag" : false
			});
			return aData;
		},
		
		_mergeGroupRadarData: function(aData) {
			var oNASAGroupRadarData = [];
			var oFormalGroupRadarData = [];
			$.each(aData, function(aIdx, aItem){
				if (aItem["NASAFlag"]) {
					oNASAGroupRadarData.push(aItem["AnalysisData"]);
				}
				oFormalGroupRadarData.push(aItem["AnalysisData"]);
			});
			
			return {
				"NASAGroupRadarData": oNASAGroupRadarData,
				"FormalGroupRadarData": oFormalGroupRadarData
			}
			
		},
		onAfterRendering : function(){
			"use strict";
			var oSecondTab = this.getView().byId("GroupTabContainer").getItems()[1];
			this.getView().byId("GroupTabContainer").setSelectedItem(oSecondTab);
			
		},

		/* Event handling for clicking 'Project Card' */
		onPressGroup: function(aControlEvent) {
			"use strict";
			var oData = aControlEvent.getSource().getBindingContext("TabModel").getObject();
			oData["Members"].forEach(function(aItem, aIndex, aList) {
				if(this.sType === aItem.Type || aItem.Type === "All" ) {
					this.sLEPM = aItem.Code;
					return true;
				}
			}.bind(this));

			
			this.getOwnerComponent().getRouter().navTo("detail", {
				sAnalysisOption: this.sAnalysisOption,
				sType          : this.sType,
				sLCP           : this.sLCP,
				sClientCode    : this.sClientCode,
				sLEPM          : this.sLEPM
			},false);
						
		},
		
		/* Event handling for clicking button 'Add New Tab' */
		onAddNewTab : function(aControlEvent){
			"use strict";
			var oModel = new JSONModel();
			oModel.setData({
				TabName: ""
			})
			/* initialize filter settings dialog for once */
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(
						"sap.ui.demo.wt.view.ZZConfirmNewTab", this);
			}
			
			let oI18n = this.getOwnerComponent().getModel("i18n");
			this.oDialog.setModel(oI18n,"i18n");
			this.oDialog.setModel(oModel,"TabModel");
			this.oDialog.open();
		},	
		
		/* Event handling for clicking card 'New Group' */
		onAddNewGroup: function(aControlEvent) {
			"use strict";
			/* initialize filter settings dialog for once */
			if (!this.oGroupDialog) {
				this.oGroupDialog = sap.ui.xmlfragment(
						"sap.ui.demo.wt.view.ZZConfirmNewGroup", this);
			}
			
			let oI18n = this.getOwnerComponent().getModel("i18n");
			this.oGroupDialog.setModel(oI18n,"i18n");
			this.oGroupDialog.setModel(this.getOwnerComponent().getModel("UserList"), "UserList");
			this.oGroupDialog.setModel(aControlEvent.getSource().getModel("TabModel"),"TabModel");
			
			
			this.oGroupDialog.open();
		},
		
		/* Event handling for clicking button 'Cancel' on Popup dialog */
		onCancel: function(aControlEvent) {
			"use strict";
			var oDialog = aControlEvent.getSource().getParent();
			oDialog.close();
		},
		
		onNewGroupSave: function(aControlEvent) {
			// Check input
			
			//Get Employee Data
			var oDialog = aControlEvent.getSource().getParent();
			var oCore = sap.ui.getCore();
			var oLEP = oCore.byId("LEPInput");
			var oLEM = oCore.byId("LEMInput");
			
			var oTabModelData = oDialog.getModel("TabModel").getData();
			var oNewGroupData = {};
			
			//Copy Data from NASA Tab
			$.extend(true, oNewGroupData, oTabModelData)
			
			oNewGroupData["group"].splice(oNewGroupData["group"].length - 1, 0, {
				"GroupName": "AB Mike Gr. 333",
				"Members": [
					{
						"Code": "112233",
						"Image": "../image/M3.jpg",
						"Type": "LEP"
					},
					{
						"Code": "112233",
						"Image": "../image/M2.jpg",
						"Type": "LEM"
					}
				],
				"NASAFlag": false,
				"NewCreate": false
			})
			
			oDialog.getModel("TabModel").setData(oNewGroupData);
			//Calculate Radar Data
			
			

			oDialog.close();
		},
		
		/* Event handling for clicking button 'Save' on Popup dialog */
		onNewTabSave: function(aControlEvent) {
			"use strict";
			var oDialog = aControlEvent.getSource().getParent();
			var oTabName = oDialog.getModel("TabModel").getProperty("/TabName");
			
			this.addTab(oTabName);

			oDialog.close();
		},
		addTab : function(aTabName) {
			"use strict";
			var oNewTab = this._createEngagementTab();
			
			var tabContainer = this.getView().byId("GroupTabContainer");

			tabContainer.addItem(
					oNewTab
			);
			tabContainer.setSelectedItem(
					oNewTab
			);
			var oNewTabModel = new JSONModel();

			var oGroupData = this.getView().byId("idTab1").getModel("TabModel").getData();
			var oNewGroupData = {};
			
			//Copy Data from NASA Tab
			$.extend(true, oNewGroupData, oGroupData)
			oNewTabModel.setData({
				TabName: aTabName,
				modified: true,
				group: oNewGroupData.group,
				groupRadar: oNewGroupData.groupRadar
			})
			oNewTab.setModel(this.getView().getModel("radarOption"),"radarOption");
			oNewTab.setModel(oNewTabModel,"TabModel");
		},
		
		/*
		 * Create Form to input Timesheet information
		 */
		_createEngagementTab : function() {
			"use strict";
			var oTabContainerIteContent = sap.ui.xmlfragment("sap.ui.demo.wt.view.ZZTab",
					this);
			return oTabContainerIteContent;
		},
		suggestionItemSelected : function(aControlEvent) {
			"use strict";
			var source = aControlEvent.getSource();
			var row = aControlEvent.getParameter("selectedRow");
			var data = row.getCustomData()[0].getValue();
			source.addToken(new sap.m.Token({
				key : data["Code"],
				text : data["Name"] + "(" + data["Code"] + ")"
			}))
			source.setShowSuggestion(false);

		},
		tokenUpdate : function(aControlEvent) {
			if (aControlEvent.getParameter("removedTokens").length > 0) {
				aControlEvent.getSource().setShowSuggestion(true);
			}
			;
		},
		changewwww : function(aControlEvent) {
			var oSource = aControlEvent.getSource();
			if (oSource.getTokens().length > 0) {
				oSource.setValue("");
			} else {
				var oClientData = this.getView().getModel("UserList").getData();
				var sValue = oSource.getValue();
				for (var i = 0; i < oClientData["UserList"].length; i++) {
					if (oClientData["UserList"][i]["Code"].indexOf(sValue) > -1) {

						oSource.addToken(new Token({
							key : oClientData["UserList"][i]["Code"],
							text : oClientData["UserList"][i]["Name"] + "("
									+ oClientData["UserList"][i]["Code"] + ")"
						}))
						oSource.setShowSuggestion(false);
						break;
					}
				}
				oSource.setShowSuggestion(true);
				oSource.setValue("");
			}
		},

		/* Event handling for clicking 'Back' on navigator */
		onNavPress : function(aControlEvent){
			"use strict";
			window.history.go(-1);
		},
		onPressFilter: function(aControlEvent) {
			if (! this._oFilterDialog) {
				this._oFilterDialog = sap.ui.xmlfragment("sap.ui.demo.wt.view.ZZFilter", this);
			}
 

			let oI18n = this.getOwnerComponent().getModel("i18n");
			this._oFilterDialog.setModel(oI18n,"i18n");
			this._oFilterDialog.open();
		},
		onPressUpload: function(aControlEvent) {
			if (! this._oUploadDialog) {
				this._oUploadDialog = sap.ui.xmlfragment("sap.ui.demo.wt.view.ZZUpload", this);
			}
 
			let oI18n = this.getOwnerComponent().getModel("i18n");
			this._oUploadDialog.setModel(oI18n,"i18n");
			this._oUploadDialog.open();
		}
	});
});
