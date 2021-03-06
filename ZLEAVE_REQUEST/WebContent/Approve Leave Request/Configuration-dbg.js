/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.approve.leaverequest.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("hcm.approve.leaverequest.Configuration", {
	oServiceParams: {
		serviceList: [{		
			name: "Approve Leave Requests",
			masterCollection: "LeaveRequestSet",
			serviceUrl: "/sap/opu/odata/sap/HCM_LEAVE_REQ_APPROVE_SRV/", //oData service relative path
			isDefault: true,
			mockedDataSource: "/hcm.approve.leaverequest/model/metadata.xml"
		}]
	},

	getServiceParams : function() {
		return this.oServiceParams;
	},

	/**
	 * @inherit
	 */
	getServiceList : function() {
		return this.getServiceParams().serviceList;
	},

	getMasterKeyAttributes : function() {
		//return the key attribute of your master list item
		return ["RequestId"];
	},
	
	setApplicationFacade: function(oApplicationFacade) {
        hcm.approve.leaverequest.Configuration.oApplicationFacade = oApplicationFacade;
    }
});
