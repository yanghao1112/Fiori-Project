/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.myleaverequest.Configuration");jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");jQuery.sap.require("sap.ca.scfld.md.app.Application");sap.ca.scfld.md.ConfigurationBase.extend("hcm.myleaverequest.Configuration",{oServiceParams:{serviceList:[{name:"My Leave Request",masterCollection:"LeaveRequestCollection",serviceUrl:"/sap/opu/odata/sap/HCM_LEAVE_REQ_CREATE_SRV/",isDefault:true,mockedDataSource:"/hcm.myleaverequest/model/metadata.xml"}]},getServiceParams:function(){return this.oServiceParams;},getServiceList:function(){return this.getServiceParams().serviceList;},getMasterKeyAttributes:function(){return["Id"];}});
