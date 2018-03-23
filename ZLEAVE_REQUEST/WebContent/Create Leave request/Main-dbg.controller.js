/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.controller("hcm.myleaverequest.Main", {
	/*global hcm:true*/
	onInit: function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		jQuery.sap.require("hcm.myleaverequest.utils.ConcurrentEmployment");
        hcm.myleaverequest.utils.ConcurrentEmployment.iAmAlreadyCalled = false;
		sap.ca.scfld.md.Startup.init("hcm.myleaverequest", this);
	},
	onExit: function() {
		//exit cleanup code here
		try {
			var oController = hcm.myleaverequest.utils.ConcurrentEmployment.getControllerInstance();
			hcm.myleaverequest.utils.UIHelper.setPernr("");
			hcm.myleaverequest.utils.ConcurrentEmployment.iAmAlreadyCalled = false;
			if (oController.oCEDialog.isOpen()) {
				oController.oCEDialog.Cancelled = true;
				oController.oCEDialog.close();
			}
		} catch (e) {
			jQuery.sap.log.error("couldn't execute onExit", ["onExit failed in main controller"], ["hcm.myleaverequest.Main"]);
		}
	}
});