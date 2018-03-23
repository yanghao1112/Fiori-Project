/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("hcm.myleaverequest.utils.ConcurrentEmployment");
jQuery.sap.require("hcm.myleaverequest.utils.DataManager");
/*global hcm:true */
hcm.myleaverequest.utils.ConcurrentEmployment = {

	getCEEnablement: function(self, successHandler) {
		var that = this;
		if (that.iAmAlreadyCalled === false) {
			that.iAmAlreadyCalled = true;
		} else {
			//this is to handle consecutive call when history is refreshed
			that.secondSuccessHandler = successHandler;
			return;
		}

		this.initialize(self, successHandler);
		var oModel = new sap.ui.model.json.JSONModel();
		hcm.myleaverequest.utils.DataManager.getPersonellAssignments(self, function(data) {
			if (data.length > 1) {
				oModel.setData(data);
				self.oCEForm.setModel(oModel);
				self.oCEDialog.open();
			} else {
				self.oApplication.pernr = data[0].Pernr;
				hcm.myleaverequest.utils.UIHelper.setPernr(data[0].Pernr);
				successHandler();
				if (that.secondSuccessHandler) {
					that.secondSuccessHandler();
					that.secondSuccessHandler = null;
				}
			}
		});
	},
	initialize: function(self, successHandler) {
		var that = this;
		this.setControllerInstance(self);
		var itemTemplate = new sap.m.RadioButton({
			text: "{AssignmentText}",
			//key: "{Pernr}"
			customData: new sap.ui.core.CustomData({
				"key": "Pernr",
				"value": "{Pernr}"
			})
		});
		self.oCESelect = new sap.m.RadioButtonGroup().bindAggregation("buttons", "/", itemTemplate);
		self.oCEForm = new sap.ui.layout.form.Form({
			maxContainerCols: 2,
			class: "sapUiLargeMarginTopBottom",
			layout: new sap.ui.layout.form.ResponsiveGridLayout({
				labelSpanL: 12,
				//emptySpanL: 0,
				labelSpanM: 12,
				//emptySpanM: 2,
				labelSpanS: 12,
				columnsL: 2,
				columnsM: 2
			}),
			formContainers: new sap.ui.layout.form.FormContainer({
				formElements: [
                                       new sap.ui.layout.form.FormElement({
						label: new sap.m.Label({
							text: self.resourceBundle.getText("PERSONAL_ASSIGN")
						}),
						fields: self.oCESelect
					})
                               ]
			})
		});

		self.oCEDialog = new sap.m.Dialog({
			title: self.resourceBundle.getText("PERSONAL_ASSIGN_TITLE"),
			class: "sapUiContentPadding sapUiLargeMarginTopBottom",
			content: self.oCEForm,
			buttons: [
			    new sap.m.Button({
					text: self.resourceBundle.getText("LR_OK"),
					press: function() {
						that.iAmAlreadyCalled = false;
						self.oCEDialog.close();
						self.oCEDialog.Cancelled = false;
						self.oApplication.pernr = self.oCESelect.getSelectedButton().data().Pernr;
						hcm.myleaverequest.utils.UIHelper.setPernr(self.oApplication.pernr);
						successHandler();
						if (that.secondSuccessHandler) {
							that.secondSuccessHandler();
							that.secondSuccessHandler = null;
						}
					}
				}),
			    new sap.m.Button({
					text: self.resourceBundle.getText("LR_CANCEL"),
					press: function() {
						that.iAmAlreadyCalled = false;
						self.oCEDialog.close();
						self.oCEDialog.Cancelled = true;
						/*var oHistory = sap.ui.core.routing.History.getInstance();
                        var sPreviousHash = oHistory.getPreviousHash();
                        //The history contains a previous entry           
                            if (sPreviousHash !== undefined)*/
						/* eslint-disable sap-browser-api-warning */
						window.history.go(-1);
						/* eslint-enable sap-browser-api-warning */
						//}
					}
				})

			]
		});
		self.oCEDialog.attachAfterClose(function() {
			if (!self.oApplication.pernr && !self.oCEDialog.Cancelled) {
				self.oCEDialog.open();
			}
		});
	},
	setControllerInstance: function(me) {
		this.me = me;
	},

	getControllerInstance: function() {
		return this.me;
	}

};