sap.ui.define([
		"sap/ui/base/Object"
	], function (BaseObject) {
		"use strict";

		return BaseObject.extend("soapprove.controller.Employee", {
			/**
			 * Initialize for Employee
			 * @class
			 * @public
			 * @alias soapprove.controller.Employee
			 */
			constructor : function (oComponent) {
				this._oComponent = oComponent;
				this._oModel = oComponent.getModel();
			},
			
			/**
			 * Invoked to pop up an employee card when the link of person name is pressed.
			 * 
			 * @param {sap.ui.base.Event} aEvent for opening Employee Dialog.
			 * @public
			 */
			open : function (aEvent) {
				var sOrder = aEvent.getSource().getCustomData()[0].getValue();
				var sPath =  "/OrdersSet('" + sOrder + "')";
				var oOrder = this._oModel.getObject(sPath);
				this.oEmployeeModel = new sap.ui.model.json.JSONModel();
				var mEmployeeData = {
						pages: [
							{
								pageId: "employeePageId",
								header: "Employee Info",
								title: oOrder.PersonName,
								description: "Administrator",
								groups: [
									{
										heading: "Contact Details",
										elements: [
											{
												label: "Phone",
												value: oOrder.Phone,
												elementType: sap.m.QuickViewGroupElementType.phone
											},
											{
												label: "Email",
												value: oOrder.EmailAddress,
												emailSubject : 'Subject',
												elementType: sap.m.QuickViewGroupElementType.email
											},
											{
												label: "Mobile Tel",
												value: oOrder.Mobile,
												elementType: sap.m.QuickViewGroupElementType.mobile
											},
										]
									},
									{
										heading: "Company",
										elements: [
											{
												label: "Name",
												value: "Adventure Company"
											}
										]
									}
								]
							}
						]
					};
				
				this.oEmployeeModel.setData(mEmployeeData);
				
				if (!this._oQuickView) {
					this._oQuickView = sap.ui.xmlfragment("soapprove.view.EmployeeInfo", this);
				}
				
				this._oQuickView.setModel(this.oEmployeeModel);
				
				var oButton = aEvent.getSource();
				jQuery.sap.delayedCall(0, this, function () {
					this._oQuickView.openBy(oButton);
				});
				
			}
		});

	}
);