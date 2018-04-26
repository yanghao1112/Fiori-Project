sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/IconPool",
	"sap/ui/core/Popup",
	"sap/ui/demo/wt/util/formatter"],
function(Controller, MessageToast, JSONModel, IconPool, Popup, formatter) {
	"use strict";
	return Controller.extend("sap.ui.demo.wt.controller.ZZdetail", {
		formatter: formatter,
		onInit : function() {
			"use strict";
			var oDetailSkillModel = new JSONModel(jQuery.sap
					.getModulePath("sap.ui.demo.wt.data",
							"/radarOptionDetailSkill.json"));
			this.getView().setModel(oDetailSkillModel, "radarOptionDetailSkill");

			var oDetailQRMModel = new JSONModel(jQuery.sap
					.getModulePath("sap.ui.demo.wt.data",
							"/radarOptionDetailQRM.json"));
			this.getView().setModel(oDetailQRMModel, "radarOptionDetailQRM");
			

			var oDetailQRMModel = new JSONModel(jQuery.sap
					.getModulePath("sap.ui.demo.wt.data",
							"/dual_lineOptionPersonCard.json"));
			this.getView().setModel(oDetailQRMModel, "dual_lineOptionPersonCard");


			var oDetailQRMModel = new JSONModel(jQuery.sap
					.getModulePath("sap.ui.demo.wt.data",
							"/radarOptionPersonCard.json"));
			this.getView().setModel(oDetailQRMModel, "radarOptionPersonCard");
			
			
			//When detail route matched
			let oComponent = this.getOwnerComponent();
			this._oDataManager = oComponent.oDataManager;
			this.getOwnerComponent().getRouter().getRoute("detail").attachPatternMatched(this._onDetailMatched, this);
			
			
			this._oPopup = [];
			/*this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();*/
			
			var oVizFrame = this.getView().byId("idVizFrame")
			oVizFrame.setVizProperties({
				legend: {
				    title: {
				        visible: false
				    }
				},
				title: {
				    visible: false,
				},
				legendGroup: {
	                layout: {
	                      position: "right"
	                }
	           },
	           plotArea: {
                   dataLabel: {
                         visible: true
                   }
              }
			});
//			var oPieChartModel = this.getOwnerComponent().getModel("pieChartData");
//			oVizFrame.setModel(oPieChartModel);
//			this._oPopup = [];
		},
		_onDetailMatched: function(oEvent) {

			//When detail route matched
			this.sAnalysisOption = oEvent.getParameter("arguments").sAnalysisOption;
			this.sType		 = oEvent.getParameter("arguments").sType;
			this.sLCP		 = oEvent.getParameter("arguments").sLCP;
			this.sClientCode = oEvent.getParameter("arguments").sClientCode;
			this.sLEPM		 = oEvent.getParameter("arguments").sLEPM;
			
			//Get Group Data
			this.oGroupDataGot = this._oDataManager.getGroupData(this.sAnalysisOption, this.sType, this.sLCP, this.sClientCode, this.sLEPM);
			this.oGroupDataGot.then(function(aData) {

				var oGroupModel = new JSONModel();
				var oGroupRadarData = this._mergeGroupRadarData(aData.results[0]["Members"]);
				var oGroupDetailData = {};
				$.extend(true, oGroupDetailData, {
					group:		aData.results[0],
					groupRadar:	oGroupRadarData
				});
				oGroupModel.setData(oGroupDetailData);
				
				this.getView().setModel(oGroupModel,"Group");
			}.bind(this));
			
			//Get Engagement Data
			this.oEngageDataGot = this._oDataManager.getEngageData(this.sAnalysisOption, this.sType, this.sLCP, this.sClientCode, this.sLEPM);
			this.oEngageDataGot.then(function(aData) {

				var oEngageModel = new JSONModel();
				oEngageModel.setData(aData.results);
				
				this.getView().setModel(oEngageModel,"Engage");
			}.bind(this));
			
			//Get AssignBalance Data
			this.oAssignListGot = this._oDataManager.getAssignList(this.sAnalysisOption, this.sType, this.sLCP, this.sClientCode, this.sLEPM);
			this.oAssignListGot.then(function(aData) {

				var oAssignListModel = new JSONModel();
				oAssignListModel.setData(aData.results);
				
				this.getView().setModel(oAssignListModel,"AssignList");
			}.bind(this));
			

			//Get QRM Data
			this.oQRMGot = this._oDataManager.getQRM(this.sAnalysisOption, this.sType, this.sLCP, this.sClientCode, this.sLEPM);
			this.oQRMGot.then(function(aData) {

				var oQRMModel = new JSONModel();
				oQRMModel.setData(aData.results);
				
				this.getView().setModel(oQRMModel,"QRM");
			}.bind(this));
		},
		_mergeGroupRadarData: function(aData) {
			var oGroupRadarData = [];
			$.each(aData, function(aIdx, aItem){
				oGroupRadarData.push(aItem["SkillData"]);
			});
			
			return oGroupRadarData;
			
		},
		
		/* Event handling for clicking 'Back' on navigator */
		onNavPress : function(aControlEvent){
			"use strict";
			window.history.go(-1);
		},
		
		/* Event handling for clicking 'Remove'*/
		onRemove : function(aControlEvent){
			"use strict";
			var sPath = aControlEvent.getSource().getBindingContext("Group").getPath();
			var iIndex = sPath.lastIndexOf("/");
			var iArrayIndex = sPath.substring(iIndex + 1,sPath.length);
			var oGroupData = this.getView().getModel("Group").getData();
			var oNewGroupData = {};
			
			//Copy Data from NASA Tab
			$.extend(true, oNewGroupData, oGroupData)
			oNewGroupData["group"]["Members"].splice(iArrayIndex,1);
			oNewGroupData["groupRadar"].splice(iArrayIndex,1);
			
			this.getView().getModel("Group").setData(oNewGroupData);
			
//			this.getView().getModel("Group").updateBindings(true);
		},
		
		/* Event handling for clicking 'Add'*/
		onAddNewTalent : function(aControlEvent){
			"use strict";
			
			/* initialize filter settings dialog for once */
			if (!this.oNewTalentDialog) {
				this.oNewTalentDialog = sap.ui.xmlfragment(
						"sap.ui.demo.wt.view.ZZConfirmNewTalent", this);
			}

			let oI18n = this.getOwnerComponent().getModel("i18n");
			this.oNewTalentDialog.setModel(oI18n,"i18n");
			this.oNewTalentDialog.setModel(this.getOwnerComponent().getModel("UserList"), "UserList");

			this.oNewTalentDialog.open();
			
			this.getView().getModel().updateBindings(true);
		},

		/* Event handling for clicking button 'Save' on Popup dialog */
		onNewTalentSave: function(aControlEvent) {
			"use strict";
			var oDialog = aControlEvent.getSource().getParent();
			var oCore = sap.ui.getCore();
			var oTalent = oCore.byId("TalentInput");
			var oGroupData = this.getView().getModel("Group").getData();
			var oNewGroupData = {};
			
			//Copy Data from NASA Tab
			$.extend(true, oNewGroupData, oGroupData)
			
			oNewGroupData["group"]["Members"].push(
				{
					"Image": "../image/M5.jpg",
					"Name": "ABC",
					"Code": "123456789",
					"Type": null
				}
			);
			
			oNewGroupData["groupRadar"].push({

				"classText": "ABeam Taroasxx",
				"classColor": "#002088",
				"axes": [
					{
						"axis": "L統合的スギル",
						"value": 3
					},
					{
						"axis": "L対クライアント能力",
						"value": 3
					},
					{
						"axis": "L行動特性",
						"value": 2
					},
					{
						"axis": "L基本的な能力",
						"value": 1
					}
				]
			})
			this.getView().getModel("Group").setData(oNewGroupData);

			oDialog.close();
		},
		/* Event handling for clicking button 'Cancel' on Popup dialog */
		onCancel: function(aControlEvent) {
			"use strict";
			var oDialog = aControlEvent.getSource().getParent();
			oDialog.close();
		},
		
		/* Event handling for clicking 'Reset'*/
		onReset : function(aControlEvent){
			"use strict";
			var oGroupData = this.getView().getModel("Group").getData();
			
			var oNewGroupData = {
					group: {
						GroupName: oGroupData.group.GroupName,
						Members: []
					},
					groupRadar: []
			};

			$.each(oGroupData["group"]["Members"], function(aIdx, aItem){
				if (aItem["Type"] != null) {
					oNewGroupData["group"]["Members"].push(aItem);
					oNewGroupData["groupRadar"].push(aItem["SkillData"]);
					
				}
			});

			this.getView().getModel("Group").setData(oNewGroupData);
			
		},
		
		/* Event handling for clicking image */
		onPressImage: function(aControlEvent){
			"use strict";
			var oImage = aControlEvent.getSource();
			var oData = oImage.getBindingContext("Group").getObject();
			

			//Get Engagement Data
			this.oTalentInfoGot = this._oDataManager.getTalentInfo(oData["Code"]);
			this.oTalentInfoGot.then(function(aData) {

				var oTalentInfoModel = new JSONModel();
				oTalentInfoModel.setData(aData.results[0]);
				this._openPopup(oTalentInfoModel, oImage);
			}.bind(this));
		},
		
		
		_openPopup: function(aTalentInfoModel, aImage) {
			if(this._oPopup.length <= 2) {
				var oPopup = new Popup();
				this._oPopup.push(oPopup);
				var _oDialogPop = sap.ui.xmlfragment(
						"sap.ui.demo.wt.view.ZZPersonCardPopup", this);
			} else {
				return;
			}
			var dual_lineOptionPersonCard = this.getView().getModel("dual_lineOptionPersonCard").getData();
			var dual_lineOptionPersonCardCopy = {};
			$.extend(true, dual_lineOptionPersonCardCopy, dual_lineOptionPersonCard);
			
			var radarOptionPersonCard = this.getView().getModel("radarOptionPersonCard").getData();
			var radarOptionPersonCardCopy = {};
			$.extend(true, radarOptionPersonCardCopy, radarOptionPersonCard);
			
			aTalentInfoModel.setProperty("/dual_lineOptionPersonCard", dual_lineOptionPersonCardCopy);
			aTalentInfoModel.setProperty("/radarOptionPersonCard", radarOptionPersonCardCopy);
			
			_oDialogPop.setModel(aTalentInfoModel);
			oPopup.setContent(_oDialogPop);
			
			oPopup.attachEventOnce("opened", function(){
				var oHeaderGrid = _oDialogPop.getAggregation("items")[0].getAggregation("fixContent")[0].getAggregation("content")[1].getAggregation("content")[0];
				var oHeaderGridDom = oHeaderGrid.getDomRef();
				oHeaderGridDom.onmousedown = function(ev){
					var distanceX = ev.clientX - this._oPopup[0].getContent().getDomRef().offsetLeft;

					document.onmousemove = function(ev){

						this._oPopup.forEach(function(value,index) {
							this._oPopup[index].getContent().getDomRef().style.left = ev.clientX - distanceX + index * 400  + 'px';
						}.bind(this));
						
					}.bind(this);
					document.onmouseup = function(){
						document.onmousemove = null;
						document.onmouseup = null;
					};
				}.bind(this);
			}.bind(this));

//			}
			
			var oDock = Popup.Dock;
			var sAt = oDock.RightCenter; 
			if (oPopup.isOpen()) {
				return;
			} else {
				oPopup.open(100);
			}
			
			if (this._oPopup.length > 1) {
				var start;
				this._oPopup.forEach(function(value,index) {
					if (index === 0) {
						start = this._oPopup[index].getContent().getDomRef().offsetLeft
					}
					this._oPopup[index].getContent().getDomRef().style.left = start + index * 400 + "px"
				}.bind(this));
			}
		},
		
		/* Event handling for clicking 'Close' on Popup Dialog */
		onDecline: function(aControlEvent) {
			"use strict";
			var oIcon = aControlEvent.getSource();
			var oDialog = oIcon.getParent().getParent().getParent();
			var sDialogId = oDialog.getId();
			var iIndex;
			this._oPopup.forEach(function(oPopup,index) {
				if (oPopup.getContent().getId() === sDialogId) {
					iIndex = index;
					return;
				}
			}.bind(this));
			
			var oClose = this._oPopup.splice(iIndex,1);
			this._removePopupTransition(iIndex === 0 ? oClose[0].getContent().getDomRef().offsetLeft : this._oPopup[0].getContent().getDomRef().offsetLeft);
			oClose[0].close();
			oClose[0].destroy();
		},
		_removePopupTransition: function(aStart) {
			"use strict";
			this._oPopup.forEach(function(value,index) {
				this._leftTransition(this._oPopup[index].getContent());
				this._oPopup[index].getContent().getDomRef().style.left = aStart + index * 400 + "px"
			}.bind(this));
		},
		_leftTransition: function(aControl) {
			var oPopup = aControl;
			var fAfterTransition = function () {
				jQuery(this).unbind("webkitTransitionEnd transitionend");
				oPopup.removeStyleClass("ZLeftTransition");
			};
			oPopup.$().bind("webkitTransitionEnd transitionend", fAfterTransition);
			oPopup.addStyleClass("ZLeftTransition");
		},
	});
});
