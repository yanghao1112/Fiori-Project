/*global location */
sap.ui.define([
		"soapprove/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"soapprove/util/formatter",
		"sap/ui/Device"
	], function (BaseController, JSONModel, formatter,Device) {
		"use strict";

		return BaseController.extend("soapprove.controller.Detail", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var oViewModel = new JSONModel({
					busy : false,
					delay : 0,
					lineItemListTitle : this.getResourceBundle().getText("detailLineItemTableHeading")
				});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				this.setModel(oViewModel, "ItemsSet");

				this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
				
				this.oDataModel = this.getOwnerComponent().getModel();
				
				this.isPhone = Device.system.phone;
				
				this.oDataManager = this.getOwnerComponent().oDataManager;
				
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler when the share by E-Mail button has been clicked
			 * @public
			 */
			onShareEmailPress : function () {
				var oViewModel = this.getModel("ItemsSet");

				sap.m.URLHelper.triggerEmail(
					null,
					oViewModel.getProperty("/shareSendEmailSubject"),
					oViewModel.getProperty("/shareSendEmailMessage")
				);
			},

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("ItemsSet"),
					oShareDialog = sap.ui.getCore().createComponent({
						name : "sap.collaboration.components.fiori.sharing.dialog",
						settings : {
							object :{
								id : location.href,
								share : oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});

				oShareDialog.open();
			},

			/**
			 * Updates the item count within the line item table's header
			 * @param {object} oEvent an event containing the total number of items in the list
			 * @private
			 */
			onListUpdateFinished : function (oEvent) {
				var sTitle,
					iTotalItems = oEvent.getParameter("total"),
					oViewModel = this.getModel("ItemsSet");

				// only update the counter if the length is final
				if (this.byId("lineItemsList").getBinding("items").isLengthFinal()) {
					if (iTotalItems) {
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
					} else {
						//Display 'Line Items' instead of 'Line items (0)'
						sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
					}
					oViewModel.setProperty("/lineItemListTitle", sTitle);
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
				var aUpdateData = [];
				var sOperationType = aEvent.getSource().getProperty("text");
				var sMessageSuccess = sOperationType + " " + this.getResourceBundle().getText("textSuccessfully");
				var oData = {
						"OperationType" : sOperationType,
						"SalesOrderNo" : this.selectedItem
				}

				aUpdateData.push(oData);
			
				this.getOwnerComponent().oDataManager.updateBlockReason(aUpdateData).then(
						function() {
							sap.m.MessageToast.show(sMessageSuccess,{
								animationDuration:6000
							});
							if(this.isPhone){
								sap.ui.core.UIComponent.getRouterFor(this).navTo("master", {}, false);
							}
							this._triggerMasterRefresh();
						}.bind(this)
					).catch(function (aOperationType) {
						this.getOwnerComponent().oDataManager.processError(aOperationType);
					}.bind(this)); 
		     },
		        
			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */

			/**
			 * Binds the view to the object path and expands the aggregated line items.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sObjectId;
				
				sObjectId = oEvent.getParameter("arguments").objectId;
				
				this.selectedItem = sObjectId;
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("OrdersSet", {
						SalesOrderNo :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			/**
			 * Binds the view to the object path. Makes sure that detail view displays
			 * a busy indicator while data for the corresponding element binding is loaded.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound to the view.
			 * @private
			 */
			_bindView : function (sObjectPath) {
				// Set busy indicator during view binding
				var oViewModel = this.getModel("ItemsSet");

				// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
				oViewModel.setProperty("/busy", false);

				this.getView().bindElement({
					path : sObjectPath,
					events: {
						change : this._onBindingChange.bind(this),
						dataRequested : function () {
							oViewModel.setProperty("/busy", true);
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},
			
			_onBindingChange : function () {
				var oView = this.getView(),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("detailObjectNotFound");
					// if object could not be found, the selection in the master list
					// does not make sense anymore.
					this.getOwnerComponent().oListSelector.clearMasterListSelection();
					return;
				}

				var sPath = oElementBinding.getPath(),
					oResourceBundle = this.getResourceBundle(),
					oObject = oView.getModel().getObject(sPath),
					sObjectId = oObject.ID,
					sObjectName = oObject.Name,
					oViewModel = this.getModel("ItemsSet");

				this.getOwnerComponent().oListSelector.selectAListItem(sPath);

				oViewModel.setProperty("/saveAsTileTitle",oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
				oViewModel.setProperty("/shareOnJamTitle", sObjectName);
				oViewModel.setProperty("/shareSendEmailSubject",
					oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
					oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			},

			_onMetadataLoaded : function () {
				// Store original busy indicator delay for the detail view
				var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
					oViewModel = this.getModel("ItemsSet"),
					oLineItemTable = this.byId("lineItemsList"),
					iOriginalLineItemTableBusyDelay = oLineItemTable.getBusyIndicatorDelay();

				// Make sure busy indicator is displayed immediately when
				// detail view is displayed for the first time
				oViewModel.setProperty("/delay", 0);
				oViewModel.setProperty("/lineItemTableDelay", 0);

				oLineItemTable.attachEventOnce("updateFinished", function() {
					// Restore original busy indicator delay for line item table
					oViewModel.setProperty("/lineItemTableDelay", iOriginalLineItemTableBusyDelay);
				});

				// Binding the view will set it to not busy - so the view is always busy if it is not bound
				oViewModel.setProperty("/busy", true);
				// Restore original busy indicator delay for the detail view
				oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
			},
			
			/**
			 * Trigger event when button "Approve" and "Reject" pressed
			 * @function
			 * @param none.
			 * @private
			 */
			_triggerMasterRefresh : function(){
				"use strict";
				var oEventBus = sap.ui.getCore().getEventBus();
				oEventBus.publish("soapprove", "afterApproveReject");
			},
		});

	}
);