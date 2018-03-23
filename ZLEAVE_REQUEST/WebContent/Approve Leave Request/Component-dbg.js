/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.approve.leaverequest.Component");
jQuery.sap.require("hcm.approve.leaverequest.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

sap.ca.scfld.md.ComponentBase.extend("hcm.approve.leaverequest.Component", {
		metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
			"name" : "Master Detail Sample",
			"version" : "1.8.25",
			"library" : "hcm.approve.leaverequest",
			"includes" : ["css/scfld.css"],
				"dependencies" : {
				"libs" : ["sap.m", "sap.me"],
			"components" : []
			},
			"config" : {
				"resourceBundle" : "i18n/i18n.properties",
				"titleResource" : "app.Identity"
			//	"icon" : "sap-icon://Fiori2/F0002",
			//	"favIcon" : "./resources/sap/ca/ui/themes/base/img/favicon/F0002_My_Accounts.ico",
			//	"homeScreenIconPhone" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/57_iPhone_Desktop_Launch.png",
			//	"homeScreenIconPhone@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/114_iPhone-Retina_Web_Clip.png",
			//	"homeScreenIconTablet" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/72_iPad_Desktop_Launch.png",
			//	"homeScreenIconTablet@2" : "./resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/144_iPad_Retina_Web_Clip.png",
		},
		viewPath : "hcm.approve.leaverequest.view",
		masterPageRoutes: {
			"master": {
				"pattern": ":scenarioId:",
				"view": "S2"
			}
		},
		detailPageRoutes: {
			"detail": {
				"pattern": "detail/{contextPath}",
				"view": "S3"
			},
			"calendar": {
				"pattern": "calendar/{SAP__Origin}/{RequestId}/{StartDate}",
				"view": "S4"
			}
		}
	}),
	
	/**
	 * Initialize the application
	 *
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {
		var oViewData = {
				component: this
			},
			oView = sap.ui.view({
				viewName: "hcm.approve.leaverequest.Main",
				type: sap.ui.core.mvc.ViewType.XML,
				viewData: oViewData
			}),
			sPrefix = oView.getId() + "--",
			oEventBus = sap.ui.getCore().getEventBus();

		this.oEventBus = {
			publish: function(channelId, eventId, data) {
				channelId = sPrefix + channelId;
				oEventBus.publish(channelId, eventId, data);
			},
			subscribe: function(channelId, eventId, data, oListener) {
				channelId = sPrefix + channelId;
				oEventBus.subscribe(channelId, eventId, data, oListener);
			},
			unsubscribe: function(channelId, eventId, data, oListener) {
				channelId = sPrefix + channelId;
				oEventBus.unsubscribe(channelId, eventId, data, oListener);
			}
		};
		return oView;
	}
});

