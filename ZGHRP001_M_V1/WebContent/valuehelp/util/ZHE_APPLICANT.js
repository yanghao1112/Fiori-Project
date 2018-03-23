(function(){
	"use strict";
	
	jQuery.sap.declare("sap.ZG001.timesheet.valuehelp.util.ZHE_APPLICANT");
	
	var oValueHelpDialog = null;
	var oFilterBar = null;
	var oResultTable = null;
	var oTemplate = null;
	var oSearchModel = null;
	var oResultModel = null;
	var oSelectedItems = null;
	var bIsInitialized = false;
	var sServiceUrl = "proxy/sap/opu/odata/sap/ZGOHR004_SRV/?&sap-client=120";
	var oDeferred = null;
	
	/* Initialize for first time */
	function initialize(){
		"use strict";
		
		bIsInitialized = true;
		
		/* Create table line template */
		oTemplate = new sap.m.ColumnListItem({
			customData: [new sap.ui.core.CustomData({key: "Pernr", value: "{result>Pernr}"}),
			             new sap.ui.core.CustomData({key: "Ename", value: "{result>Ename}"}),
			             new sap.ui.core.CustomData({key: "Orgtx", value: "{result>Orgtx}"}),
			             new sap.ui.core.CustomData({key: "Zlname", value: "{result>Zlname}"}),
			             new sap.ui.core.CustomData({key: "Zfname", value: "{result>Zfname}"}),
			             new sap.ui.core.CustomData({key: "ZtsMaCd", value: "{result>ZtsMaCd}"}),
			             new sap.ui.core.CustomData({key: "ZtsTx", value: "{result>ZtsTx}"})
			],
			cells:[
			       new sap.m.ObjectIdentifier({title: "{result>Pernr}"}),
			       new sap.m.ObjectIdentifier({title: "{result>Ename}"}),
			       new sap.m.ObjectIdentifier({title: "{result>Orgtx}"})
			]

		});
		
		
		/* Create ValueHelpDialog */
		oValueHelpDialog = sap.ui.xmlfragment(
				"sap.ZG001.timesheet.valuehelp.view.ZHE_APPLICANT_VH",
				this);
		
		/* Create FilterBar */
		oFilterBar = sap.ui.getCore().byId("ZHE_APPLICANT_FB");
		oFilterBar.setBasicSearch(new sap.m.SearchField({
			value: "{search>/Zfreetext}",
			showSearchButton: false
		}));
		

		oFilterBar.attachSearch(onSearch);
		oFilterBar.attachClear(onClear);

		/* Create Result Table */
		oResultTable = sap.ui.xmlfragment(
				"sap.ZG001.timesheet.valuehelp.view.ZHE_APPLICANT_RT",
				this);
		
		/* Add Result Table to Value Help Dialog */
		oValueHelpDialog.setTable(oResultTable);
		
		oValueHelpDialog.attachSelectionChange(onSelect);
		oValueHelpDialog.attachOk(onOk);
		oValueHelpDialog.attachCancel(onCancel);
		
		/* Initialize models */
		oSearchModel = new sap.ui.model.json.JSONModel();
		oResultModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
		oFilterBar.setModel(oSearchModel, "search");
		oResultTable.setModel(oResultModel, "result");
		
        /* set device model */
        var deviceModel = new sap.ui.model.json.JSONModel(
                {
                    isTouch : sap.ui.Device.support.touch,
                    isNoTouch : !sap.ui.Device.support.touch,
                    isPhone : sap.ui.Device.system.phone,
                    isNoPhone : !sap.ui.Device.system.phone,
                    listMode : sap.ui.Device.system.phone ? "None"
                            : "SingleSelectMaster",
                    listItemType : sap.ui.Device.system.phone ? "Active"
                            : "Inactive",
                    singlePerson : true        
                });
        
        /* set i18n model */
        var sRootPath = jQuery.sap.getModulePath("sap.ZG001.timesheet.valuehelp");
        var i18nModel = new sap.ui.model.resource.ResourceModel({
                    bundleUrl : [ sRootPath, "i18n/i18n.properties" ].join("/")
                });
        
        deviceModel.setDefaultBindingMode("OneWay");
        oFilterBar.setModel(deviceModel, "device");
        oResultTable.setModel(deviceModel, "device");

        oFilterBar.setModel(i18nModel, "i18n");
        oResultTable.setModel(i18nModel, "i18n");
        
		oFilterBar.setModel(oSearchModel, "search");
		oResultTable.setModel(oResultModel, "result");
		
		
	}
	
	/* Clear all conditions */
	function clearConditions(){
		"use strict";
		oSearchModel.setData({
			Pernr: "",
			Orgtx: "",
			Ename: "",
			Zlname: "",
			Zfname: "",
			ZtsMaCd: "",
			ZtsTx: "",
			Zfreetext: ""
		});
	}
	
	/* Clear table entries */
	function clearTable(){
		oResultTable.bindItems({
		    path : "null>/",
		    template: oTemplate
		});
	}
	
	/* Search Button Press Event */
	function onSearch(aEvent){
		"use strict";
		var condArray = [];
		var oFilters = null;
		var oConds = {"Pernr": [], 
				"Ename": [],
				"Orgtx": [],
				"Zfname": [],
				"Zlname": [],
				"ZtsMaCd": [],
				"ZtsTx": [],
				"Zfreetext": []
		}
		
		/* generate conditions for each field */
		$.each(oSearchModel.getData(), function(aKey, aVal){
			if (aVal !== ""){
				oConds[aKey].push(new sap.ui.model.Filter(aKey, "Contains", aVal));
			}
			
		});
		
		/* merge conditions for each field */
		$.each(oConds, function(aKey, aVal){
			if (oConds[aKey].length > 0){
				condArray.push(new sap.ui.model.Filter({
					filters: oConds[aKey],
					and: false
				}));
			}
		});
		
		/* merge all conditions */
		if (condArray.length > 0){
			oFilters = new sap.ui.model.Filter({
				filters: condArray,
				and: true
			})
		}
		
		oResultTable.bindItems({
		    path : "result>/ZHE_APPLICANTSet",
		    template: oTemplate,
		    filters: oFilters
		});
		
	}
	
	/* Select Table Item Event */
	function onSelect(aEvent){
		"use strict";
		var oPara = aEvent.getParameter("tableSelectionParams");
		
		if (oPara.selected === true){
			$.each(oPara.listItems, function(aKey, aVal){
				oSelectedItems[aVal.getCustomData()[0]] = aVal;
			});
		}
		else{
			$.each(oPara.listItems, function(aKey, aVal){
				delete oSelectedItems[aVal.getCustomData()[0]];
			});
		}

	}
	
	/* Clear Button Press Event */
	function onOk(aEvent){
		"use strict";
		var oRet = [];
		var oSelectedData = null;
		
		$.each(oSelectedItems, function(aKey, aValue){
			oSelectedData = {};
			$.each(aValue.getCustomData(), function(aKey2, aValue2){
				oSelectedData[aValue2.getKey()] = aValue2.getValue();
			});
			oRet.push(oSelectedData);
		});
		
		oValueHelpDialog.close();
		oDeferred.resolve(oRet);
	}
	
	/* Clear Button Press Event */
	function onClear(aEvent){
		"use strict";
		clearConditions();
	}

	/* Cancel Button Press Event */
	function onCancel(aEvent){
		"use strict";
		oValueHelpDialog.close();
		oDeferred.reject();
	}
	
	sap.ZG001.timesheet.valuehelp.util.ZHE_APPLICANT = {
		
		/* Open dialog */
		open : function(){
				"use strict";
				
				oDeferred = jQuery.Deferred();
				oSelectedItems = {};
				
				if (bIsInitialized === false){
					initialize();
				}
				else{
					clearConditions();
					clearTable();
				}

				oValueHelpDialog.open();
				oValueHelpDialog.update();
				
				return oDeferred;
		}

	}
})();
