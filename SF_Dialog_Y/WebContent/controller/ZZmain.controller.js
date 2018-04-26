sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/IconPool",
	"sap/ui/core/Popup",
	"sap/ui/layout/HorizontalLayout",
	"sap/ui/demo/wt/util/formatter"],
function(Controller, MessageToast, JSONModel, IconPool, Popup, HorizontalLayout , formatter) {
	"use strict";
	return Controller.extend("sap.ui.demo.wt.controller.ZZmain", {
		formatter: formatter,
		onInit : function() {
			"use strict";
			var oModel = new sap.ui.model.json.JSONModel(jQuery.sap
					.getModulePath("sap.ui.demo.wt.data",
							"/Project.json"));
			this.getView().setModel(oModel);

		},
		
		onAfterRendering : function(){
			"use strict";
			var oSecondTab = this.getView().byId("myTabContainer").getItems()[1];
			this.getView().byId("myTabContainer").setSelectedItem(oSecondTab);
			
		},

		/* Event handling for clicking 'Project Card' */
		onPressProject: function(aControlEvent) {
			"use strict";
			this.getOwnerComponent().getRouter().navTo("projectInfo", {}, false);
						
		},
		
		/* Event handling for clicking button 'Add New Tab' */
		onAddNewTab : function(aControlEvent){
			"use strict";
			var oModel = new sap.ui.model.json.JSONModel(jQuery.sap
					.getModulePath("sap.ui.demo.wt.data",
							"/data1.json"));
			
			var oDialog = sap.ui.xmlfragment(
					"sap.ui.demo.wt.view.ConfirmPopup", this);
			
			oDialog.bindObject({
				path : "/popupData/0" 
			});
			
			oDialog.setModel(oModel);
			oDialog.open();
		},	
		
		/* Event handling for clicking card 'New Group' */
		onAddNewGroup: function(aControlEvent) {
			"use strict";
			var oModel = new sap.ui.model.json.JSONModel(jQuery.sap
					.getModulePath("sap.ui.demo.wt.data",
							"/data1.json"));
			
			var oDialog = sap.ui.xmlfragment(
					"sap.ui.demo.wt.view.ConfirmPopup", this);
			
			oDialog.bindObject({
				path : "/popupData/1" 
			});
			
			oDialog.setModel(oModel);
			oDialog.open();
		},
		
		/* Event handling for clicking button 'Cancel' on Popup dialog */
		onCancel: function(aControlEvent) {
			"use strict";
			var oDialog = aControlEvent.getSource().getParent();
			oDialog.close();
		}

	});
});
