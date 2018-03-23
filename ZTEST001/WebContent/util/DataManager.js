/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(BaseObject) {
	"use strict";

	return BaseObject.extend("soapprove.util.DataManager", {

			constructor: function(aComponent) {
				this.oDataModel = aComponent.getModel();
				this.oBundle = aComponent.getModel("i18n").getResourceBundle();
			},

			processError: function(aOperationType) {
				var sMessage = aOperationType + " " + this.oBundle.getText("textFaield"),
				    sMessageDetails = this.oBundle.getText("errorText"),
				    oMessage = {
						message: sMessage,
						details: sMessageDetails,
						type: sap.m.MessageBox.Icon.ERROR
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
			
			updateBlockReason: function(aData,aSuccess){
				
				var oSelf = this,
					sUrl = "/OrdersSet(SalesOrderNo='$1')/",
					sOperationType = aData[0].OperationType;
					
				/*this.oDataModel.setUseBatch(true);*/
				
				var oUpdateFinished = new Promise(function(fnResolve, fnReject) {
					var oSelf =this;
					var mParameters = {
				            "groupId": "changes",
				            "changeSetId": "changes",
				            "merge": ""
				        };
					var mParameters2 = {
							"groupId": "changes",
							"changeSetId": "changes",
							"merge": "", 
							success: function (aData) {
								fnResolve();
							},
							error: function (aError) {
								fnReject(sOperationType);
							}
					};
					
					$.each(aData, function(idx, item) {
						this.oDataModel.update(sUrl.replace("$1", item.SalesOrderNo),item,mParameters);
					}.bind(this));

					this.oDataModel.submitChanges(mParameters2);
				}.bind(this));
				
				return oUpdateFinished;				
			}

	});
});