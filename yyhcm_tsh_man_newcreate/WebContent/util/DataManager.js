/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(BaseObject) {
	"use strict";

	return BaseObject.extend("soreturn.util.DataManager", {

			constructor: function(aComponent) {
				this._nCounter = 0;
				this._busyDialog = new sap.m.BusyDialog();
				this.oDataModel = aComponent.getModel();
				this.oBundle = aComponent.getModel("i18n").getResourceBundle();
				//this.oDataModel.setUseBatch(false);
			},

			processError: function(aError) {
				
				var sMessage = "";
				var sMessageDetails = "";
				var oSelf = this;
				if (aError.responseText) {
					var oBody = aError.responseText;
					try {
						oBody = JSON.parse(oBody);
						if (oBody.error.innererror && oBody.error.innererror.errordetails) {

							var oErrors = oBody.error.innererror.errordetails;
							for (var i = 0; i < oErrors.length; i++) {
								sMessageDetails += oErrors[i].code + " : " + oErrors[i].message + "\n";
							}
							sMessage = this.oBundle.getText("ZF_NUMBEROFERROR",oErrors.length);

						}
						if (sMessageDetails === "") {
							sMessage = oBody.error.code + " : " + oBody.error.message.value;
						}
						
					} catch (e) {
						jQuery.sap.log.warning("Could parse the response", ["parseError"], ["soreturn"]);
					}
				}
				if (sMessage === "") {
					sMessage = this.oBundle.getText("INTERNAL_ERROR");
				}
				if (sMessageDetails === "") {
					sMessageDetails = this.oBundle.getText("INTERNAL_ERROR_BODY");
				}
				var oMessage = {
					message: sMessage,
					details: sMessageDetails,
					type: sap.m.MessageBox.Icon.ERROR
					/* 	type: sap.ca.ui.message.Type.ERROR*/
				};
				
				setTimeout(function(){
					sap.m.MessageBox.show(
						oMessage.message, {
							icon: oMessage.type,
							title: "Error",
							actions: [sap.m.MessageBox.Action.OK],
							details: oMessage.details,
							onClose: function(oAction) {}
						}
					);
				},300)
			},
			
			createReturnOrder: function(aData){
				
				var sPath = "/OrderInfSet";
				this._showBusy();
				
				var oCreateFinished = new Promise(function(fnResolve, fnReject) {
					var oSelf =this;	
					var mParameters = {
						//groupId : "changes",
						success: function(aData) {
							oSelf._hideBusy(true);
							fnResolve(aData);
						},
						error: function(aError) {
							oSelf._hideBusy(true);
							fnReject(aError);
						}
					}
					//this.oDataModel.create(sPath,aData,mParameters);
					this.oDataModel.submitChanges(mParameters);
				}.bind(this));
				
				return oCreateFinished;
			},
					
			/**
			 * set the screen in busy status
			 * @private
			 */
			_showBusy: function() {
				"use strict";
				this._nCounter++;
				if (this._nCounter === 1) {
					this._busyDialog.open();
				}
			},

			/**
			 * relieve busy status of screen
			 * @private
			 */
			_hideBusy: function(aForceHide) {
				"use strict";
				if (this._nCounter === 0) {
					return;
				}
				this._nCounter = aForceHide ? 0 : Math.max(0,
					this._nCounter - 1);
				if (this._nCounter > 0) {
					return;
				}
				this._busyDialog.close();
			}

	});
});