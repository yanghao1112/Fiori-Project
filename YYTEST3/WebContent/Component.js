sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";
	return UIComponent.extend("sap.ZG001.simpleReport3.Component", {
		metadata : {
            manifest: "json"
		},
		init : function(){
			UIComponent.prototype.init.apply(this, arguments);
			
			this.getRouter().initialize();
			
			this.getModel().setDefaultBindingMode("TwoWay");
		}		
	});
});