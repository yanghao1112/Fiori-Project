/*global history */
sap.ui.define([
		"soapprove/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/GroupHeaderListItem",
		"sap/ui/Device",
		"soapprove/util/formatter",
		"soapprove/util/DataManager"
	], function (BaseController, JSONModel, History, Filter, FilterOperator, GroupHeaderListItem, Device, formatter) {
		"use strict";

		return BaseController.extend("soapprove.controller.Master", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
			 * @public
			 */
			onInit : function () {
				// Control state model
				var oList = this.byId("list"),
					oViewModel = this._createViewModel(),
					// Put down master list's original value for busy indicator delay,
					// so it can be restored later on. Busy handling on the master list is
					// taken care of by the master list itself.
					iOriginalBusyDelay = oList.getBusyIndicatorDelay();

				/*this._oGroupSortState = new GroupSortState(oViewModel, grouper.groupUnitNumber(this.getResourceBundle()));*/

				this._oList = oList;
				// keeps the filter and search state
				this._oListFilterState = {
					aFilter : [],
					aSearch : []
				};
				
				this.flag = true;				
				
				this.setModel(oViewModel, "Orders");
				// Make sure, busy indication is showing immediately so there is no
				// break after the busy indication for loading the view's meta data is
				// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
				oList.attachEventOnce("updateFinished", function(){
					// Restore original busy indicator delay for the list
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
					
				});

				this.getView().addEventDelegate({
					onBeforeFirstShow: function () {
						this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
					}.bind(this)
				});

				this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
				this.getRouter().attachBypassed(this.onBypassed, this);
				this.oDataModel = this.getOwnerComponent().getModel();
				
				var oEventBus = sap.ui.getCore().getEventBus();
				oEventBus.subscribe("soapprove", "afterApproveReject",function(){
					this.onRefresh();
        		},this);
				
				this.oDataManager = this.getOwnerComponent().oDataManager;
				
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * After list data is available, this handler method updates the
			 * master list counter and hides the pull to refresh control, if
			 * necessary.
			 * @param {sap.ui.base.Event} oEvent the update finished event
			 * @public
			 */
			onUpdateFinished : function (oEvent) {
				// update the master list object counter after new data is loaded
				this._updateListItemCount(oEvent.getParameter("total"));
				// hide pull to refresh if necessary
				this.byId("pullToRefresh").hide();
				// reset tilte
				var iCount = oEvent.getParameter("total");
				var title = "Sales Orders" + "(" + iCount + ")";
				this.getView().byId("page").setTitle(title);
				if(this.getView().byId("list").getItems().length > 0){
					var sObjectId = this.getView().byId("list").getItems()[0].getCustomData()[0].getValue();
					if(!Device.system.phone){
						this.getRouter().navTo("object", {
							objectId: sObjectId
						}, !Device.system.phone);
					}
				}
			},

			/**
			 * Event handler for the master search field. Applies current
			 * filter value and triggers a new search. If the search field's
			 * 'refresh' button has been pressed, no new search is triggered
			 * and the list binding is refresh instead.
			 * @param {sap.ui.base.Event} oEvent the search event
			 * @public
			 */
			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
					// Search field's 'refresh' button has been pressed.
					// This is visible if you select any master list item.
					// In this case no new search is triggered, we only
					// refresh the list binding.
					this.onRefresh();
					return;
				}

				var sQuery = oEvent.getParameter("query");

				if (sQuery) {
					this._oListFilterState.aSearch = [new Filter("SalesOrderNo", FilterOperator.Contains, sQuery)];
				} else {
					this._oListFilterState.aSearch = [];
				}
				this._applyFilterSearch();

			},

			/**
			 * Event handler for refresh event. Keeps filter, sort
			 * and group settings and refreshes the list binding.
			 * @public
			 */
			onRefresh : function () {
				this._oList.getBinding("items").refresh();
			},
					
			/**
			 * Event handler for the list selection event
			 * @param {sap.ui.base.Event} oEvent the list selectionChange event
			 * @public
			 */
			onSelectionChange : function (oEvent) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				/*this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());*/
			},

			/**
			 * Event handler for the bypassed event, which is fired when no routing pattern matched.
			 * If there was an object selected in the master list, that selection is removed.
			 * @public
			 */
			onBypassed : function () {
				this._oList.removeSelections(true);
			},

			/**
			 * Used to create GroupHeaders with non-capitalized caption.
			 * These headers are inserted into the master list to
			 * group the master list's items.
			 * @param {Object} oGroup group whose text is to be displayed
			 * @public
			 * @returns {sap.m.GroupHeaderListItem} group header with non-capitalized caption.
			 */
			createGroupHeader : function (oGroup) {
				return new GroupHeaderListItem({
					title : oGroup.text,
					upperCase : false
				});
			},

			/**
			 * Event handler for navigating back.
			 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
			 * If not, it will navigate to the shell home
			 * @public
			 */
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash(),
					oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

				if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
					history.go(-1);
				} else {
					oCrossAppNavigator.toExternal({
						target: {shellHash: "#Shell-home"}
					});
				}
			},
			
			/**
			 * Event handler for pressing person name.
			 * Pop up employee info card when link person name is pressed to display employee information
			 * @param {sap.ui.base.Event} oEvent of link pressing
			 * @public
			 */
			onPersonPress : function(aEvent) {
				this.getOwnerComponent().openEmployee(aEvent);
			},
			
			/**
			 * Event handler for Approve and Reject process.
			 * Update Block Reason when button "Approve" or "Reject" is pressed
			 * @param {sap.ui.base.Event} oEvent of button pressing
			 * @public
			 */
			onButtonPress : function(aEvent) {
				"use strict";

				var sOrder;
				var oUpdateItem = {};
				var aUpdateData = [];
				var sOperationType = aEvent.getSource().getProperty("text");
				var oSelectedItems = this.getView().byId("list").getSelectedItems();
				var sMessageSuccess = sOperationType + " " + this.getResourceBundle().getText("textSuccessfully");
				$.each(oSelectedItems, function(idx, item) {
					sOrder = item.getCustomData()[0].getProperty("value");
					oUpdateItem = {
							"OperationType" : sOperationType,
							"SalesOrderNo" : sOrder
					}
					aUpdateData.push(oUpdateItem);
				})
				
				this.getOwnerComponent().oDataManager.updateBlockReason(aUpdateData).then(
						function() {
							sap.m.MessageToast.show(sMessageSuccess,{
								animationDuration:6000
							});
							this.onRefresh();
						}.bind(this)
					).catch(function (aOperationType) {
						this.getOwnerComponent().oDataManager.processError(aOperationType);
					}.bind(this)); 
		     },
		     
		     /**
				 * Event handler for navigating.
				 * Process when item selected on master page
				 * @param {sap.ui.base.Event} oEvent of item selecting
				 * @public
				 */
		     onNavigate: function(oEvent) {
		    	 this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
		     },
		     
		     /**
				 * Event handler for process when button "Approve List" is pressed.
				 * Display Approve and Reject button and make the list multiselectable on master page
				 * @param {sap.ui.base.Event} oEvent of button pressing
				 * @public
				 */
		     onEdit: function() {
		    	 this._oList.setMode(sap.m.ListMode.MultiSelect);
		    	 var items = this._oList.getAggregation("items");
		    	 items.forEach(function(currentValue, index, arr){
		    		 currentValue.setType(sap.m.ListType.Inactive);
		    		 currentValue.getAggregation("content")[0].addStyleClass("sapUiSmallMarginEnd")
		    	 });
					
		    	 this.getView().byId("Edit").setVisible(false);
		    	 this.getView().byId("Return").setVisible(true);
		    	 this.getView().byId("Approve").setVisible(true);
		    	 this.getView().byId("Reject").setVisible(true);
			},
				
		     /**
			 * Event handler for process when button "Back" is pressed.
			 * Hide Approve and Reject button and make the list cannot be multiselectable on master page
			 * @param {sap.ui.base.Event} oEvent of button pressing
			 * @public
			 */
			onReturn: function() {
				this._oList.setMode(sap.m.ListMode.None);
				var items = this._oList.getAggregation("items");
				items.forEach(function(currentValue, index, arr){
					currentValue.setType(sap.m.ListType.Navigation);
					currentValue.getAggregation("content")[0].removeStyleClass("sapUiSmallMarginEnd")
				});

				this.getView().byId("Edit").setVisible(true);
				this.getView().byId("Return").setVisible(false);
				this.getView().byId("Approve").setVisible(false);
				this.getView().byId("Reject").setVisible(false);
			},
			
			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			_createViewModel : function() {
				return new JSONModel({
					isFilterBarVisible: false,
					filterBarLabel: "",
					delay: 0,
					title: this.getResourceBundle().getText("masterTitleCount", [0]),
					noDataText: this.getResourceBundle().getText("masterListNoDataText"),
					sortBy: "Name",
					groupBy: "None"
				});
			},

			/**
			 * If the master route was hit (empty hash) we have to set
			 * the hash to to the first item in the list as soon as the
			 * listLoading is done and the first item in the list is known
			 * @private
			 */
			
			/**
			 * If the master route was hit (empty hash) we have to set
			 * the hash to to the first item in the list as soon as the
			 * listLoading is done and the first item in the list is known
			 * @private
			 */
			_onMasterMatched: function() {
				this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(
					function(mParams) {
						var sObjectId = mParams.firstListitem.getBindingContext().getProperty("SalesOrderNo");
						if (Device.system.phone) {
							this.getOwnerComponent().oListSelector.selectAListItem(sObjectId);
						} else {
							this.getRouter().navTo("object", {
								objectId: sObjectId
							}, !Device.system.phone);
						}
					}.bind(this),
					function() {
						if (Device.system.phone) {
							return;
						}
						this.getRouter().navTo("object", {
							objectId: 0
						}, !Device.system.phone);
					}.bind(this)
				);
			},

			/**
			 * Shows the selected item on the detail page
			 * On phones a additional history entry is created
			 * @param {sap.m.ObjectListItem} oItem selected Item
			 * @private
			 */
			_showDetail : function (oItem) {
				var bReplace = !Device.system.phone;
				this.getRouter().navTo("object", {
					objectId : oItem.getBindingContext().getProperty("SalesOrderNo")
				}, bReplace);
			},

			/**
			 * Sets the item count on the master list header
			 * @param {integer} iTotalItems the total number of items in the list
			 * @private
			 */
			_updateListItemCount : function (iTotalItems) {
				var sTitle;
				// only update the counter if the length is final
				if (this._oList.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("masterTitleCount", [iTotalItems]);
					this.getModel("Orders").setProperty("/title", sTitle);
				}
			},

			/**
			 * Internal helper method to apply both filter and search state together on the list binding
			 * @private
			 */
			_applyFilterSearch : function () {
				var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
					oViewModel = this.getModel("Orders");
				this._oList.getBinding("items").filter(aFilters, "Application");
				// changes the noDataText of the list in case there are no filter results
				if (aFilters.length !== 0) {
					oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
				} else if (this._oListFilterState.aSearch.length > 0) {
					// only reset the no data text to default when no new search was triggered
					oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
				}
			},

			/**
			 * Internal helper method to apply both group and sort state together on the list binding
			 * @param {sap.ui.model.Sorter[]} aSorters an array of sorters
			 * @private
			 */
			_applyGroupSort : function (aSorters) {
				this._oList.getBinding("items").sort(aSorters);
			},

			/**
			 * Internal helper method that sets the filter bar visibility property and the label's caption to be shown
			 * @param {string} sFilterBarText the selected filter value
			 * @private
			 */
			_updateFilterBar : function (sFilterBarText) {
				var oViewModel = this.getModel("Orders");
				oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
				oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
			}


		});

	}
);