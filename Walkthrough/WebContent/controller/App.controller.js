sap.ui.define([ "sap/ui/core/mvc/Controller", "sap/m/MessageToast",
		"sap/ui/model/json/JSONModel","sap/ui/core/IconPool", "sap/ui/core/Popup"], function(Controller, MessageToast,
		JSONModel, IconPool, Popup) {
	"use strict";
	return Controller.extend("sap.ui.demo.wt.controller.App", {
		onInit : function() {


			var oModel = new sap.ui.model.json.JSONModel(jQuery.sap
					.getModulePath("sap.ui.demo.wt.data",
							"/data1.json"));
			this.getView().setModel(oModel);
			this._oPopup = [];
			
			var x = {
					a: 'aaaa',
					b: 'ccc',
					funccc: function() {
						var x = 1;
						return x;
					}
			}
			
			for(var t in x) {
				alert(t.toString());
			}
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
		onPopup: function(aControlEvent){
			var oFilePath = aControlEvent.getSource().getCustomData()[0].getValue();
			
			var oModel = new sap.ui.model.json.JSONModel(jQuery.sap
					.getModulePath("sap.ui.demo.wt.data",
							"/" + oFilePath));
			
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
			_oDialogPop.setModel(this.getView().getModel("radarData"),"radarData");
			_oDialogPop.setModel(this.getView().getModel("radarOption"),"radarOption");
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
		}

	});
});
