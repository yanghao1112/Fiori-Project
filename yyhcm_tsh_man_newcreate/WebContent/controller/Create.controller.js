/*global location */
sap.ui.define([
		"soreturn/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"soreturn/util/formatter",
		"soreturn/util/DataManager"
	], function (BaseController, JSONModel, formatter,DataManager) {
		"use strict";

		return BaseController.extend("soreturn.controller.Create", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			onInit : function () {
				
				this.oDataModel = this.getOwnerComponent().getModel();
                this.oDataModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
				this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */
			/**
			 * Event handler for "Save" button pressed.
			 * Create a new entry 
			 * @public
			 */
			onSave : function (oEvent) {
				var oData = this.oDataModel.getObject(this.context.getPath());
				
				var aData = {
					Audat : oData.Audat,
					Kwmeng : oData.Kwmeng,
					Bezei : oData.Bezei,
					Text : oData.Text,
					Matnr : oData.Matnr,
					Augru : oData.Augru,
					Vgbel : oData.Vgbel
				}			
				this.getOwnerComponent().oDataManager.createReturnOrder(aData).then(
							function(aData) {
								sap.m.MessageToast.show(this.oBundle.getText("successText",aData.Vbeln),{
									animationDuration:6000
								});
								this.onNavBack();
							}.bind(this)
						).catch(function (aError){
							this.getOwnerComponent().oDataManager.processError(aError);
						}.bind(this)); 
			},
			
			/**
			 * Event handler for "Cancel" button pressed.
			 * Back to last page
			 * @public
			 */
			onCancel : function (oEvent) {
				window.history.go(-1);
			},
			
			/**
			 * Event handler for NavBack button pressed.
			 * Back to last page
			 * @public
			 */
			onNavBack: function(oEvent) {
				window.history.go(-1);
			},

			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */
			
			/**
			 * Process for metadata loaded
			 * Bind element on screen
			 * @private
			 */
			_onMetadataLoaded : function () {
				
				this.context = this.getOwnerComponent().getModel().createEntry("/OrderInfSet");
                this.getView().bindElement(this.context.getPath());
			},
			
			ZDate : sap.ui.model.SimpleType.extend("ZDate", {
				constructor : function () {
					this.oDate = new sap.ui.model.type.Date(arguments[0],arguments[1]);
					this.dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern : 'yyyy-MM-dd',
						strictParsing : true,
						UTC : true
					});
				},
				
				formatValue: function (aValue, aInternalType) {
					return this.dateFormat.format(aValue);
				},
				parseValue: function (aValue, aSourceType) {
					return this.dateFormat.parse(aValue);
		        },
		        validateValue: function (aValue) {
		        	return this.oDate.validateValue(aValue);
		        }
			})

		});

	}
);