sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/IconPool",
	"sap/ui/core/Popup",
	"sap/ui/demo/wt/util/formatter"],
function(Controller, MessageToast, JSONModel, IconPool, Popup, formatter) {
	"use strict";
	return Controller.extend("sap.ui.demo.wt.controller.ProjectInfo", {
		formatter: formatter,
		onInit : function() {

			var oModel = new sap.ui.model.json.JSONModel(jQuery.sap
					.getModulePath("sap.ui.demo.wt.data",
							"/data3.json"));
			
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			
			this.getView().setModel(oModel);
			this.getView().setModel(this.getOwnerComponent().getModel("list"),"list");
			this.getView().setModel(this.getOwnerComponent().getModel("radarData2"),"radarData2");
			this.getView().setModel(this.getOwnerComponent().getModel("radarOption2"),"radarOption2");
			this.getView().setModel(this.getOwnerComponent().getModel("radarData3"),"radarData3");
			this.getView().setModel(this.getOwnerComponent().getModel("radarOption3"),"radarOption3");
			this.getView().setModel(this.getOwnerComponent().getModel("radarOption3"),"radarOption3");
			
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
			var oPieChartModel = this.getOwnerComponent().getModel("pieChartData");
			oVizFrame.setModel(oPieChartModel);
			this._oPopup = [];
		},
		onNavPress : function(aControlEvent){
			window.history.go(-1);
		},
		onPopup: function(aControlEvent){
			
			var oModel = new sap.ui.model.json.JSONModel(jQuery.sap
					.getModulePath("sap.ui.demo.wt.data",
							"/data1.json"));
			
			if(this._oPopup.length <= 2) {
				var oPopup = new Popup();
				oPopup.setDurations(0, 0);
				this._oPopup.push(oPopup);
				var _oDialogPop = sap.ui.xmlfragment(
						"sap.ui.demo.wt.view.PersonCardPopup", this);
			} else {
				return;
			}
			
			
//			if (!this._oDialogPop) {
			_oDialogPop.setModel(oModel);
			_oDialogPop.setModel(this.getView().getModel("list"),"list");
			_oDialogPop.setModel(this.getView().getModel("radarData4"),"radarData4");
			_oDialogPop.setModel(this.getView().getModel("radarOption4"),"radarOption4");
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
//			var source = aControlEvent.getSource();
			var oDock = Popup.Dock;
			var sAt = oDock.RightCenter; 
			if (oPopup.isOpen()) {
				return;
			} else {
				oPopup.open(0, oDock.LeftCenter, sAt, aControlEvent.getSource(), null, "fit", true);
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
		}
	});
});
