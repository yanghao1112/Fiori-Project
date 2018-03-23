sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ZZZ01/ZCHARTTEST/model/models",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ZZZ01/ZCHARTTEST/localService/mockserver"
], function(UIComponent, Device, models,ODataModel, mockserver) {
	"use strict";

	return UIComponent.extend("sap.ZZZ01.ZCHARTTEST.Component", {

		metadata : {
            rootView: "sap.ZZZ01.ZCHARTTEST.view.ZZmain",
            dependencies: {
                libs: [
                    "sap.ui.table",
                    "sap.ui.unified",
                    "sap.m"
                ]
            },
            config: {
                sample: {
                    stretch: true,
                    files: [
                        "localService/mockdata/Nodes.json",
                        "localService/metadata.xml",
                        "localService/mockserver.js",
                        "Component.js",
                        "controller/ZZmain.controller.js",
                        "view/ZZmain.view.xml"
                    ]
                }
            }
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			var mConfig = this.getMetadata().getConfig();

			// always use absolute paths relative to our own
			// component
			// (relative paths will fail if running in the Fiori
			// Launchpad)
			//var rootPath = jQuery.sap.getModulePath("sap.ZZZ01.ZVALUEHELP");


			
			//this.getRouter().initialize();
			jQuery.sap.includeStyleSheet(sap.ui.resource("sap.ZZZ01.ZCHARTTEST", "css/ZCSS001.css"));
		
		
            var sODataServiceUrl = "/here/goes/your/odata/service/url/";

            // init our mock server
            mockserver.init(sODataServiceUrl);

            // set model on component
            this.setModel(
                new ODataModel(sODataServiceUrl, {
                    json : true,
                    useBatch : true
                })
            );
            

			var oModel1 = new sap.ui.model.json.JSONModel(
					jQuery.sap.getModulePath(
							"sap.ZZZ01.ZCHARTTEST.data",
							"/data.json"));
			this.setModel(oModel1, "list");
			

		}
	});

});