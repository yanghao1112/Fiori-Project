/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("hcm.approve.leaverequest.util.Conversions");
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("sap.ca.ui.message.message");
/*global hcm:true*/
sap.ca.scfld.md.controller.ScfldMasterController.extend("hcm.approve.leaverequest.view.S2", {
	extHookChangeFooterButtons: null,
	onInit: function() {
		"use strict";
		this.resourceBundle = this.oApplicationFacade.getResourceBundle();
		this.oDataModel = this.oApplicationFacade.getODataModel();
		this._getData();
		this.registerMasterListBind(this.getList());
		this.aRequestFilterList = [];
		var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
		var oComponent = sap.ui.component(sComponentId);
		oComponent.oEventBus.subscribe("hcm.approve.leaverequest", "leaveRequestApproveReject", this._handleApproveRejectCallBack, this);
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "detail") {
				var sBindingContextPath = this.getBindingContextPathFor(oEvent.getParameter("arguments"));
				var oItem = this.findItemByContextPath(sBindingContextPath);
				var oList = this.getList();
				var aListItems = oList.getItems().filter(function(element, index, array) { // remove invisible items
					return element.getVisible();
				});
				// Find the item that will be displayed next (e.g. if this one is approved)
				if(aListItems.length >= 2) { // At least two items, determine next item to be selected (after approve/reject)
					var iIndex = oList.indexOfItem(oItem);
					if(iIndex + 1 < aListItems.length) { // Still a next item? Mark this one
						this.oApplicationFacade._sNextDetailPath = aListItems[iIndex + 1].getBindingContext(this.sModelName).getPath();
					} else { // No next item? Keep selection at the same position
						this.oApplicationFacade._sNextDetailPath = aListItems[iIndex - 1].getBindingContext(this.sModelName).getPath();
					}
				} else {
					this.oApplicationFacade._sNextDetailPath = null;
				}
			}
		}, this);
	},
	
	/**
	 * @param {string} sFilterPattern
	 *     The content of the search field.
	 * @return {number}
	 *     The number of list items still visible.
	 * @override
	 */
	applySearchPattern: function(sFilterPattern) {
		// This function needs to be overwritten, in order to overrule the default counting of items. With an emtpy filter pattern,
		// the item count above the list does not reflect hidden items. Therefore call the parent implementation, but overwrite the
		// way it counts the items.
		this.iCount = 0;
		sap.ca.scfld.md.controller.ScfldMasterController.prototype.applySearchPattern.call(this, sFilterPattern);
		return this.iCount;
	},
	
	/**
	 * @param {object} oItem
	 *    The item to be tested.
	 * @param {string} sFilterPattern
	 *    The filter pattern.
	 * @returns {boolean}
	 *    Returns <code>true</code> if the item matches to the current filter pattern.
	 * @override
	 */
	applySearchPatternToListItem: function(oItem, sFilterPattern) {
		var oData = this.oDataModel.getProperty(oItem.getBindingContext().sPath);
		if(this.aRequestFilterList.indexOf(oData.RequestId) !== -1) {
			// Found in filter list, set to hidden
			return false;
		}
		// ..else use super implementation to respect user searches (but count visibility separately)
		var visible = sap.ca.scfld.md.controller.ScfldMasterController.prototype.applySearchPatternToListItem.call(this, oItem, sFilterPattern);
		if(visible) {
			this.iCount++;
		}
		return visible;
	},

	/**
	 * On master list loaded
	 * @return {void}
	 */
	onDataLoaded: function() {
		// Reset hidden item filter
		this.aRequestFilterList = [];
		
		if (this.getList().getItems().length < 1) {
			if (!sap.ui.Device.system.phone) {
				this.showEmptyView("DETAIL_TITLE", "NO_ITEMS_AVAILABLE");
			}
		}
	},

	_handleApproveRejectCallBack: function(sChannelId, sEventId, oData) {
		"use strict";
		// Select the next item
		var oItem = this.findItemByContextPath(this.oApplicationFacade._sNextDetailPath);
		if (oItem) {
			this.setListItem(oItem);
		} else {
			if (this.getList().getItems().length > 1) {
				this.selectFirstItem();
			} else {
				this.showEmptyView("DETAIL_TITLE", "NO_ITEMS_AVAILABLE");
			}
		}
		
		// Note 2286172
		// Set a filter on the master list, to hide the item that just was approved and trigger the master list filtering
		this.aRequestFilterList.push(oData.RequestId);
		this._applyClientSideSearch();
	},

	/**
	 * Get master data and bind items
	 * @return {void}
	 */
	_getData: function() {
		"use strict";
		var oList = this.getList(),
			oTemplate = oList.getItems()[0].clone(),
			mParameters = {},
			that = this;
		oList.bindItems("/LeaveRequestSet", oTemplate);
	},

	/**
	 *  Define header & footer options
	 *  @return {object} objHdrFtr Object header footer
	 */
	getHeaderFooterOptions: function() {
		"use strict";
		var objHdrFtr = {
			sI18NMasterTitle: "view.Master.title"
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
		 * @callback hcm.approve.leaverequest.view.S2~extHookChangeFooterButtons
		 * @param {object} Header Footer Object
		 * @return {object} Header Footer Object
		 */

		if (this.extHookChangeFooterButtons) {
			objHdrFtr = this.extHookChangeFooterButtons(objHdrFtr);
		}
		return objHdrFtr;

	},

	/**
	 * handler for list row swipe for approval
	 * @return {void}
	 */
	_handleListSwipe: function() {
		"use strict";
		var that = this;
		var oList = this.getList(),
			oSwipeListItem = oList.getSwipedItem(),
			oContext = oSwipeListItem.getBindingContext(),
			sOrigin = oContext.getProperty("SAP__Origin"),
			sRequestID = oContext.getProperty("RequestId"),
			iVersion = oContext.getProperty("Version"),
			sDecision = "PREPARE_APPROVE",
			sTextKey = "dialog.success.approve",
			mParameters = {};
		oList.swipeOut();
		var sPath = "ApplyLeaveRequestDecision?RequestId='" + sRequestID + "'&Version=" + iVersion + "&Comment=''" +
			"&Decision='" + sDecision + "'";
		mParameters.context = null;
		mParameters.success = function() {
			sap.ca.ui.message.showMessageToast(that.resourceBundle.getText(sTextKey));
			that.oDataModel.refresh(true);
		};
		mParameters.error = jQuery.proxy(this._onRequestFailed, this);
		this.oDataModel.read(sPath, mParameters);
	},

	/**
	 * Handler for service request failure
	 * @param  {object} oError error details
	 * @return {void}
	 */
	_onRequestFailed: function(oError) {
		"use strict";
		sap.ca.ui.message.showMessageBox({
			type: sap.ca.ui.message.Type.ERROR,
			message: oError.message,
			details: oError.response.body
		});
	}
});