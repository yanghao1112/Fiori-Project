sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/json/JSONModel",
	"../../util/InternalPromise"],
function(BaseObject, JSONModel, InternalPromise) {
	"use strict";
	let oFilterDialog = null;
	let bSelected = false;
	let oInternalPromise = null;

	let oZPO_ANALYSISFILTER = BaseObject.extend(
	"sap.pwaa.popup.util.ZPO_ANALYSISFILTER", {
		
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the object is created.
		 * 1.Create the dialog UI
		 * 2.Set the i18n Model
		 * 3.Set the selection option
		 * @public
		 */
		constructor: function(aModel) {

			oFilterDialog = sap.ui.xmlfragment(
					"sap.pwaa.popup.view.ZZFilter", this);

			oFilterDialog.setModel(aModel,"Parameter");
			oFilterDialog.setEscapeHandler(this.onEscape)
			
			/* set i18n model */
			let sRootPath = jQuery.sap.getModulePath("sap.pwaa.popup");
			let i18nModel = new sap.ui.model.resource.ResourceModel({
				bundleUrl : [ sRootPath, "i18n/i18n.properties" ].join("/")
			});

			oFilterDialog.setModel(i18nModel, "i18n");
			
			let oBundle = i18nModel.getResourceBundle();
			let oMemberAssigned = [];
			let oAnalysisGroup = [];
			oMemberAssigned.push({
				text: oBundle.getText("ZFAssignMemberAllOption"),
				key: "0",
				index: "0"
			},{
				text: oBundle.getText("ZFAssignMemberOwnerCompanyOption"),
				key: "1",
				index: "1"
			},{
				text: oBundle.getText("ZFAssignMemberOwnerBUOption"),
				key: "2",
				index: "2"
			},{
				text: oBundle.getText("ZFAssignMemberOwnerSectorOption"),
				key: "3",
				index: "3"
			});
			
			oAnalysisGroup.push({
				text: oBundle.getText("ZFAnalysisGroupLEPOption"),
				key: "0",
				index: "0"
			},{
				text: oBundle.getText("ZFAnalysisGroupLEMOption"),
				key: "1",
				index: "1"
			},{
				text: oBundle.getText("ZFAnalysisGroupProjectOption"),
				key: "2",
				index: "2"
			},{
				text: oBundle.getText("ZFAnalysisGroupEngagementOption"),
				key: "3",
				index: "3"
			});
			

			oFilterDialog.setModel(new JSONModel({
				MemberAssigned: oMemberAssigned,
				AnalysisGroup: oAnalysisGroup
			}), "FilterOption");
			
		},

		/* =========================================================== */
		/* public methods                                     */
		/* =========================================================== */
		
		/**
		 * Open the dialog
		 * set the selection to the model data
		 * @private
		 */
		open : function() {
			"use strict";
			let oModel = oFilterDialog.getModel("Parameter");
			oInternalPromise = new InternalPromise();
			oFilterDialog.open();
			oModel.updateBindings(true);
			return oInternalPromise.Promise;
		},
		
		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handling for clicking 'Esc' keyboard button
		 * Make the dialog can't be closed be press 'Esc'
		 * @public
		 */
		onEscape: function(aPromise) {
			aPromise.reject();
		},
		
		/**
		 * Event handling for clicking 'Save' button
		 * Set the selected option
		 * Close the dialog
		 * Resolve Promise
		 * @public
		 */
		onFilterOk: _onFilterOk,
		
		/**
		 * Event handling for clicking 'Cancel' button
		 * Close the dialog
		 * Reject Promise
		 * @public
		 */
		onFilterCancel: _onFilterCancel,
		
	});

	/* =========================================================== */
	/* internal methods											   */
	/* =========================================================== */
	
	/**
	 * Set the selected option
	 * Close the dialog
	 * Resolve Promise
	 * @private
	 */
	function _onFilterOk() {
		let oSelectedAssignMemberTypeData = sap.ui.getCore().byId("AssignMemberType").getSelectedButton().getCustomData();
		let oSelectedAnalysisGroupUnitData = sap.ui.getCore().byId("AnalysisGroupUnit").getSelectedButton().getCustomData();
		let oModel = oFilterDialog.getModel("Parameter")
		oModel.setProperty("/AssignMemberType",oSelectedAssignMemberTypeData[0].getValue())
		oModel.setProperty("/AssignMemberTypeText",oSelectedAssignMemberTypeData[1].getValue())
		oModel.setProperty("/AssignMemberTypeIndex",parseInt(oSelectedAssignMemberTypeData[2].getValue()))
		oModel.setProperty("/AnalysisGroupUnit",oSelectedAnalysisGroupUnitData[0].getValue())
		oModel.setProperty("/AnalysisGroupUnitText",oSelectedAnalysisGroupUnitData[1].getValue())
		oModel.setProperty("/AnalysisGroupUnitIndex",parseInt(oSelectedAnalysisGroupUnitData[2].getValue()))
		oFilterDialog.close();
		oInternalPromise.resolvePromise()
	}
	
	/**
	 * Close the dialog
	 * Reject Promise
	 * @private
	 */
	function _onFilterCancel() {
		oFilterDialog.close();
		oInternalPromise.rejectPromise()
	}
	
	return oZPO_ANALYSISFILTER;
});