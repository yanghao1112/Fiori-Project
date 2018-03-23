/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.myleaverequest.Component");
jQuery.sap.require("hcm.myleaverequest.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

sap.ca.scfld.md.ComponentBase.extend("hcm.myleaverequest.Component", {
		metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
			"name" : "My Leave Request",
			"version" : "1.8.28",
			"library" : "hcm.myleaverequest",
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
		viewPath : "hcm.myleaverequest.view",
		
		masterPageRoutes : {
			"master" : {
				"pattern" : "history",
				"view" : "S3"				
			}
		},
		
		detailPageRoutes :{
			// fill the routes to your detail pages in here. The application will navigate from the master
			// page to route
			// "detail" leading to detail screen S3.
			// If this is not desired please define your own route "detail"
			"detail" : {
					"pattern" : "detail/{contextPath}",
					"view" : "S6B"
			}
		},
		
		fullScreenPageRoutes : {
			// fill the routes to your full screen pages in here.
				"home" : {
					"pattern" : "",
					"view" : "S1"
				},
				"change" : {
					"pattern" : "change/{requestID}",
					"view" : "S1"
				},
				"entitlements" : {
					"pattern" : "entitlements",
					"view" : "S2"
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
			component : this
		};
		return sap.ui.view({
			viewName : "hcm.myleaverequest.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	}
});

