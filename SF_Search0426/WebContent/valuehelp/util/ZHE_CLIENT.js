sap.ui.define([ 
	"sap/ui/base/Object",
	"../../util/InternalPromise"
], function(BaseObject, InternalPromise) {
	"use strict";
	let oValueHelpDialog = null;
	let oFilterBar = null;
	let oResultTable = null;
	let oTemplate = null;
	let oSearchModel = null;
	let oResultModel = null;
	let oSelectedItems = null;
//	let bIsInitialized = false;
	let oInternalPromise = null;
	let oAdditionalFilter = [];

	let oZHE_CLIENT = BaseObject.extend(
			"sap.pwaa.valuehelp.util.ZHE_CLIENT", {

		/* =========================================================== */
		/* public methods                                     */
		/* =========================================================== */
		
		/**
		 * Open the dialog
		 * Return a Promise
		 * When select one record from list, Promise will be resolved
		 * When close the dialog, Promise will be rejected
		 * @private
		 */
		open : function(aFilterArray) {
			"use strict";

			oInternalPromise = new InternalPromise();
			oSelectedItems = {};
			oAdditionalFilter = aFilterArray;
//			if (bIsInitialized === false) {
////				initialize();
//			} else {
			clearConditions();
			clearTable();
//			}

			oValueHelpDialog.open();
			oValueHelpDialog.update();

			return oInternalPromise.Promise;
		},
		
		/**
		 * Initialize the value help dialog
		 * Call internal method "_initialize"
		 * @private
		 */
		initialize: _initialize,

	});

	/* =========================================================== */
	/* internal methods											   */
	/* =========================================================== */
	
	/**
	 * Initialize the value help dialog
	 * 1.Create the dialog UI
	 * 2.Set the i18n Model
	 * 3.Set the search option model
	 * @private
	 */
	function _initialize(aData) {

//		bIsInitialized = true;
		/* Create table line template */
		oTemplate = new sap.m.ColumnListItem({
			customData : [ new sap.ui.core.CustomData({
				key : "client",
				value : "{result>}"
			}) ],
			cells : [  new sap.m.ObjectIdentifier({
				title : "{result>clientCode}"
			}), new sap.m.ObjectIdentifier({
				title : "{result>clientName}"
			}) ]

		});

		/* Create ValueHelpDialog */
		oValueHelpDialog = sap.ui.xmlfragment(
				"sap.pwaa.valuehelp.view.ZHE_CLIENT_VH", this);

		/* Create FilterBar */
		oFilterBar = sap.ui.getCore().byId("ZHE_CLIENT_FB");
//		 oFilterBar.setBasicSearch(new sap.m.SearchField({
//		 value: "{search>/Zfreetext}",
//		 showSearchButton: false
//		 }));

		oFilterBar.attachSearch(onSearch);
		oFilterBar.attachClear(onClear);

		/* Create Result Table */
		oResultTable = sap.ui.xmlfragment(
				"sap.pwaa.valuehelp.view.ZHE_CLIENT_RT", this);

		/* Add Result Table to Value Help Dialog */
		oValueHelpDialog.setTable(oResultTable);

		oValueHelpDialog.attachSelectionChange(onSelect);
		oValueHelpDialog.attachCancel(onCancel);

		/* Initialize models */
		oSearchModel = new sap.ui.model.json.JSONModel();
		oResultModel = new sap.ui.model.json.JSONModel(aData);
		oFilterBar.setModel(oSearchModel, "search");
		oResultTable.setModel(oResultModel, "result");

		/* set device model */
		let deviceModel = new sap.ui.model.json.JSONModel({
			isTouch : sap.ui.Device.support.touch,
			isNoTouch : !sap.ui.Device.support.touch,
			isPhone : sap.ui.Device.system.phone,
			isNoPhone : !sap.ui.Device.system.phone,
			listMode : sap.ui.Device.system.phone ? "None"
					: "SingleSelectMaster",
			listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive",
			singlePerson : true
		});

		/* set i18n model */
		let sRootPath = jQuery.sap.getModulePath("sap.pwaa.valuehelp");
		let i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [ sRootPath, "i18n/i18n.properties" ].join("/")
		});

		deviceModel.setDefaultBindingMode("OneWay");
		oFilterBar.setModel(deviceModel, "device");
		oResultTable.setModel(deviceModel, "device");

		oFilterBar.setModel(i18nModel, "i18n");
		oResultTable.setModel(i18nModel, "i18n");
	}
	
	/**
	 * Clear data in search option model
	 * @private
	 */
	function clearConditions() {
		"use strict";
		oSearchModel.setData({
			clientCode : "",
			clientName : ""
		});
	}

	/**
	 * Clear data in table
	 * @private
	 */
	function clearTable() {
		oResultTable.bindItems({
			template : oTemplate,
			path : "null>/"
		});
	}

	/**
	 * The method is called when Search button is pressed
	 * Search data according to search option
	 * @private
	 */
	function onSearch(aEvent) {
		"use strict";
		let condArray = [];
		let oFilters = null;
		let oConds = {
			"clientCode" : [],
			"clientName" : []
		}

		/* generate conditions for each field */
		$.each(oSearchModel.getData(), function(aKey, aVal) {
			if (aVal !== "") {
				oConds[aKey].push(new sap.ui.model.Filter(aKey, "Contains",
						aVal));
			}

		});

		/* merge conditions for each field */
		$.each(oConds, function(aKey, aVal) {
			if (oConds[aKey].length > 0) {
				condArray.push(new sap.ui.model.Filter({
					filters : oConds[aKey],
					and : false
				}));
			}
		});
		
		/* merge all conditions */
		condArray = condArray.concat(oAdditionalFilter);
		if (condArray.length > 0) {
			oFilters = new sap.ui.model.Filter({
				filters : condArray,
				and : true
			})
		}

		oResultTable.bindItems({
			path : "result>/",
			template : oTemplate,
			filters : oFilters
		});

	}

	/**
	 * The method is called when select one record from result table
	 * @private
	 */
	function onSelect(aEvent) {
		"use strict";
		let oSelected = aEvent.getParameter("tableSelectionParams").listItem
				.getCustomData();
		let oRet = {};

		jQuery.each(oSelected, function(aKey, aValue) {
			oRet[aValue.getKey()] = aValue.getValue();
		});

		oValueHelpDialog.close();
		oInternalPromise.resolvePromise(oRet);

	}

	/**
	 * The method is called when ok button press
	 * Search the result
	 * @private
	 */
	function onOk(aEvent) {
		"use strict";
		let oRet = [];
		let oSelectedData = null;

		$.each(oSelectedItems, function(aKey, aValue) {
			oSelectedData = {};
			$.each(aValue.getCustomData(), function(aKey2, aValue2) {
				oSelectedData[aValue2.getKey()] = aValue2.getValue();
			});
			oRet.push(oSelectedData);
		});

		oValueHelpDialog.close();
		oInternalPromise.resolvePromise(oRet);
	}

	/**
	 * The method is called when Clear button press
	 * Clear search option
	 * @private
	 */
	function onClear(aEvent) {
		"use strict";
		clearConditions();
	}

	/**
	 * The method is called when Cancel button press
	 * Close the dialog
	 * @private
	 */
	function onCancel(aEvent) {
		"use strict";
		oValueHelpDialog.close();
		oInternalPromise.rejectPromise();
	}

	return oZHE_CLIENT;
});