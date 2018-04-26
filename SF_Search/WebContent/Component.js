sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/demo/wt/util/DataManager",
	"sap/ui/demo/wt/valuehelp/util/ZHE_CLIENT"
], function(UIComponent, JSONModel, ResourceModel, DataManager, ZHE_CLIENT) {
	"use strict";
	return UIComponent.extend("sap.ui.demo.wt.Component", {
		metadata : {
			manifest : "json"
		},
		init : function() {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			this.oDataManager = new DataManager(this);
			
			this.getRouter().initialize();
			
			this.ZHE_CLIENT = new ZHE_CLIENT();
			setTimeout(function(){
				this.ZHE_CLIENT.initialize();
				this.oUserListPromise = this.oDataManager.getUserListData();
				this.oUserListPromise.then(function(aData){
					this.setModel(new JSONModel(aData.results), "UserList")
				}.bind(this));
			}.bind(this),500)

			let oCore = sap.ui.getCore();
			oCore.loadLibrary('sap/ab/thirdParty', {url:'../lib/ab/thirdParty', async:true});
			oCore.loadLibrary('sap/ab/graph', {url:'../lib/ab/graph', async:true});
			oCore.loadLibrary('sap/ab/projectCard', {url:'../lib/ab/projectCard', async:true});
			oCore.loadLibrary('sap/ab/p13Panel', {url:'../lib/ab/p13Panel', async:true});
		}

	});
});
