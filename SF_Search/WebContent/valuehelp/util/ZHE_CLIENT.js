sap.ui.define([ "sap/ui/base/Object" ], function(BaseObject) {
	"use strict";
	var oValueHelpDialog = null;
	var oFilterBar = null;
	var oResultTable = null;
	var oTemplate = null;
	var oSearchModel = null;
	var oResultModel = null;
	var oSelectedItems = null;
	var bIsInitialized = false;
	var sServiceUrl = "/";
	var oDeferred = null;

	var oZHE_CLIENT = BaseObject.extend(
			"sap.ui.demo.wt.valuehelp.util.ZHE_CLIENT", {

				/* =========================================================== */
				/* lifecycle methods */
				/* =========================================================== */

				open : function() {
					"use strict";

					oDeferred = jQuery.Deferred();
					oSelectedItems = {};

					if (bIsInitialized === false) {
						initialize();
					} else {
						clearConditions();
						clearTable();
					}

					oValueHelpDialog.open();
					oValueHelpDialog.update();

					return oDeferred;
				},
				initialize: initialize,

			});

	// var fnCreateSingleSearchHelp = _getSearchHelpCreation(_createSearchHelp);

	function initialize() {

		bIsInitialized = true;
		/* Create table line template */
		oTemplate = new sap.m.ColumnListItem({
			customData : [ new sap.ui.core.CustomData({
				key : "Pernr",
				value : "{result>}"
			}) ],
			cells : [ new sap.m.Image({
				src : "{result>Image}",
				densityAware : false,
				height : "60px"
			}), new sap.m.ObjectIdentifier({
				title : "{result>Type}"
			}), new sap.m.ObjectIdentifier({
				title : "{result>Name}"
			}), new sap.m.ObjectIdentifier({
				title : "{result>Orgtx}"
			}) ]

		});

		/* Create ValueHelpDialog */
		oValueHelpDialog = sap.ui.xmlfragment(
				"sap.ui.demo.wt.valuehelp.view.ZHE_CLIENT_VH", this);

		/* Create FilterBar */
		oFilterBar = sap.ui.getCore().byId("ZHE_CLIENT_FB");
		// oFilterBar.setBasicSearch(new sap.m.SearchField({
		// value: "{search>/Zfreetext}",
		// showSearchButton: false
		// }));

		oFilterBar.attachSearch(onSearch);
		oFilterBar.attachClear(onClear);

		/* Create Result Table */
		oResultTable = sap.ui.xmlfragment(
				"sap.ui.demo.wt.valuehelp.view.ZHE_CLIENT_RT", this);

		/* Add Result Table to Value Help Dialog */
		oValueHelpDialog.setTable(oResultTable);

		oValueHelpDialog.attachSelectionChange(onSelect);
		oValueHelpDialog.attachCancel(onCancel);

		/* Initialize models */
		oSearchModel = new sap.ui.model.json.JSONModel();
		oResultModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		oFilterBar.setModel(oSearchModel, "search");
		oResultTable.setModel(oResultModel, "result");

		/* set device model */
		var deviceModel = new sap.ui.model.json.JSONModel({
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
		var sRootPath = jQuery.sap.getModulePath("sap.ui.demo.wt.valuehelp");
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : [ sRootPath, "i18n/i18n.properties" ].join("/")
		});

		deviceModel.setDefaultBindingMode("OneWay");
		oFilterBar.setModel(deviceModel, "device");
		oResultTable.setModel(deviceModel, "device");

		oFilterBar.setModel(i18nModel, "i18n");
		oResultTable.setModel(i18nModel, "i18n");
	}
	/* Clear all conditions */
	function clearConditions() {
		"use strict";
		oSearchModel.setData({
			Pernr : "",
			Orgtx : "",
			Ename : "",
			Zlname : "",
			Zfname : "",
			ZtsMaCd : "",
			ZtsTx : "",
			Zfreetext : ""
		});
	}

	/* Clear table entries */
	function clearTable() {
		oResultTable.bindItems({
			template : oTemplate,
			path : "null>/"
		});
		// oResultTable.unbindObject("result");
		// oResultTable.getAggregation("items").bindObject({
		// path : "result>/ZClientList",
		// model: oResultModel
		// })
		// oResultTable.setModel(null, "result");
	}

	/* Search Button Press Event */
	function onSearch(aEvent) {
		"use strict";
		var condArray = [];
		var oFilters = null;
		var oConds = {
			"Pernr" : [],
			"Ename" : [],
			"Orgtx" : [],
			"Zfname" : [],
			"Zlname" : [],
			"ZtsMaCd" : [],
			"ZtsTx" : [],
			"Zfreetext" : []
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
		if (condArray.length > 0) {
			oFilters = new sap.ui.model.Filter({
				filters : condArray,
				and : true
			})
		}

		oResultTable.bindItems({
			path : "result>/ZClientList",
			template : oTemplate,
			filters : oFilters
		});
		// oResultTable.setModel(oResultModel, "result");
		// oResultTable.bindObject({
		// path : "/",
		// model: "result"
		// })
		// oResultTable.unbindAggregation("items");

	}

	/* Select Table Item Event */
	function onSelect(aEvent) {
		"use strict";
		var oSelected = aEvent.getParameter("tableSelectionParams").listItem
				.getCustomData();
		var oRet = {};

		jQuery.each(oSelected, function(aKey, aValue) {
			oRet[aValue.getKey()] = aValue.getValue();
		});

		oValueHelpDialog.close();
		oDeferred.resolve(oRet);

	}

	/* Clear Button Press Event */
	function onOk(aEvent) {
		"use strict";
		var oRet = [];
		var oSelectedData = null;

		$.each(oSelectedItems, function(aKey, aValue) {
			oSelectedData = {};
			$.each(aValue.getCustomData(), function(aKey2, aValue2) {
				oSelectedData[aValue2.getKey()] = aValue2.getValue();
			});
			oRet.push(oSelectedData);
		});

		oValueHelpDialog.close();
		oDeferred.resolve(oRet);
	}

	/* Clear Button Press Event */
	function onClear(aEvent) {
		"use strict";
		clearConditions();
	}

	/* Cancel Button Press Event */
	function onCancel(aEvent) {
		"use strict";
		oValueHelpDialog.close();
		oDeferred.reject();
	}

	// function _getSearchHelpCreation(fnCreate) {
	// var oSearchHelp;
	// return function() {
	// if (oSearchHelp) {
	// oSearchHelp.clearConditions();
	// oSearchHelp.clearTable();
	// } else {
	// oSearchHelp = fnCreate.apply(this, arguments)
	// }
	// return oSearchHelp;
	// }
	// }

	return oZHE_CLIENT;
});