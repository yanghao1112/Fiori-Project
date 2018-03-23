sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device"
], function(UIComponent, Device) {
	"use strict";

	return UIComponent.extend("sap.ZG001.timesheet.input.weekly.Component", {

		metadata : {
            manifest: "json"
		},

		init: function() {
			/* call the base component's init function */
			UIComponent.prototype.init.apply(this, arguments);

			jQuery.sap.registerModulePath("sap/ZG001/timesheet/valuehelp","./valuehelp");
//			jQuery.sap.registerModulePath("sap/ZG001/timesheet/valuehelp","/sap/bc/ui5_ui5/sap/ZGHRP005");
			/* set the device model */
			var deviceModel = new sap.ui.model.json.JSONModel(
	                {
	                    isTouch : sap.ui.Device.support.touch,
	                    isNoTouch : !sap.ui.Device.support.touch,
	                    isPhone : sap.ui.Device.system.phone,
	                    isNoPhone : !sap.ui.Device.system.phone,
	                    listMode : sap.ui.Device.system.phone ? "None"
	                            : "SingleSelectMaster",
	                    listItemType : sap.ui.Device.system.phone ? "Active"
	                            : "Inactive"
	                });
	        deviceModel.setDefaultBindingMode("OneWay");
	        this.setModel(deviceModel, "device");
			
	        var oModel = new sap.ui.model.odata.ODataModel("proxy/sap/opu/odata/sap/ZGOHR001_SRV/?sap-client=120",true);
	        this.setModel(oModel);
			
			this.getRouter().initialize();
			
			jQuery.sap.includeStyleSheet(sap.ui.resource("sap.ZG001.timesheet.input.weekly", "css/ZCSS001.css"));
		},
		startMockServer : function(sServiceUrl) {
		    "use strict";
		    jQuery.sap.require("sap.ui.core.util.MockServer");
		    var oMockServer = new sap.ui.core.util.MockServer({
		      rootUri : sServiceUrl
		    });

		    sap.ui.core.util.MockServer.config({
		      autoRespondAfter : 0
		    });

		    oMockServer.simulate(jQuery.sap.getModulePath("sap.ZG001.timesheet.input.weekly") + "/mock/metadata.xml", jQuery.sap.getModulePath("sap.ZG001.timesheet.input.weekly") + "/mock");
		    oMockServer.start();

		    sap.m.MessageToast.show("Running in demo mode with mock data.", {
		      duration : 10000
		    });
		  }
	});

});