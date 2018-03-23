sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/IconPool",
	"sap/ui/core/Popup",
	"sap/ui/layout/HorizontalLayout",
	"sap/m/Dialog",
	"sap/m/Label",
	"sap/m/Input",
	"sap/ui/demo/wt/util/formatter"],
function(Controller, MessageToast, JSONModel, IconPool, Popup, HorizontalLayout ,Dialog, Label, Input, formatter) {
	"use strict";
	return Controller.extend("sap.ui.demo.wt.controller.ZZmain", {
		formatter: formatter,
		onInit : function() {

			var oModel = new sap.ui.model.json.JSONModel(jQuery.sap
					.getModulePath("sap.ui.demo.wt.data",
							"/Project.json"));
			this.getView().setModel(oModel);
			this._oPopup = [];
		},
		onAfterRendering : function(){
			
			var oSecondTab = this.getView().byId("myTabContainer").getItems()[1];
			this.getView().byId("myTabContainer").setSelectedItem(oSecondTab);
			
		},
		onShowHello : function() {
			
			if (!this._oDialogRestType) {
			this._oDialogRestType = sap.ui.xmlfragment(
					"sap.ui.demo.wt.view.PersonCard", this);
			this._oDialogRestType.setModel(this.getView().getModel());
			this._oDialogRestType.setModel(this.getView().getModel("list"),"list");
			this._oDialogRestType.setModel(this.getView().getModel("radarData"),"radarData");
			this._oDialogRestType.setModel(this.getView().getModel("radarOption"),"radarOption");
		}
//			 toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(),
					this._oDialogRestType);
			this._oDialogRestType.open();
		},

		onDecline: function(aControlEvent) {
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
			this.reMovePopup(oClose[0].getContent().getDomRef().offsetLeft);
			oClose[0].close();
			oClose[0].destroy();
		},
		reMovePopup: function(aStart) {
			
			this._oPopup.forEach(function(value,index) {
				this.leftTransition(this._oPopup[index].getContent());
				this._oPopup[index].getContent().getDomRef().style.left = aStart + index * 400 + "px"
			}.bind(this));
		},
		leftTransition: function(aControl) {
			
			aControl.addStyleClass("ZLeftTransition");
			
			// iPhone needs some time... there is no animation without waiting
			window.setTimeout(function () {
				
				fAfterTransition = function () {
					jQuery(this).unbind("webkitTransitionEnd transitionend");
					aControl.removeStyleClass("ZLeftTransition");
				};
				aControl.$().bind("webkitTransitionEnd transitionend", fAfterTransition);
			}, 60); 
		},
		handleClick: function(aControlEvent) {
			
			this.getOwnerComponent().getRouter().navTo("projectInfo", {}, false);
						
		},
		addNewButtonPressHandler : function(aControlEvent){
			
			var oModel = new sap.ui.model.json.JSONModel(jQuery.sap
					.getModulePath("sap.ui.demo.wt.data",
							"/data1.json"));
			
			var dialog = sap.ui.xmlfragment(
					"sap.ui.demo.wt.view.ConfirmPopup", this);
			
			dialog.bindObject({
				path : "/popupData/0" 
			});
			
			dialog.setModel(oModel);
			
			dialog.open();
		},	
		
		handleClickNew: function(aControlEvent) {
			
			var oModel = new sap.ui.model.json.JSONModel(jQuery.sap
					.getModulePath("sap.ui.demo.wt.data",
							"/data1.json"));
			
			var dialog = sap.ui.xmlfragment(
					"sap.ui.demo.wt.view.ConfirmPopup", this);
			
			dialog.bindObject({
				path : "/popupData/1" 
			});
			
			dialog.setModel(oModel);
			
			dialog.open();
		},
		
		onCancel: function(aControlEvent) {
			var oDialog = aControlEvent.getSource().getParent();
			oDialog.close();
		}

	});
});
