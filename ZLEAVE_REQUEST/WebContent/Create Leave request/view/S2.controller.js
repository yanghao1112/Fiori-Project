/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");jQuery.sap.require("hcm.myleaverequest.utils.Formatters");jQuery.sap.require("hcm.myleaverequest.utils.UIHelper");jQuery.sap.require("hcm.myleaverequest.utils.DataManager");jQuery.sap.require("hcm.myleaverequest.utils.ConcurrentEmployment");sap.ca.scfld.md.controller.BaseFullscreenController.extend("hcm.myleaverequest.view.S2",{extHookChangeFooterButtons:null,extHookTimeAccountCollection:null,onInit:function(){sap.ca.scfld.md.controller.BaseFullscreenController.prototype.onInit.call(this);this.oApplication=this.oApplicationFacade.oApplicationImplementation;this.resourceBundle=this.oApplicationFacade.getResourceBundle();this.oDataModel=this.oApplicationFacade.getODataModel();this.entitlementTableCntrl=this.byId("entitlemntTble");this.templateCntrl=this.byId("LRS2_LISTITEM");this.oRouter.attachRouteMatched(this._handleRouteMatched,this);hcm.myleaverequest.utils.DataManager.init(this.oDataModel,this.resourceBundle);hcm.myleaverequest.utils.Formatters.init(this.resourceBundle);},_handleRouteMatched:function(e){if(e.getParameter("name")==="entitlements"){var _=this;var p=hcm.myleaverequest.utils.UIHelper.getPernr();if(p){_.initializeEntitlementView();}else{hcm.myleaverequest.utils.ConcurrentEmployment.getCEEnablement(this,function(){_.initializeEntitlementView();});}}},initializeEntitlementView:function(){var _=this;sap.ca.ui.utils.busydialog.requireBusyDialog();hcm.myleaverequest.utils.DataManager.getTimeAccountCollection(function(r){sap.ca.ui.utils.busydialog.releaseBusyDialog();if(this.extHookTimeAccountCollection){r=this.extHookTimeAccountCollection(r);}_.entitlementTableCntrl.setModel(new sap.ui.model.json.JSONModel(r));_.entitlementTableCntrl.bindItems("/TimeAccountCollection",_.templateCntrl);},function(o){sap.ca.ui.utils.busydialog.releaseBusyDialog();hcm.myleaverequest.utils.UIHelper.errorDialog(hcm.myleaverequest.utils.DataManager.parseErrorMessages(o));});},getHeaderFooterOptions:function(){var o={sI18NFullscreenTitle:"LR_TITLE_BALANCE_VIEW"};var m=new sap.ui.core.routing.HashChanger();var u=m.getHash();if(u.indexOf("Shell-runStandaloneApp")>=0){o.bSuppressBookmarkButton=true;}if(this.extHookChangeFooterButtons){o=this.extHookChangeFooterButtons(o);}return o;}});
