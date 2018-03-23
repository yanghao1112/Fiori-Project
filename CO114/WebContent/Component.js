



sap.ui.define([
	"sap/ui/core/UIComponent",
	"jquery.sap.global",
	"sap/ui/model/json/JSONModel",
	"sap/ZG001/Sample/CO114/util/DataManager"
], function(UIComponent, jQuery, JSONModel, DataManager) {
	"use strict";

	return UIComponent.extend("sap.ZG001.Sample.CO114.Component", {
		
		metadata : {
			manifest: "json"
		},
		init : function(){

			this.oDataManager = new DataManager(this);
			
			UIComponent.prototype.init.apply(this, arguments);

			let sRootUrl = jQuery.sap.getModulePath('sap.ZG001.Sample.CO114');

			jQuery.sap.includeStyleSheet(sRootUrl + '/css/style.css');

			let oMock = new JSONModel();
			oMock.loadData(sRootUrl + '/model/CO114-data.json', null, false);
			this.setModel(oMock, "mockdata");

			let oOption = new JSONModel();
			oOption.loadData(sRootUrl + '/model/CO114-sel.json', null, false);
			this.setModel(oOption, "selection");

			this.getRouter().initialize();

		}
	});

});