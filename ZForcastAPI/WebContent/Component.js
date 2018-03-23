sap.ui.define([
	"sap/ui/core/UIComponent",
	"ShipmentHF/util/DataManager"	
], function(UIComponent, DataManager) {
	"use strict";
	return UIComponent.extend("ShipmentHF.Component", {
		metadata : {
            manifest: "json"
		},
		init : function() {
			this.oDataManager = new DataManager(this);
			// call the init function of the parent							
			UIComponent.prototype.init.apply(this, arguments);
			this.getRouter().initialize();
			
		}
	});
});