/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("hcm.myleaverequest.utils.Formatters");
jQuery.sap.require("hcm.myleaverequest.utils.DataManager");
jQuery.sap.require("hcm.myleaverequest.utils.UIHelper");
jQuery.sap.require("hcm.myleaverequest.utils.ConcurrentEmployment");
jQuery.sap.require("sap.m.ObjectAttribute");
/*global hcm window*/
sap.ca.scfld.md.controller.ScfldMasterController.extend("hcm.myleaverequest.view.S3", {

	extHookChangeFooterButtons: null,
	extHookLeaveRequestCollection : null,
	extHookItemTemplate : null,
	
	onInit : function() {
		sap.ca.scfld.md.controller.ScfldMasterController.prototype.onInit.call(this);
		this.oApplication = this.oApplicationFacade.oApplicationImplementation;
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		hcm.myleaverequest.utils.DataManager.init(this.oDataModel, this.resourceBundle);
		hcm.myleaverequest.utils.Formatters.init(this.resourceBundle);
		this.oRouter.attachRouteMatched(this._handleRouteMatched, this);
		this.masterListCntrl = this.oView.byId("list");
		this.objLeaveRequestCollection = null;
		this.oBus = sap.ui.getCore().getEventBus();
		this.oBus.subscribe("hcm.myleaverequest.LeaveCollection", "refresh", this._initData, this);
		this.onDataLoaded();
		this._fnRefreshCompleted = null;
		this._isLocalRouting = false;
		this._isInitialized = false;
		this._isMasterRefresh = false;
		this._searchField = "";
	},

	/**
     * @public [onDataLoaded On master list loaded]
     */
    onDataLoaded: function() {
    	var that = this;
        if (that.getList().getItems().length < 1) {
            if (!sap.ui.Device.system.phone) {
            	 that.showEmptyView();
            }
           
        }
    },


	getHeaderFooterOptions : function() {
		var _this = this;
		var objHdrFtr = {
			sI18NMasterTitle : "LR_TITLE_LEAVE_REQUESTS",
			onRefresh : function(searchField, fnRefreshCompleted){
				_this._fnRefreshCompleted = fnRefreshCompleted;
				_this._searchField = searchField;
				_this._isMasterRefresh = true;
				_this._initData();
			}
		};
        var m = new sap.ui.core.routing.HashChanger();
		var oUrl = m.getHash();
		if (oUrl.indexOf("Shell-runStandaloneApp") >= 0) {
			objHdrFtr.bSuppressBookmarkButton = true;
		}
		/**
         * @ControllerHook Modify the footer buttons
         * This hook method can be used to add and change buttons for the detail view footer
         * It is called when the decision options for the detail item are fetched successfully
         * @callback hcm.myleaverequest.view.S3~extHookChangeFooterButtons
         * @param {object} Header Footer Object
         * @return {object} Header Footer Object
         */
    	
    	if (this.extHookChangeFooterButtons) {
    		objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
    	}
    	return objHdrFtr;
	},
	
	
	_handleRouteMatched : function(oEvent) {
        var _this = this;
		// to use cached data for local routing
		if (oEvent.getParameter("name") === "master" && ((this._isLocalRouting === false) || hcm.myleaverequest.utils.UIHelper.getIsChangeAction())) {
			hcm.myleaverequest.utils.UIHelper.setIsChangeAction(false);
			//clear searchField
			if(!!this._oControlStore & !!this._oControlStore.oMasterSearchField && !!this._oControlStore.oMasterSearchField.clear){
				this._oControlStore.oMasterSearchField.clear();
			}
			var oPernr = hcm.myleaverequest.utils.UIHelper.getPernr();
			if (oPernr) {
					_this._initData();
				}
			else{
			    hcm.myleaverequest.utils.ConcurrentEmployment.getCEEnablement(this, function() {
				_this._initData();
			});
			}
			
		}
		
		//reset flag
		if(oEvent.getParameter("name") === "master" && this._isLocalRouting === false){
			this._isLocalRouting = true;
		}
		
	},
		
	_initData : function(){		
		var _this = this;
		sap.ca.ui.utils.busydialog.requireBusyDialog();
		  
		  // creation of a local JSON model is required because the leave request collection in the OData model contains
			// all leave requests including change requests. In the list view, only the original requests shall be shown.
			// Change requests to the original requests shall be only reflected by adding an additional info field like e.g.
			// 'Change Pending'
			// Solution: Function getConsolidatedLeaveRequests operates on all leave requests and creates a new collection
			// result only
			// containing the original requests which have a relation to the change request leave key
		if(!hcm.myleaverequest.utils.UIHelper.getIsLeaveCollCached()){
			hcm.myleaverequest.utils.DataManager.getConsolidatedLeaveRequests(function(objResponse) {
				
				_this.objLeaveRequestCollection = objResponse.LeaveRequestCollection;
				
				/**
		     * @ControllerHook Modify the LeaveRequestCollection response
		     * This hook method can be used to modify the LeaveRequestCollection
		     * It is called when the method LeaveRequestCollection in DataManager executes
		     * @callback hcm.myleaverequest.view.S3~extHookLeaveRequestCollection
		     * @param {object} LeaveRequestCollection Object
		     * @return {object} LeaveRequestCollection Object
		     */
				if(_this.extHookLeaveRequestCollection) {
					_this.objLeaveRequestCollection = _this.extHookLeaveRequestCollection(_this.objLeaveRequestCollection);
				}
				
				hcm.myleaverequest.utils.DataManager.setCachedModelObjProp("ConsolidatedLeaveRequests",_this.objLeaveRequestCollection);
				hcm.myleaverequest.utils.UIHelper.setIsLeaveCollCached(false);
				_this.setMasterListItems();
				if(_this._searchField!=="")
				{
				_this.applySearchPattern(_this._searchField);
				}
			}, function(objResponse) {

				hcm.myleaverequest.utils.DataManager.parseErrorMessages(objResponse);
			});
		}
		else{
			_this.objLeaveRequestCollection=hcm.myleaverequest.utils.DataManager.getCachedModelObjProp("ConsolidatedLeaveRequests");
			hcm.myleaverequest.utils.UIHelper.setIsLeaveCollCached(false);
			_this.setMasterListItems();
		}
	},
	
	//@overriding since we are using LeaveKey/RequestId as contextPath
	getDetailNavigationParameters : function(oListItem) {
		var navProperty = "";
		if(oListItem){
		var parameters = oListItem.getBindingContext(this.sModelName).getPath().substr(1).split("/");
		if((parameters.length > 1) && (this.objLeaveRequestCollection.length > parameters[1])){
			navProperty = this.objLeaveRequestCollection[parameters[1]]._navProperty;
		}
		return {
			contextPath : encodeURIComponent(navProperty)
		};
		}
	},
	
	setMasterListItems : function(){
		var _this = this;
		try{
			if (_this.objLeaveRequestCollection) {
				hcm.myleaverequest.utils.UIHelper.setRoutingProperty(_this.objLeaveRequestCollection);
				_this.objLeaveRequestCollection=hcm.myleaverequest.utils.UIHelper.getRoutingProperty();				
				var oModel = new sap.ui.model.json.JSONModel({ "LeaveRequestCollection" : _this.objLeaveRequestCollection});
				_this.oView.setModel(oModel);
				//_this._isLocalRouting = true;
				
				var itemTemplate = new sap.m.ObjectListItem(
            {
              type : "{device>/listItemType}",
               title : "{AbsenceTypeName}",
                // FA 2310160<<
                number : "{parts:[{path:'WorkingDaysDuration'},{path:'WorkingHoursDuration'},{path:'AdditionalFields/ALLDF'}], formatter: 'hcm.myleaverequest.utils.Formatters.formatterAbsenceDuration'}",
                numberUnit : "{parts:[{path:'WorkingDaysDuration'},{path:'WorkingHoursDuration'},{path:'AdditionalFields/ALLDF'}], formatter: 'hcm.myleaverequest.utils.Formatters.formatterAbsenceDurationUnit'}",
                //number : "{path:'WorkingHoursDuration', formatter:'hcm.myleaverequest.utils.Formatters.adjustSeparator'}",
                //numberUnit :_this.resourceBundle.getText("LR_LOWERCASE_HOURS"),
                //FA 2310160>>               
                 attributes : [
                                 new sap.m.ObjectAttribute(
                                               {			text : "{path:'StartDate', formatter:'hcm.myleaverequest.utils.Formatters.DATE_ODATA_EEEdMMMyyyy'}"
                                               }),
                                 new sap.m.ObjectAttribute(
                                               {
                                                      text : "{parts:[{path:'i18n>LR_HYPHEN'},{path:'WorkingDaysDuration'},{path:'StartTime'},{path:'EndDate'},{path:'EndTime'}], formatter: 'hcm.myleaverequest.utils.Formatters.FORMAT_ENDDATE'}"
                                               }) ],
                 firstStatus :  new sap.m.ObjectStatus({
                	 text : "{StatusName}",
              		 state : "{path:'StatusCode', formatter:'hcm.myleaverequest.utils.Formatters.State'}"	 
                 }), 
                 secondStatus : new sap.m.ObjectStatus({
                		 state : "Error",
                		 text : "{path:'aRelatedRequests', formatter:'hcm.myleaverequest.utils.Formatters.FORMATTER_INTRO'}"	 
                 }),
                 press : jQuery.proxy(_this._handleItemPress,_this)
        });
				
				
				/**
		     * @ControllerHook Modify the item template for list
		     * This hook method can be used to modify the itemTemplate
		     * It is called when the method setMasterListItems executes
		     * @callback hcm.myleaverequest.view.S3~extHookItemTemplate
		     * @param {object} itemTemplate Object
		     * @return {object} itemTemplate Object
		     */
				if(this.extHookItemTemplate) {
					itemTemplate = this.extHookItemTemplate(itemTemplate);
				}
							
				
				_this.masterListCntrl.bindItems({
					path : "/LeaveRequestCollection",
					template : itemTemplate
				});
				if(_this._fnRefreshCompleted)
				{
					_this._fnRefreshCompleted();
				}
				//sap.ca.ui.utils.busydialog.releaseBusyDialog();
			 }	
			}
			
			catch(err)
			{
				jQuery.sap.log.warning(err);

			}
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			if(!jQuery.device.is.phone && !_this._isInitialized){
				_this.registerMasterListBind(_this.masterListCntrl);						
				_this._isInitialized = true;
			}
			if(!jQuery.device.is.phone || hcm.myleaverequest.utils.UIHelper.getIsWithDrawAction()){
				
				_this.setLeadSelection();
			}
			
	},
	

	// event handler for setting the lead selection in the history overview list. Initially the first entry is
	// preselected.
	// also called when in history details a leave was withdrawn
	setLeadSelection : function() {
		var oItems = this.masterListCntrl.getItems();
		var oIndex = null, searchKey = null;
		var completeURL =  window.location.hash.split('detail');
		if(completeURL[1]!== undefined){
			completeURL= completeURL[1].split('/');
		}
		if(completeURL[1]!== undefined){
			searchKey = decodeURIComponent(completeURL[1]);
			searchKey = decodeURIComponent (searchKey);
		}
		if((searchKey !== null && searchKey !== "")&& (this.objLeaveRequestCollection) && !hcm.myleaverequest.utils.UIHelper.getIsWithDrawAction()){   //NOTE 2316063
			for ( var i = 0; i < this.objLeaveRequestCollection.length; i++) {
				if (this.objLeaveRequestCollection[i]._navProperty === searchKey) {
					oIndex = i;
					break;
				}
			}
			if(oIndex === null){
				if(hcm.myleaverequest.utils.UIHelper.getIsWithDrawn(searchKey) && (oItems.length > 0)){
					this.setListItem(oItems[0]);
			}else{
					this.showEmptyView();
				}
	
			}else{
				if(oItems.length > oIndex){
				   this.setListItem(oItems[oIndex]);
				}
			}

		}else {
			oIndex = 0;
			if(oItems.length > 0){
				this.setListItem(oItems[oIndex]);
			}
		}		
	},
	
	
  setListItem : function(oItem) {
	  if(this._isMasterRefresh){
		  this._isMasterRefresh = false;
		  this.setLeadSelection();
	  }else{
		  if (oItem !== undefined) {
			  oItem.setSelected(true);
			  if(hcm.myleaverequest.utils.UIHelper.getIsWithDrawAction() && jQuery.device.is.phone){
				  hcm.myleaverequest.utils.UIHelper.setIsWithDrawAction(false);
				  this.oRouter.navTo("detail",this.getDetailNavigationParameters(oItem),true);
			  }else{
				  this.oRouter.navTo("detail",this.getDetailNavigationParameters(oItem),!jQuery.device.is.phone);
			  }
		  } 
		  this._isLocalRouting = true;    
	  }
  }
	

});